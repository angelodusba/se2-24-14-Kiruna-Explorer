import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Controls,
  Background,
  NodeChange,
  applyNodeChanges,
  Node,
  BackgroundVariant,
  EdgeChange,
  applyEdgeChanges,
  reconnectEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  handleParentExpand,

} from "reactflow";

import { Edge, Connection } from "reactflow";
import "reactflow/dist/style.css";
import dayjs from "dayjs";
import { SearchFilter } from "../../models/SearchFilter";
import ZoomNode from "./ZoomNode";
import ConnectionAPI from "../../API/ConnectionApi";
import DocumentAPI from "../../API/DocumentAPI";
import "./Diagram.css";
import connectionStyles from "./ConnectionStyles";
import SideBar from "./SideBar";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { Button, IconButton } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Legend from "../Legend";
import FloatingEdge from "./FloatingEdge";
import { ConnectionList } from "../../models/Connection";



interface DocumentForDiagram {
  id: number;
  title: string;
  date: string;
  scale: string;
  typeName: string;
  stakeholders: string[];
}

const nodeTypes = {
  zoom: ZoomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
}

// Create an edge type name for each key of connectionStyles
const edgeTypeName = Object.keys(connectionStyles).reduce((acc, key) => {
  if (key !== "default") {
    acc[key] = key;
  }
  return acc;
}, {});

interface DiagramProps {
  currentFilter: SearchFilter;
}

const gridHeight = 400; // Size of the grid cells
const gridWidth = 400; // Width of the grid
const nodeWidth = gridWidth / 4;
const nodeHeight = nodeWidth;
const nodePerRows = 3;
const nodePerColumns = 3;

