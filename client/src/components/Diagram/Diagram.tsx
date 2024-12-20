import { useCallback, useContext, useEffect, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  Node,
  reconnectEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  useOnViewportChange,
  Viewport,
} from "reactflow";
import { Edge, Connection } from "reactflow";
import "reactflow/dist/style.css";
import dayjs from "dayjs";
import { SearchFilter } from "../../models/SearchFilter";
import ZoomNode from "./ZoomNode";
import ConnectionAPI from "../../API/ConnectionApi";
import DocumentAPI from "../../API/DocumentAPI";
import "./Diagram.css";
import connectionStyles from "../shared/ConnectionStyles";
import { Button } from "@mui/material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Legend from "../shared/Legend";
import FloatingEdge from "./FloatingEdge";
import { ConnectionList } from "../../models/Connection";
import Axis from "./Axis";
import UserContext from "../../contexts/UserContext";
import { Role } from "../../models/User";

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
};

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

function Diagram({ currentFilter }: Readonly<DiagramProps>) {
  const user = useContext(UserContext);
  const [docsNodes, setDocsNodes] = useState<Node[]>([]);
  const [gridNodes, setGridNodes] = useState<Node[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [refreshViewport, setRefreshViewport] = useState<boolean>(false);
  const [valuesX, setValuesX] = useState<{ id: number; label: string }[]>([]);
  const [valuesY, setValuesY] = useState<{ id: number; label: string }[]>([]);
  const [deletedConnections, setDeletedConnections] = useState([]);


  const deleteEdge = async (id) => {
    const edgeId = Array.isArray(id) ? id[0].id : id;
    console.log("deleteEdge", edgeId);
    const edge = edges.find((el) => el.id === edgeId);
    //If edge is not default, add it to deletedConnections
    if (edge.label !== "default") {
      setDeletedConnections((els) => [...els, edge]);
    }
    setEdges((els) => els.filter((el) => el.id !== edgeId));
  };

  const onConnect = (params: Connection) => {
    if(!(user && user.role === Role.UrbanPlanner)){
      //Display an alert
      alert("Only Urban Planners can create new connections");
      return;
    }
    //If a default edge is already present, return
    if (
      edges.find(
        (edge) =>
          edge.source === params.source &&
          edge.target === params.target &&
          edge.label === "default"
      )
    ) {
      alert("Default edge already present");
      return;
    }
    const newEdge = {
      id: `${params.source}-${params.target}-${"default"}`,
      ...params,
      label: "default",
      type: "floating",
      style: connectionStyles["default"],
      data: {
        onDelete: () =>
          deleteEdge(`${params.source}-${params.target}-${"default"}`),
      },
    };
    const newEdges = edges.concat(newEdge);
    setEdges(newEdges);
  };

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    []
  );

  const [allEdges, setAllEdges] = useState(undefined);
  const [allNodes, setAllNodes] = useState(undefined);
  const [edgeIsClicked, setEdgeIsClicked] = useState(false);

  //on edge click leave only the nodes connected to the edge
  const onEdgeClick = (event, edge) => {
    let pressTimer;
    const handlePressStart = () => {
      pressTimer = setTimeout(() => {
        if (!edgeIsClicked) {
          const edgesToKeep = edges.filter(
            (e) => e.source == edge.source || e.target == edge.target
          );
          const nodesToKeep = nodes.filter(
            (node) =>
              node.id === edge.source ||
              node.id === edge.target ||
              node.type === "group"
          );
          setAllEdges(edges);
          setAllNodes(nodes);
          setNodes(nodesToKeep);
          setEdges(edgesToKeep);
          setEdgeIsClicked(true);
        } else {
          // Remove deletedConnections from allEdges
          const newEdges = allEdges.filter(
            (edge) =>
              !deletedConnections.find((deletedEdge) => deletedEdge.id === edge.id)
              && !edges.find((el) => el.source === edge.source && el.target === edge.target)
          );
          const concatEdges = newEdges.concat(edges);
          setNodes(allNodes);
          setEdges(concatEdges);
          setEdgeIsClicked(false);
        }
      }, 500);
    };

    const handlePressEnd = () => {
      clearTimeout(pressTimer);
    };

    event.target.addEventListener("mousedown", handlePressStart);
    event.target.addEventListener("mouseup", handlePressEnd);
    event.target.addEventListener("mouseleave", handlePressEnd);
  };
  //On edgeDoubleClick change edge type to the next one
  const onEdgeDoubleClick = (_, edge) => {

    if(!(user && user.role === Role.UrbanPlanner)){
      //Display an alert
      alert("Only Urban Planners can change the edge type");
      return;
    }

    const myEdgeType = edgeTypeName[edge.label];
    const edgeTypeNames = Object.keys(edgeTypeName).filter(
      (key) => key !== "default"
    );
    let currentEdgeType = myEdgeType;

    // Remove all edgeTypeNames that are already in use, except the myEdgeType
    const notUsedEdgeTypeNames = edgeTypeNames.filter(
      (key) =>
        !edges.find((e) => e.id === `${edge.source}-${edge.target}-${key}`) &&
        !edges.find((e) => e.id === `${edge.target}-${edge.source}-${key}`)
    );
    notUsedEdgeTypeNames.push(myEdgeType);
    //Filter so each time i click i get the next edge type
    const sortedEdgeTypes = notUsedEdgeTypeNames.sort((a, b) =>
      a.localeCompare(b)
    );
    if (sortedEdgeTypes.length > 0) {
      const index = sortedEdgeTypes.findIndex((key) => key === myEdgeType);
      currentEdgeType = sortedEdgeTypes[(index + 1) % sortedEdgeTypes.length];
    } else {
      return;
    }

    const newEdge = {
      id: `${edge.source}-${edge.target}-${currentEdgeType}`,
      label: currentEdgeType,
      type: edge.type,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      style: connectionStyles[currentEdgeType],
      data: {
        onDelete: () =>
          deleteEdge(`${edge.source}-${edge.target}-${currentEdgeType}`),
        pointPosition: edge.data.pointPosition,
      },
    };
    setDeletedConnections((els) => [...els, edge]);
    setEdges((els) => els.map((el) => (el.id === edge.id ? newEdge : el)));
  };

  const assignX_toYear = (year: number, filteredYears: number[]) => {
    //find the index year in filteredYears
    const index = filteredYears.findIndex((f_year) => f_year === year);
    return index;
  };
  const createNode = (
    doc: DocumentForDiagram,
    offsetY,
    offsetX,
    docYear,
    connections
  ) => {
    return {
      id: doc.id.toString(),
      type: "zoom",
      data: {
        type: doc.typeName,
        id: doc.id,
        title: doc.title,
        stakeholders: doc.stakeholders,
        connections: connections,
      },
      draggable: true,
      connectable: true,
      style: {
        width: nodeWidth,
        height: nodeHeight,
        backgroundColor: "#fff",
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
        const nodesToAdd = [];
        for (const doc of sortedDocs) {
          const index_x = nDoc % nodePerRows;
          const index_y = Math.floor(nDoc / nodePerRows);
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
          nodesToAdd.push(
            createNode(doc, offsetY, offsetX, docYear, connections)
          );
          nDoc++;
        }
        newNodes = [...newNodes, ...nodesToAdd];
      }
    }
    return newNodes;
  };
  const createEdge = (id1, id2, sourceHandle, targetHandle, type, index) => {
    return {
      id: `${id1}-${id2}-${type}`,
      source: id1,
      sourceHandle: sourceHandle,
      target: id2,
      targetHandle: targetHandle,
      type: edgeTypes ? "floating" : "default",
      label: type,
      style: connectionStyles[type]
        ? connectionStyles[type]
        : connectionStyles["default"],
      data: {
        onDelete: async () => deleteEdge(`${id1}-${id2}-${type}`),
        index: index,
        user: user,
      },
    };
  };
  const getHandlesForEdge = (sourcePosition, targetPosition) => {
    const distanceX = targetPosition.x - sourcePosition.x;
    const distanceY = targetPosition.y - sourcePosition.y;

    let targetHandle = "tl";
    let sourceHandle = "sr";
    if (Math.abs(distanceX) >= Math.abs(distanceY)) {
      // Horizontal connection
      targetHandle = "tl"; // Connect to the left side
      sourceHandle = "sr"; // Connect from the right side
    } else {
      // Vertical connection
      targetHandle = "tt"; // Connect to the top side
      sourceHandle = "sb"; // Connect from the bottom side
    }
    return { sourceHandle, targetHandle };
  };
  const createEdges = (connectionsList: any, passed_nodes) => {
    return connectionsList.flatMap((conn: any) => {
      //compare x and y of the nodes, start from the doc with smallest x, if x is the same,
      // start from the one with smallest y
      let id1 = conn.id_doc1.toString();
      let id2 = conn.id_doc2.toString();
      const doc1 = passed_nodes.find((doc) => doc.id == id1);
      const doc2 = passed_nodes.find((doc) => doc.id == id2);
      if (doc1 == null || doc2 == null) {
        return [];
      }

      //Get grid position of node 1 and 2
      const grid1 = nodes.find((node) => node.id === doc1.parentId);
      const grid2 = nodes.find((node) => node.id === doc2.parentId);

      let sourcePosition = {
        x: doc1.position.x + grid1.position.x,
        y: doc1.position.y + grid1.position.y,
      };
      let targetPosition = {
        x: doc2.position.x + grid2.position.x,
        y: doc2.position.y + grid2.position.y,
      };

      if (sourcePosition.x > targetPosition.x) {
        id1 = conn.id_doc2.toString();
        id2 = conn.id_doc1.toString();
        sourcePosition = {
          x: doc2.position.x + grid2.position.x,
          y: doc2.position.y + grid2.position.y,
        };
        targetPosition = {
          x: doc1.position.x + grid1.position.x,
          y: doc1.position.y + grid1.position.y,
        };
      } else if (
        sourcePosition.x === targetPosition.x &&
        sourcePosition.y > targetPosition.y
      ) {
        id1 = conn.id_doc2.toString();
        id2 = conn.id_doc1.toString();
        sourcePosition = {
          x: doc2.position.x + grid2.position.x,
          y: doc2.position.y + grid2.position.y,
        };
        targetPosition = {
          x: doc1.position.x + grid1.position.x,
          y: doc1.position.y + grid1.position.y,
        };
      }

      const { sourceHandle, targetHandle } = getHandlesForEdge(
        sourcePosition,
        targetPosition
      );

      return conn.connection_types.map((type: string, index) => {
        return createEdge(id1, id2, sourceHandle, targetHandle, type, index);
      });
    });
  };
  const saveNewConnections = async () => {

    const connections = edges
      .filter((edge) => edge.type === "floating" && edge.label !== "default")
      .map((edge) => {
        const parts = edge.id.split("-");
        //Re order the ids
        if (parseInt(parts[0]) > parseInt(parts[1])) {
          return {
            id_doc1: parseInt(parts[1]),
            id_doc2: parseInt(parts[0]),
            connection_types: [edge.label],
          };
        } else
          return {
            id_doc1: parseInt(parts[0]),
            id_doc2: parseInt(parts[1]),
            connection_types: [edge.label],
          };
      })
      .reduce((acc, edge) => {
        const existing = acc.find(
          (e) =>
            (e.id_doc1 === edge.id_doc1 && e.id_doc2 === edge.id_doc2) ||
            (e.id_doc1 === edge.id_doc2 && e.id_doc2 === edge.id_doc1)
        );

        if (existing) {
          existing.connection_types = [
            ...new Set([
              ...existing.connection_types,
              ...edge.connection_types,
            ]),
          ];
        } else {
          acc.push(edge);
        }
        return acc;
      }, []);
    const uniqueNodes = [
      ...new Set(connections.flatMap((conn) => [conn.id_doc1, conn.id_doc2])),
    ];
    const sortedNodes = uniqueNodes.sort((a, b) => b - a);
    //Now create connectionLists one for each uniqueNode
    const connectionLists: ConnectionList[] = sortedNodes.map((node) => {
      return {
        starting_document_id: node,
        connections: connections
          .filter((conn) => conn.id_doc1 === node)
          .map((conn) => {
            return {
              document_id: conn.id_doc2,
              connection_types: conn.connection_types,
            };
          }),
      };
    });
    
    //Before saving delete connections from deletedConnections
    //Create one connectionList from each deleted connections
    const deletedConnectionLists = deletedConnections.map((edge) => {
      const parts = edge.id.split("-");
      return {
        starting_document_id: parseInt(parts[0]),
        connections: [
          {
            document_id: parseInt(parts[1]),
            connection_types: [edge.label],
          },
        ],
      };
    });
    for (const connectionList of deletedConnectionLists) {
        await ConnectionAPI.deleteConnections(connectionList);
    }
    setDeletedConnections([]);

    for (const connectionList of connectionLists) {
      if (connectionList.connections.length > 0) {
        await ConnectionAPI.updateConnectionsDiagram(connectionList);
      }
    }
  };
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
              x:
                assignX_toYear(year, filteredYears) * gridWidth +
                gridWidth +
                gridWidth / 100,
              y: offsetYPerScale[scale.name] + gridHeight / 100,
            },
            style: {
              width: gridWidth - gridWidth / 50,
              height: gridHeight - gridHeight / 50,
              background: "transparent",
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
      // Set values for x / y axes
      const valuesY = scales.map((scale, index) => {
        return { id: index, label: scale.name };
      });
      const valuesX = filteredYears.map((year, index) => {
        return {
          id: index,
          label: year.toString(),
        };
      });
      setValuesX(valuesX);
      setValuesY(valuesY);
      setNodes(groupNodesArray);
    };
    fetchDocuments();
  }, [currentFilter]);

  useEffect(() => {
    const setDocsNodesAndFetchConnections = async () => {
      if (gridNodes.length > 0 && docsNodes.length > 0) {
        setNodes((nds) => [...nds, ...docsNodes]);
        // Fetch connections
        const connections = await ConnectionAPI.getConnections();
        // Create Edges
        const edges = createEdges(connections, docsNodes);
        setEdges(edges);
        // Refresh viewport via state change
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
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        gridNodes={gridNodes}
        saveNewConnections={saveNewConnections}
        valuesX={valuesX}
        valuesY={valuesY}
        user={user}
        deleteEdge={deleteEdge}
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
  onEdgeDoubleClick,
  onEdgeClick,
  onConnect,
  onEdgeUpdate,
  nodeTypes,
  edgeTypes,
  gridNodes,
  saveNewConnections,
  valuesX,
  valuesY,
  user,
  deleteEdge,
}) {
  const navigate = useNavigate();
  const selectedDocId = Number(useParams().id);
  const flow = useReactFlow();
  const defaultViewport: Viewport = { x: 0, y: 0, zoom: 0.2 };
  const [viewport, setViewport] = useState<Viewport>(defaultViewport);
  const bounds = {
    xMin: -1 * (valuesX.length - 3) * gridWidth * viewport.zoom,
    xMax: 0,
    yMin: -1 * (valuesY.length - 2) * gridHeight * viewport.zoom,
    yMax: 0,
  };

  useOnViewportChange({
    onStart: setViewport,
    onChange: setViewport,
    onEnd: setViewport,
  });

  //Center viewport on first node, cover 2 years before
  const handleMove = (event, viewport: Viewport) => {
    if (!event) return; // Ex: resetting the view doesn't produce a move event
    const { x, y, zoom } = viewport;
    // if x and y don't correspond to their limited version it means they are out of boundaries
    const limitedX = Math.max(bounds.xMin, Math.min(bounds.xMax, x));
    const limitedY = Math.max(bounds.yMin, Math.min(bounds.yMax, y));
    // Set the viewport only if clamping was necessary
    if (x !== limitedX || y !== limitedY) {
      event.preventDefault(); // Prevent uncontrolled panning
      flow.setViewport({ x: limitedX, y: limitedY, zoom }); // Update viewport state
    }
  };

  const onNodeClick = (_, node) => {
    if(node.type === "group") return;
    if(!node.id) return;
    navigate(`/diagram/${node.id}`);    
  };

  useEffect(() => {
    if (selectedDocId && docsNodes.some((doc) => doc.id == selectedDocId)) {
      const node = docsNodes.find((node) => node.id == selectedDocId);
      const zoom = defaultViewport.zoom * 3;
      const offsetX = -gridNodes.find(
        (gridNode) => gridNode.id === node.parentId
      ).position.x - node.position.x;
      const offsetY = -gridNodes.find(
        (gridNode) => gridNode.id === node.parentId
      ).position.y - node.position.y;
      const viewportX =
        offsetX * zoom + window.innerWidth / 2 - (nodeWidth * zoom) / 2;
      const viewportY =
        offsetY * zoom + window.innerHeight / 2 - (gridHeight * zoom) / 2;
      const newViewport = {
        x: viewportX + 300,
        y: viewportY,
        zoom,
      };
      flow.setViewport(newViewport, { duration: 800 });
    }
  }, [docsNodes, selectedDocId]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "auto",
        paddingTop: "72px",
      }}>
      <ReactFlow 
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeClick}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgeClick={onEdgeClick}
        onEdgesDelete={deleteEdge}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onMove={handleMove}
        onClick={(event) => {
          event.stopPropagation();
        }}
        zoomOnDoubleClick={false}
        zoomOnScroll={true}
        minZoom={0.2}
        maxZoom={0.8}
        defaultViewport={defaultViewport}
        panOnDrag>
        <Axis
          baseWidth={gridWidth}
          baseHeight={gridHeight}
          type={"x"}
          data={valuesX}
          offset={gridWidth}
          viewport={viewport}
        />
        <Axis
          baseWidth={gridWidth}
          baseHeight={gridHeight}
          type={"y"}
          data={valuesY}
          offset={gridHeight}
          viewport={viewport}
        />
        <Controls
          position="bottom-right"
          showInteractive={false}
          style={{ position: "fixed" }}
          onFitView={() => {
            flow.setViewport({ x: 0, y: 0, zoom: 0.2 });
            setViewport({ x: 0, y: 0, zoom: 0.2 });
          }}
        />
        <Background gap={gridWidth * 100} />
        <Legend />
      </ReactFlow>
      {user && user.role === Role.UrbanPlanner && (
        <Button
          onClick={() => saveNewConnections()}
          style={{
            position: "absolute",
            bottom: 35,
            right: 60,
            zIndex: 200,
            background: "#003d8f",
            color: "white",
          }}>
          Save new connections
        </Button>
      )}
    </div>
  );
}

export default Diagram;
