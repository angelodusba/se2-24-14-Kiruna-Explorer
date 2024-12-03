import { useCallback, useEffect, useState, useMemo } from "react";
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
} from "reactflow";
import { createHighlitedIcon, createCustomIcon } from "../Map/Icons";
import { Edge, Connection } from "reactflow";
import "reactflow/dist/style.css";
import dayjs from "dayjs";
import { SearchFilter } from "../../models/SearchFilter";

import ConnectionAPI from "../../API/ConnectionApi";
import DocumentAPI from "../../API/DocumentAPI";
import "./Diagram.css";

interface DocumentForDiagram {
  id: number;
  title: string;
  date: string;
  scale: string;
  typeName: string;
  stakeholders: string[];
}
import ZoomNode from "./ZoomNode";
const nodeTypes = {
  zoom: ZoomNode,
};

const gridHeight = 200; // Size of the grid cells
const gridWidth = 400; // Width of the grid
const nodeWidth = gridWidth / 4;
const nodeHeight = nodeWidth;

const initialEdges: Edge[] = [];
import CustomEdge from "./CustomEdge";
const nodeClassName = (node) => node.type;

const edgeTypes = {
  animated: CustomEdge,
};

interface DiagramProps {
  currentFilter: SearchFilter;
}

function Diagram({ currentFilter }: DiagramProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [yearToShowFirst, setYearToShowFirst] = useState<number>(0);
  const [refreshViewport, setRefreshViewport] = useState<boolean>(false);

  const onNodesChange = (changes: NodeChange[]) =>
    setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes: EdgeChange[]) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els)),
    []
  );
  const assignX_toDate = (date: string, minYear: number) => {
    const d = dayjs(date);
    return d.year() + d.month() / 12 - minYear;
  };
  const createNode = (doc: DocumentForDiagram, index, offset, minYear) => {
    return {
      id: doc.id.toString(),
      type: "zoom",
      data: { type: doc.typeName, id: doc.id, stakeholders: doc.stakeholders },
      position: {
        x: assignX_toDate(doc.date, minYear) * gridWidth + gridWidth,
        y: index * gridHeight + offset,
      },
      draggable: false,
      connectable: true,
      style: {
        width: nodeWidth,
        height: nodeHeight,
        borderRadius: "50%",
        backgroundColor: "#fff",
        border: "1px solid #000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      
    };
  };
  const createNodesForDocument = (
    fiteredDocsPerYear: DocumentForDiagram[][],
    minYear,
    offsetYPerScale
  ) => {
    let newNodes = [];
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
        const sortedDocs = docsPerYearPerScale.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
        const nodesToAdd = sortedDocs.map((doc, index) =>
          createNode(doc, index, offsetYPerScale[scale], minYear)
        );
        newNodes = [...newNodes, ...nodesToAdd];
      }
    }
    return newNodes;
  };
  const createEdges = (connections: Connection[], passed_nodes) => {
    return connections.flatMap((conn: any) => {
      //compare x and y of the nodes, start from the doc with smallest x, if x is the same,
      // start from the one with smallest y
      let id1 = conn.id_doc1.toString();
      let id2 = conn.id_doc2.toString();
      let doc1 = passed_nodes.find((doc) => doc.id == id1);
      let doc2 = passed_nodes.find((doc) => doc.id == id2);
      if (doc1 == null || doc2 == null) {
        return [];
      }
      if (doc1.position.x > doc2.position.x) {
        [id1, id2] = [id2, id1];
      } else if (doc1.position.x == doc2.position.x && doc1.position.y > doc2.position.y) {
        [id1, id2] = [id2, id1];
      }
      return conn.connection_types.map((type: string) => {
        return {
          id: `${id1}-${id2}-${type}`,
          source: id1,
          target: id2,
          type: "animated",
          label: type,
        };
      });
    });
  };
  // Fetch docs and create nodes
  useEffect(() => {
    console.log(currentFilter);
    // Fetch Documents
    const fetchDocumentsAndConnections = async () => {
      const response = await DocumentAPI.getFilteredDocuments(currentFilter);
      const list = response.docs.map((doc: any, _: number) => {
        return {
          id: doc.id,
          title: doc.title,
          date: doc.issue_date,
          scale: doc.scale.toLowerCase(),
          stakeholders: doc.stakeholders,
          typeName: doc.type.name,
        };
      });
      const minYear = Math.floor(Math.min(...list.map((doc) => dayjs(doc.date).year())));
      const maxYear = Math.ceil(Math.max(...list.map((doc) => dayjs(doc.date).year())));
      const years = Array.from({ length: maxYear - minYear + 1 }, (_, k) => k + minYear);
      //Need to calculate the offset for each scale, to position the nodes correctly
      const numberOfDocumentsPerScale = response.docs.reduce((acc, doc) => {
        const scale = doc.scale.toLowerCase();
        acc[scale] = acc[scale] ? acc[scale] + 1 : 1;
        return acc;
      }, {});

      // Get all scales from numberOfDocumentsPerScale
      const scales = Object.keys(numberOfDocumentsPerScale).map((scale) => ({ name: scale }));

      //Group docs by year
      const arrayDocsPerYear: DocumentForDiagram[][] = years.map((year) =>
        list.filter((doc) => dayjs(doc.date).year() === year)
      );
      // Keep only years with documents
      const fiteredDocsPerYear = arrayDocsPerYear.filter((docs) => docs.length > 0);
      const offsetYPerScale = {};
      let offset = gridHeight;
      const maxDocsPerScale = {};
      // Give the height of a scale as the maximum number of documents in a year for that scale
      scales.forEach((scale) => {
        offsetYPerScale[scale.name] = offset;
        let max = 1;
        for (const docsPerYear of fiteredDocsPerYear) {
          const filteredByScale = docsPerYear.filter((doc) => doc.scale === scale.name);
          if (filteredByScale.length > max) {
            max = filteredByScale.length;
          }
        }
        maxDocsPerScale[scale.name] = max;
        offset += gridHeight * max;
      });

      //sort for date
      const docsNodes = createNodesForDocument(fiteredDocsPerYear, minYear, offsetYPerScale);
      const sortedNodesByID = docsNodes.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      //Keep track of last year_node id to not overlap
      // Create nodes for years (COLUMNS)
      let lastID = sortedNodesByID[sortedNodesByID.length - 1].id;
      const yearNodes: Node[] = years.map((year, index) => ({
        id: (index + Number(lastID) + 1).toString(),
        data: { label: year.toString() },
        position: { x: (year - minYear) * gridWidth + gridWidth, y: 0 },
        style: {
          width: gridWidth,
          height: gridHeight,
          backgroundColor: "000",
          borderRadius: 10,
          fontSize: gridWidth / 10,
          textAlign: "center" as const,
        },
        draggable: false,
        connectable: false,
      }));
      //Start year
      setYearToShowFirst(Number(yearNodes[0].id));
      lastID = Number(yearNodes[yearNodes.length - 1].id);
      //Last year
      //setYearToShowFirst(lastID)
      // Create nodes for documents scales, (ROWS)
      const scalesNodes = scales.map((scale, index) => {
        return {
          id: (index + lastID + 1).toString(),
          data: { label: scale.name },
          position: { x: 0, y: offsetYPerScale[scale.name] },
          style: {
            width: gridWidth,
            height: gridHeight * maxDocsPerScale[scale.name],
            backgroundColor: "red",
            borderRadius: 10,
            fontSize: gridWidth / 10,
            textAlign: "center" as const,
          },
          draggable: false,
          connectable: false,
          HideSource: true,
          HideTarget: true,
        };
      });
      //merge years and document Nodes
      const merge = [...yearNodes, ...scalesNodes, ...docsNodes];
      setNodes(merge);

      //Now fetch connections
      const connections = await ConnectionAPI.getConnections();
      //create Edges
      const edges = createEdges(connections, docsNodes);
      setEdges(edges);
      //refresh viewport via state change
      setRefreshViewport(!refreshViewport);
    };
    fetchDocumentsAndConnections();
  }, [currentFilter]);

  return (
    <ReactFlowProvider>
      <Flow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        yearToShowFirst={yearToShowFirst}
        currentFilter={currentFilter}
        resetViewport={refreshViewport}
      />
      <Outlet />
    </ReactFlowProvider>
  );
}