function Diagram({ currentFilter }: DiagramProps) {
  const [docsNodes, setDocsNodes] = useState<Node[]>([]);
  const [gridNodes, setGridNodes] = useState<Node[]>([]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [yearToShowFirst, setYearToShowFirst] = useState<string>("Year_2020");
  const [refreshViewport, setRefreshViewport] = useState<boolean>(false);

  const onConnect = (params: Connection) => {
    const newEdge = {
      id: `${params.source}-${params.target}-${'default'}`,
      ...params,
      label: 'default',
      type: 'floating',
      style: connectionStyles["default"],
    };
    setEdges((eds) => addEdge(newEdge, eds));
  };


  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    []
  );

  //On edgeClick change edge type to the next one
  const onEdgeClick = (_, edge) => {
    const myEdgeType = edgeTypeName[edge.label];
    const edgeTypeNames = Object.keys(edgeTypeName).filter((key) => key !== "default");
    let currentEdgeType = myEdgeType;

    // Remove all edgeTypeNames that are already in use, except currentEdgeType
    const notUsedEdgeTypeNames = edgeTypeNames.filter(
      (key) => !edges.find((e) => e.id === `${edge.source}-${edge.target}-${key}`)
               && !edges.find((e) => e.id === `${edge.target}-${edge.source}-${key}`)
    )
    
    if (notUsedEdgeTypeNames.length > 0) {
      const index = notUsedEdgeTypeNames.findIndex((key) => key === myEdgeType);
      currentEdgeType = notUsedEdgeTypeNames[(index + 1) % notUsedEdgeTypeNames.length];
    }
    else{
      return;
    }


    const newEdge = { ...edge, id: `${edge.source}-${edge.target}-${currentEdgeType}`,
                      label: currentEdgeType,style: connectionStyles[currentEdgeType] };
    const newEdges = edges.map((e) => (e.id === edge.id ? newEdge : e));
    setEdges(newEdges);
  };

  const assignX_toYear = (year: number, filteredYears: number[]) => {
    //find the index year in filteredYears
    const index = filteredYears.findIndex((f_year) => f_year === year);
    return index;
  };
  const createNode = (doc: DocumentForDiagram, offsetY, offsetX, docYear, connections) => {
    return {
      id: doc.id.toString(),
      type: "zoom",
      data: { type: doc.typeName, id: doc.id, stakeholders: doc.stakeholders, connections: connections },
      draggable: true,
      connectable: true,
      style: {
        width: nodeWidth,
        height: nodeHeight,
        borderRadius: "50%",
        backgroundColor: "#fff",
        border: "2px solid #000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      position: { x: offsetX, y: offsetY },
      parentId: docYear.toString() + "_&_" + doc.scale,
      extent: "parent",
    };
  };
  const createNodesForDocument = async (
    fiteredDocsPerYear: DocumentForDiagram[][]
  ) => {
    let newNodes = [];
    const connections = await ConnectionAPI.getConnections();
    for (const docsPerYear of fiteredDocsPerYear) {
      //Group docs by scale, object with key scale and value array of docs
      const arrayDocsPerScale = docsPerYear.reduce((acc, doc) => {
        acc[doc.scale] = acc[doc.scale] ? [...acc[doc.scale], doc] : [doc];
        return acc;
      }, {});
      // Create nodes for each scale
      for (const scale in arrayDocsPerScale) {
        //sort docs by month
        const docsPerYearPerScale = arrayDocsPerScale[scale];
        const sortedDocs = docsPerYearPerScale.sort((a, b) =>
          dayjs(a.date).diff(dayjs(b.date))
        );
        let nDoc = 0;
        let offsetY = 0;
        let offsetX = 0;
        let nodesToAdd = [];
        for (const doc of sortedDocs) {
          let index_x = nDoc % nodePerRows;
          let index_y = Math.floor(nDoc / nodePerRows);
          offsetX = index_x * nodeWidth;
          offsetY = index_y * nodeHeight;
          const horizontalPadding =
            (gridWidth - nodeWidth * nodePerRows) / (nodePerRows + 1);
          const verticalPadding =
            (gridHeight - nodeHeight * nodePerColumns) / (nodePerColumns + 1);
          offsetX += (index_x + 1) * horizontalPadding;
          offsetY += (index_y + 1) * verticalPadding;
          if (index_y > nodePerColumns) {
            return;
          }
          const docYear = dayjs(doc.date).year();
          nodesToAdd.push(createNode(doc, offsetY, offsetX, docYear, connections));
          nDoc++;
        }
        newNodes = [...newNodes, ...nodesToAdd];
      }
    }
    return newNodes;
  };
  const createEdge = (id1, id2, sourceHandle, targetHandle, type) => {
    return {
      id: `${id1}-${id2}-${type}`,
      source: id1,
      target: id2,
      type: edgeTypes? 'floating': 'default',
      label: type,
      sourceHandle: sourceHandle,
      targetHandle: targetHandle,
      style: connectionStyles[type]
        ? connectionStyles[type]
        : connectionStyles["default"],
    };
  }
  const getHandlesForEdge = (sourcePosition, targetPosition) => {
    const distanceX = targetPosition.x - sourcePosition.x;
    const distanceY = targetPosition.y - sourcePosition.y;

    let targetHandle = "tb";
    let sourceHandle = "st";
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal connection
      if (distanceX > 0) {
        targetHandle = "tl"; // Connect to the left side
        sourceHandle = "sr"; // Connect from the right side
      } else {
        targetHandle = "tr"; // Connect to the right side
        sourceHandle = "sl"; // Connect from the left side
      }
    } else {
      // Vertical connection
      if (distanceY > 0) {
        targetHandle = "tt"; // Connect to the top side
        sourceHandle = "sb"; // Connect from the bottom side
      } else {
        targetHandle = "tb"; // Connect to the bottom side
        sourceHandle = "st"; // Connect from the top side
      }
    }
    return { sourceHandle, targetHandle };
  }
  const createEdges = (connectionsList: any, passed_nodes) => {
    return connectionsList.flatMap((conn: any) => {
      //compare x and y of the nodes, start from the doc with smallest x, if x is the same,
      // start from the one with smallest y
      let id1 = conn.id_doc1.toString();
      let id2 = conn.id_doc2.toString();
      let doc1 = passed_nodes.find((doc) => doc.id == id1);
      let doc2 = passed_nodes.find((doc) => doc.id == id2);
      if (doc1 == null || doc2 == null) {
        return [];
      }

      const sourcePosition = doc1.position;
      const targetPosition = doc2.position;
      const { sourceHandle, targetHandle } = getHandlesForEdge(sourcePosition, targetPosition);

      return conn.connection_types.map((type: string) => {
        return createEdge(id1, id2, sourceHandle, targetHandle, type);
      });
    });
  };
  const saveNewConnections = async () => {
    const connections = edges
      .filter((edge) => edge.type === 'floating' && edge.label !== 'default')
      .map((edge) => {
        const parts = edge.id.split("-");
        //Re order the ids
        if (parseInt(parts[0]) > parseInt(parts[1])) {
          return {
            id_doc1: parseInt(parts[1]),
            id_doc2: parseInt(parts[0]),
            connection_types: [edge.label],
          };
        }
        else
        return {
          id_doc1: parseInt(parts[0]),
          id_doc2: parseInt(parts[1]),
          connection_types: [edge.label],
        };
      })
      .reduce((acc, edge) => {
        const existing = acc.find((e) => (e.id_doc1 === edge.id_doc1 && e.id_doc2 === edge.id_doc2
                                                || e.id_doc1 === edge.id_doc2 && e.id_doc2 === edge.id_doc1) );
        if (existing) {
          existing.connection_types = [...new Set([...existing.connection_types, ...edge.connection_types])];
        } else {
          acc.push(edge);
        }
        return acc;
      }, []);
      const uniqueNodes = [...new Set(connections.flatMap((conn) => [conn.id_doc1, conn.id_doc2]))];
      const sortedNodes = uniqueNodes.sort((a, b) => b - a);
      //Now create connectionLists one for each uniqueNode
      const connectionLists: ConnectionList[] = sortedNodes.map((node) => {
        return {
          starting_document_id: node,
          connections: connections.filter((conn) => conn.id_doc1 === node)
                        .map((conn) => {
                          return {
                            document_id: conn.id_doc2,
                            connection_types: conn.connection_types,
                          };
                        }),
        };
      });
      for (const connectionList of connectionLists) {
        if (connectionList.connections.length > 0){
          await ConnectionAPI.updateConnections(connectionList)
          console.log(connectionList)
        }

      }

  }
  // Fetch docs and create nodes
  useEffect(() => {
    // Fetch Documents
    const fetchDocuments = async () => {
      const response = await DocumentAPI.getFilteredDocuments(currentFilter);
      const list = response.docs.map((doc: any) => {
        return {
          id: doc.id,
          title: doc.title,
          date: doc.issue_date,
          scale: doc.scale.toLowerCase(),
          stakeholders: doc.stakeholders,
          typeName: doc.type.name,
        };
      });
      const minYear = Math.floor(
        Math.min(...list.map((doc) => dayjs(doc.date).year()))
      );
      const maxYear = Math.ceil(
        Math.max(...list.map((doc) => dayjs(doc.date).year()))
      );
      const years = Array.from(
        { length: maxYear - minYear + 1 },
        (_, k) => k + minYear
      );
      //Need to calculate the offset for each scale, to position the nodes correctly
      const numberOfDocumentsPerScale = response.docs.reduce((acc, doc) => {
        const scale = doc.scale.toLowerCase();
        acc[scale] = acc[scale] ? acc[scale] + 1 : 1;
        return acc;
      }, {});
      // Get all scales from numberOfDocumentsPerScale
      const scales = Object.keys(numberOfDocumentsPerScale).map((scale) => ({
        name: scale,
      }));
      //Group docs by year
      const arrayDocsPerYear: DocumentForDiagram[][] = years.map((year) =>
        list.filter((doc) => dayjs(doc.date).year() === year)
      );
      // Keep only years with documents
      const fiteredDocsPerYear = arrayDocsPerYear.filter(
        (docs) => docs.length > 0
      );
      const offsetYPerScale = {};
      let offset = gridHeight;
      // Calculate offset for each grid cell
      scales.forEach((scale) => {
        offsetYPerScale[scale.name] = offset;
        offset += gridHeight;
      });
      //Keep nodes with no documents, used to position docs and years
      const filteredYears = years.filter((year) => {
        return fiteredDocsPerYear.find((docs) =>
          docs[0].date.includes(year.toString())
        );
      });
      //Create a group node for each year-scale tuple
      const groupNodes = {};
      for (const year of filteredYears) {
        for (const scale of scales) {
          groupNodes[year.toString() + "_&_" + scale.name] = {
            id: year.toString() + "_&_" + scale.name,
            data: { label: year.toString() + scale.name },
            position: {
              x: assignX_toYear(year, filteredYears) * gridWidth + gridWidth,
              y: offsetYPerScale[scale.name],
            },
            style: {
              width: gridWidth,
              height: gridHeight,
              backgroundColor: "transparent",
            },
            draggable: false,
            connectable: false,
            type: "group",
            selectable: false,
            focusable: false,
            zIndex: -10,
          };
        }
      }
      // Add nodes in flow
      const groupNodesArray = Object.values(groupNodes) as Node[];
      setGridNodes(groupNodesArray);
      //sort for date
      const documentsNodes = await createNodesForDocument(fiteredDocsPerYear);
      setDocsNodes(documentsNodes);
      // Create nodes for years (COLUMNS)
      const yearNodes: Node[] = filteredYears.map((year, index) => ({
        id: "Year_" + year.toString(),
        data: { label: year.toString() },
        position: { x: index * gridWidth + gridWidth, y: 0 },
        style: {
          width: gridWidth,
          height: gridHeight,
          backgroundColor: "#eeeeee",
          borderRadius: 10,
          border: "2px solid #000",
          color: "#003d8f",
          fontSize: gridWidth / 10,
          fontWeight: "bold",
          textAlign: "center" as const,
          cursor: "default",
        },
        draggable: false,
        connectable: false,
      }));
      //Start year
      setYearToShowFirst(yearNodes[0].id);

      // Create nodes for documents scales, (ROWS)
      const scalesNodes = scales.map((scale, index) => {
        return {
          id: scale.name + index.toString(),
          data: {
            label: scale.name.charAt(0).toUpperCase() + scale.name.slice(1),
          },
          position: { x: 0, y: offsetYPerScale[scale.name] },
          style: {
            width: gridWidth,
            height: gridHeight,
            backgroundColor: "#eeeeee",
            border: "2px solid #000",
            color: "#003d8f",
            borderRadius: 10,
            fontWeight: "bold",
            fontSize: gridWidth / 10,
            textAlign: "center" as const,
            cursor: "default",
          },
          draggable: false,
          connectable: false,
          HideSource: true,
          HideTarget: true,
        };
      });
      //merge years and document Nodes
      const merge = [...yearNodes, ...scalesNodes, ...groupNodesArray];
      setNodes(merge);
    };
    fetchDocuments();
  }, [currentFilter]);

  useEffect(() => {
    const setDocsNodesAndFetchConnections = async () => {
      if (gridNodes.length > 0 && docsNodes.length > 0) {
        setNodes((nds) => [...nds, ...docsNodes]);
        //Now fetch connections
        const connections = await ConnectionAPI.getConnections();
        //create Edges
        const edges = createEdges(connections, docsNodes);
        setEdges(edges);
        //refresh viewport via state change
        setRefreshViewport(!refreshViewport);
      }
    };
    setDocsNodesAndFetchConnections();
  }, [gridNodes, docsNodes]);

  return (
    <ReactFlowProvider>
      <Flow
        docsNodes={docsNodes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        nodeTypes={nodeTypes}
        edgeTypes = {edgeTypes? edgeTypes : undefined}
        yearToShowFirst={yearToShowFirst}
        currentFilter={currentFilter}
        resetViewport={refreshViewport}
        gridNodes={gridNodes}
        saveNewConnections={saveNewConnections}
      />

      <Outlet />
    </ReactFlowProvider>
  );
}

function Flow({
  docsNodes,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onEdgeClick,
  resetViewport,
  onConnect,
  onEdgeUpdate,
  nodeTypes,
  edgeTypes,
  yearToShowFirst,
  currentFilter,
  gridNodes,
  saveNewConnections,
}) {
  const { setViewport, getViewport } = useReactFlow(); // Get viewport control methods

  const handlePan = (direction) => {
    const { x, y, zoom } = getViewport(); // Get current viewport position
    const keypanStep = (gridWidth) / zoom; // Amount to pan
    switch (direction) {
      case "left":
        setViewport({ x: x + keypanStep, y, zoom });
        break;
      case "right":
        setViewport({ x: x - keypanStep, y, zoom });
        break;
      default:
        break;
    }
  };

  //Center viewport on first node, cover 2 years before
  useEffect(() => {
    if (gridNodes.length > 0) {
      const minX = Math.min(...gridNodes.map((node) => node.position.x));
      const minY = Math.min(...gridNodes.map((node) => node.position.y));
      const maxY = Math.max(...gridNodes.map((node) => node.position.y));
      const zoom = window.innerHeight / (maxY - minY + gridHeight * 2);
      const newViewport = {
        x: -minX * zoom + gridWidth * zoom,
        y: -minY * zoom + gridHeight * zoom,
        zoom: zoom,
      };
      setViewport(newViewport);
    }
  }, [currentFilter, yearToShowFirst, resetViewport]);

  const navigate = useNavigate();

  const onNodeClick = (_, node) => {
    if (docsNodes.some((doc) => doc.id == node.id)) {
      const { zoom } = getViewport();
      const offsetX = -gridNodes.find(
        (gridNode) => gridNode.id === node.parentId
      ).position.x;
      const offsetY = -gridNodes.find(
        (gridNode) => gridNode.id === node.parentId
      ).position.y;
      const viewportX =
        offsetX * zoom + window.innerWidth / 2 - (nodeWidth * zoom) / 2;
      const viewportY =
        offsetY * zoom + window.innerHeight / 2 - (gridHeight * zoom) / 2;
      const newViewport = {
        x: viewportX + nodeWidth * zoom,
        y: viewportY,
        zoom,
      };
      setViewport(newViewport, { duration: 800 });
      navigate(`/diagram/${node.id}`);
    }
  };


  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "auto" }}>
      <Legend></Legend>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes? edgeTypes : undefined}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        zoomOnScroll={false}
        minZoom={0.1}
        maxZoom={3}
        panOnScroll
        panOnDrag
        fitView>
        <div
          style={{ position: "absolute", bottom: 10, right: 80, zIndex: 10, width: 10 }}>
          <IconButton
            onClick={() => handlePan("left")}
            sx={{ background: "#003d8f", "&:hover": { background: "#003d8f" } }}>
            <ArrowCircleLeftOutlinedIcon sx={{ color: "white" }} />
          </IconButton>
          <IconButton
            onClick={() => handlePan("right")}
            sx={{ background: "#003d8f", "&:hover": { background: "#003d8f" } }}>
            <ArrowCircleRightOutlinedIcon sx={{ color: "white" }} />
          </IconButton>
        </div>
        <Button onClick={() => saveNewConnections()} 
          style={
            {
              position: "absolute",
              bottom: 10,
              right: 80 + 20,
              zIndex: 10,
              background: "pink",
              color: "white"
            }
          }>
          Save new connections
        </Button>
        <Controls position="bottom-right" />
        <Background
          gap={gridWidth}
          variant={BackgroundVariant.Dots}
          color="#aaa"
        />
        <SideBar />
      </ReactFlow>
    </div>
  );
}

export default Diagram;
