import React, { useEffect, useState } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, MiniMap, Controls, Background, NodeChange, applyNodeChanges, Node, PanOnScrollMode, BackgroundVariant, EdgeProps, BezierEdge, EdgeChange, applyEdgeChanges, useReactFlow, useViewport, TextAlign } from 'reactflow';
import { Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import DocumentAPI from '../../API/DocumentAPI';
import { fontGrid } from '@mui/material/styles/cssUtils';
import dayjs from 'dayjs';
import { Search } from 'react-router-dom';
import { SearchFilter } from '../../models/SearchFilter';

interface DocumentForDiagram {
    id: number;
    title: string;
    date: number;
}
import ZoomNode from './ZoomNode';
const nodeTypes = {
    zoom: ZoomNode,
};

const gridHeight = 200; // Size of the grid cells
const gridWidth = 400; // Width of the grid

const initialEdges: Edge[] = [];
const DefaultEdge: React.FC<EdgeProps> = (props) => <BezierEdge {...props} />;
const RedEdge: React.FC<EdgeProps> = (props) => <BezierEdge {...props} style={{ stroke: 'red' }} animated />;
const BlueEdge: React.FC<EdgeProps> = (props) => <BezierEdge {...props} style={{ stroke: 'blue' }} animated />;

const nodeClassName = (node) => node.type;

const edgeTypes = {
    default: DefaultEdge,
    red: RedEdge,
    blue: BlueEdge,
};

interface DiagramProps {

    currentFilter: SearchFilter;
  
  }

function Diagram({currentFilter}: DiagramProps) {

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [documents, setDocuments] = useState<DocumentForDiagram[]>([]);

    const onNodesChange = (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds));
    const onEdgesChange = (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds));
    const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

    const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
        event.stopPropagation();
        setEdges((eds) =>
            eds.map((e) => {
                if (e.id === edge.id) {
                    const newType = e.type === 'default' ? 'red' : e.type === 'red' ? 'blue' : 'default';
                    return { ...e, type: newType };
                }
                return e;
            })
        );
    };

    const createNode = (doc: DocumentForDiagram, index: number, yearOffset:number) => {
        return {
            id: (doc.id + yearOffset).toString(),
            type: 'zoom',
            data: { label: doc.title.substring(0, 100) },
            position: { x: doc.date * gridWidth, y: Math.floor(index + 2) * gridHeight / 1.9 },
            style: { width: gridWidth, height: gridHeight/2, backgroundColor: 'blue', borderRadius: 10, color: 'white', 
                fontSize: gridWidth/10, textAlign: 'center' as TextAlign },
            draggable: true,
            connectable: true,
        };
    };

    const createNodesForDocument = (docs: DocumentForDiagram[], indexOffset) => {
        const newNodes = docs.map((doc: DocumentForDiagram, index) => createNode(doc, index, indexOffset));
        return newNodes;
    };

    const assignX_toDate = (date: string, minYear:number) => {
        const d = dayjs(date);
        return d.year() + d.month()/12 - minYear;
    }

    // Fetch docs and create nodes
    useEffect(() => {
        // Fetch Documents
        const fetchDocuments = async () => {
            const response = await DocumentAPI.getFilteredDocuments(currentFilter);
            const list = response.docs.map((doc: any, _: number) => {
                return { id: doc.id, title: doc.title, date: doc.issue_date };
            });

            const minYear = Math.floor(Math.min(...list.map(doc => dayjs(doc.date).year())));
            const maxYear = Math.ceil(Math.max(...list.map(doc => dayjs(doc.date).year())));
            const adjustedList = list.map(doc => ({ ...doc, date: assignX_toDate(doc.date, minYear) }));
            const years = Array.from({ length: maxYear - minYear + 1 }, (_, k) => k + minYear);
            const initialNodes: Node[] = years.map((year, index) => ({
                id: (index + 1).toString(),
                data: { label: year.toString() },
                position: {x: (year-minYear) * gridWidth, y: 0  },
                style: { width: gridWidth, height: gridHeight/2, backgroundColor: "000", borderRadius: 10, fontSize: gridWidth/10, textAlign: 'center' as TextAlign },
                draggable: false,
                connectable: false,
            }));

            const startIndex = initialNodes.length;
            //sort for date
            const sortedDocs = adjustedList.sort((a, b) => a.date - b.date);
            setDocuments(sortedDocs);
            const docsNodes = createNodesForDocument(sortedDocs, startIndex+1);
            const merge = [...initialNodes, ...docsNodes];
            setNodes(merge);
        };
        fetchDocuments();
    }, [currentFilter]);

    return (
        <ReactFlowProvider>
            <Flow nodes={nodes} edges={edges} 
                    onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onEdgeClick={onEdgeClick}
                    />
        </ReactFlowProvider>
    );
}

function Flow({nodes, edges, onNodesChange, onEdgesChange, onConnect, onEdgeClick}) {


    return (
        <ReactFlowProvider>
        <div style={{ height: '100vh', width: '100vw', overflow: 'auto'}}>
            <ReactFlow
                nodes={nodes} nodeTypes={nodeTypes} onNodesChange={onNodesChange}
                edges={edges} onEdgesChange={onEdgesChange} onConnect={onConnect} onEdgeClick={onEdgeClick} edgeTypes={edgeTypes}

                zoomOnScroll={false}
                minZoom={0.1}
                maxZoom={3}
                panOnScroll
                panOnDrag
            >   
            <MiniMap zoomable pannable nodeClassName={nodeClassName}/> 
            <Controls />
            <Background gap={gridWidth} variant={BackgroundVariant.Lines} color="#aaa" />
            </ReactFlow>
        </div>
        </ReactFlowProvider>
    );
}

export default Diagram;