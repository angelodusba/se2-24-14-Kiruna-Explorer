import React, { useEffect, useState } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, MiniMap, Controls, Background, NodeChange, applyNodeChanges, Node, PanOnScrollMode, BackgroundVariant, EdgeProps, BezierEdge, EdgeChange, applyEdgeChanges } from 'reactflow';
import { Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import DocumentAPI from '../../API/DocumentAPI';
import { fontGrid } from '@mui/material/styles/cssUtils';
import dayjs from 'dayjs';

interface DocumentForDiagram {
    id: number;
    title: string;
    date: number;
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const gridSize = 50; // Size of the grid cells
const columns = 12; // Number of columns in the grid

const initialEdges: Edge[] = [];
const DefaultEdge: React.FC<EdgeProps> = (props) => <BezierEdge {...props} />;
const SmoothEdge: React.FC<EdgeProps> = (props) => <BezierEdge {...props} />;
const RedEdge: React.FC<EdgeProps> = (props) => <BezierEdge {...props} style={{ stroke: 'red' }} animated />;
const BlueEdge: React.FC<EdgeProps> = (props) => <BezierEdge {...props} style={{ stroke: 'blue' }} animated />;

const edgeTypes = {
    default: DefaultEdge,
    red: RedEdge,
    blue: BlueEdge,
};

function Diagram() {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [documents, setDocuments] = useState<DocumentForDiagram[]>([]);

    const onNodesChange = (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds));
    const onEdgesChange = (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds));
    const onConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

    const addNode = () => {
        const newNode: Node = {
            id: (nodes.length + 1).toString(),
            data: { label: `Node ${nodes.length + 1}` },
            position: { x: (nodes.length % columns) * gridSize, y: Math.floor(nodes.length / columns) * gridSize },
            style: { width: gridSize, backgroundColor: '#f0f0f0', borderRadius: 10 },
            draggable: true,
            connectable: true,
        };
        setNodes((nds) => [...nds, newNode]);
    };

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
            data: { label: doc.title },
            position: { x: doc.date * gridSize, y: Math.floor(index + 1) * gridSize / 4 },
            style: { width: gridSize, backgroundColor: 'blue', borderRadius: 10, color: 'white', fontSize: 20 },
            draggable: true,
            connectable: true,
        };
    };

    const createNodesForDocument = (docs: DocumentForDiagram[], yearOffset) => {
        const newNodes = docs.map((doc: DocumentForDiagram, index) => createNode(doc, index, yearOffset));
        return newNodes;
    };

    const assignX_toDate = (date: string, minYear:number) => {
        const d = dayjs(date);
        return d.year() + d.month()/12 - minYear;
    }

    useEffect(() => {
        // Fetch Documents
        const fetchDocuments = async () => {
            const response = await DocumentAPI.getFilteredDocuments({});
            const list = response.docs.map((doc: any, index: number) => {
                return { id: doc.id, title: doc.title, date: doc.issue_date };
            });

            const minYear = Math.floor(Math.min(...list.map(doc => dayjs(doc.date).year())));
            const maxYear = Math.ceil(Math.max(...list.map(doc => dayjs(doc.date).year())));
            const adjustedList = list.map(doc => ({ ...doc, date: assignX_toDate(doc.date, minYear) }));
            const years = Array.from({ length: maxYear - minYear + 1 }, (v, k) => k + minYear);
            console.log(years);
            const initialNodes: Node[] = years.map((year, index) => ({
                id: (index + 1).toString(),
                data: { label: year.toString() },
                position: {x: (year-minYear) * gridSize, y: 0  },
                style: { width: gridSize, height: gridSize, backgroundColor: "000", borderRadius: 10 },
                draggable: false,
                connectable: false,
            }));
            
            setDocuments(adjustedList);
            console.log(adjustedList);
            const docsNodes = createNodesForDocument(adjustedList, maxYear-minYear+1);
            const merge = [...initialNodes, ...docsNodes];
            setNodes(merge);
        };
        fetchDocuments();
    }, []);

    return (
        <ReactFlowProvider>
            <div style={{ height: '100vh', width: '100vw' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    edgeTypes={edgeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onEdgeClick={onEdgeClick}
                    fitView
                >
                    <Controls />
                    <MiniMap></MiniMap>
                    <button
                        onClick={addNode}
                        style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 4 }}
                    >
                        Add Node
                    </button>
                    <Background gap={gridSize} variant={BackgroundVariant.Lines} color="#aaa" />
                </ReactFlow>
            </div>
        </ReactFlowProvider>
    );
}

export default Diagram;