import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import { IconButton } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { icon } from "leaflet";

function Flow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  resetViewport,
  onConnect,
  onEdgeUpdate,
  nodeTypes,
  edgeTypes,
  yearToShowFirst,
  currentFilter,
}) {
  const { setViewport, getViewport } = useReactFlow(); // Get viewport control methods

  const handlePan = (direction) => {
    const { x, y, zoom } = getViewport(); // Get current viewport position
    const keypanStep = (gridWidth * 5) / zoom; // Amount to pan
    switch (direction) {
      case "up":
        setViewport({ x, y: y + keypanStep, zoom });
        break;
      case "down":
        setViewport({ x, y: y - keypanStep, zoom });
        break;
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
    if (nodes.length > 0) {
      const index = nodes.findIndex((node) => node.id == yearToShowFirst);
      console.log(nodes[index]);
      const firstNode = nodes[index];
      const firstNodeX = -firstNode.position.x;
      const firstNodeY = -firstNode.position.y;
      const zoom = 0.5;
      const coveredYearsBefore = 2;
      const newViewport = {
        x: (firstNodeX + coveredYearsBefore * gridWidth) * zoom,
        y: (firstNodeY + gridHeight) * zoom,
        zoom: zoom,
      };
      setViewport(newViewport);
    }
  }, [currentFilter, yearToShowFirst, resetViewport]);

  const navigate = useNavigate();

  const onNodeClick = (_, node) => {
    const { zoom } = getViewport();
    const nodeX = -node.position.x * zoom + window.innerWidth / 2 - nodeWidth * zoom / 2;
    const nodeY = -node.position.y * zoom + window.innerHeight / 2 - gridHeight * zoom / 2;
    const newViewport = { x: nodeX + nodeWidth*zoom, y: nodeY, zoom };
    setViewport(newViewport, { duration: 800 });
    navigate(`/diagram/${node.id}`);
  };

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "auto" }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        edgeTypes={edgeTypes}
        onEdgeUpdate={onEdgeUpdate}
        zoomOnScroll={false}
        minZoom={0.1}
        maxZoom={3}
        panOnScroll
        panOnDrag
        fitView
      >
        <div style={{ position: "absolute", bottom: 10, right: 10, zIndex: 10 }}>
          <IconButton onClick={() => handlePan("left")} sx={{ background: "pink" }}>
            <ArrowCircleLeftOutlinedIcon sx={{ color: "white" }} />
          </IconButton>
          <IconButton onClick={() => handlePan("right")} sx={{ background: "pink" }}>
            <ArrowCircleRightOutlinedIcon sx={{ color: "white" }} />
          </IconButton>
        </div>
        <Controls />
        <Background gap={gridWidth} variant={BackgroundVariant.Lines} color="#aaa" />
      </ReactFlow>
    </div>
  );
}

export default Diagram;
