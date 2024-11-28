import React, { useEffect, useState } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, MiniMap, Controls, Background, NodeChange, applyNodeChanges, Node, PanOnScrollMode, BackgroundVariant, EdgeProps, BezierEdge, EdgeChange, applyEdgeChanges, useReactFlow, useViewport, TextAlign } from 'reactflow';
import { Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import dayjs from 'dayjs';
import { SearchFilter } from '../../models/SearchFilter';

import ConnectionAPI from '../../API/ConnectionApi';
import DocumentAPI from '../../API/DocumentAPI';
import './Diagram.css';

interface DocumentForDiagram {
    id: number;
    title: string;
    date: string;
}
import ZoomNode from './ZoomNode';
const nodeTypes = {
    zoom: ZoomNode,
};


const gridHeight = 200; // Size of the grid cells
const gridWidth = 400; // Width of the grid

const initialEdges: Edge[] = [];
import { AnimatedSVGEdge } from './AnimatedEdge';
const nodeClassName = (node) => node.type;

const edgeTypes = {
    animated: AnimatedSVGEdge,
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
    };
    const assignX_toDate = (date: string, minYear:number) => {
        const d = dayjs(date);
        return d.year() + d.month()/12 - minYear;
    }

    const createNode = (doc: DocumentForDiagram, index, minYear) => {
        return {
            id: doc.id.toString(),
            type: 'zoom',
            data: { label: doc.title.substring(0, 100) },
            position: { x: (assignX_toDate(doc.date, minYear)) * gridWidth, y: (index+2) * gridHeight*2 },
            style: { width: gridWidth, height: gridHeight/2, borderRadius: 10, background: 'pink',
                fontSize: gridWidth/10, textAlign: 'center' as TextAlign },
            draggable: false,
            connectable: true,
        };
    };

    const createNodesForDocument = (docs: DocumentForDiagram[], years, minYear) => {
        
        const arrayDocsPerYear: DocumentForDiagram[][] = years.map(year => docs.filter(doc => dayjs(doc.date).year() === year));
        const fiteredDocsPerYear = arrayDocsPerYear.filter((docs) => docs.length > 0);
        let pre = 0
        let lastYear = -1
        let newNodes = []
        for (const docsPerYear of fiteredDocsPerYear) {
            let offset_y = 0;
            if (lastYear == dayjs(docsPerYear[0].date).year()-1 ) {
                offset_y += pre;
            }
            const nodesToAdd = docsPerYear.map((doc, index) => createNode(doc, index + offset_y, minYear));
            pre = docsPerYear.length + offset_y;
            lastYear = dayjs(docsPerYear[0].date).year();
            newNodes = [...newNodes, ...nodesToAdd];
        }
        return newNodes;
    };

    // Fetch docs and create nodes
    useEffect(() => {
        // Fetch Documents
        const fetchDocumentsAndConnections = async () => {
            const response = await DocumentAPI.getFilteredDocuments(currentFilter);
            const list = response.docs.map((doc: any, _: number) => {
                return { id: doc.id, title: doc.title, date: doc.issue_date };
            });

            const minYear = Math.floor(Math.min(...list.map(doc => dayjs(doc.date).year())));
            const maxYear = Math.ceil(Math.max(...list.map(doc => dayjs(doc.date).year())));
            const adjustedList = list.map(doc => ({ ...doc, date: doc.date }));
            const years = Array.from({ length: maxYear - minYear + 1 }, (_, k) => k + minYear);
            //sort for date
            const sortedDocs = adjustedList.sort((a, b) => a.date - b.date);
            setDocuments(sortedDocs);
            const docsNodes = createNodesForDocument(sortedDocs, years, minYear);
            const sortedNodesByID = docsNodes.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            const lastID = sortedNodesByID[sortedNodesByID.length - 1].id;
            const initialNodes: Node[] = years.map((year, index) => ({
                id: (index + lastID + 1).toString(),
                data: { label: year.toString() },
                position: {x: (year-minYear) * gridWidth, y: 0  },
                style: { width: gridWidth, height: gridHeight/2, backgroundColor: "000", borderRadius: 10, fontSize: gridWidth/10, textAlign: 'center' as TextAlign },
                draggable: false,
                connectable: false,
            }));
            const merge = [...initialNodes, ...docsNodes];
            setNodes(merge);

            //Now fetch connections
            const connections = await ConnectionAPI.getConnections();
            const edges = connections.flatMap((conn: any) => {
                //compare date of the two docs
                let id1 = conn.id_doc1.toString();
                let id2 = conn.id_doc2.toString();
                let doc1 = docsNodes.find(doc => doc.id === id1);
                let doc2 = docsNodes.find(doc => doc.id === id2);
                if (doc1?.position.x > doc2?.position.x) {
                    id1 = conn.id_doc2.toString();
                    let temp = doc1;
                    doc1 = doc2;
                    id2 = conn.id_doc1.toString();
                    doc2 = temp;
                }
                console.log(id1, ":", id2);
                console.log(doc1?.data.label, doc1?.position.x, ":", doc2?.data.label, doc2?.position.x);
                return conn.connection_types.map((type: string) => {
                    return { id: (id1 + "," + id2 + ":" + type), source: id1, target: id2, type: 'animated', label: type
                            
                     };
                });
            });
            setEdges(edges);
        };
        fetchDocumentsAndConnections();
        
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
                panOnScrollMode={PanOnScrollMode.Vertical}

                fitView
                attributionPosition="top-right"
            >   
            <MiniMap zoomable pannable nodeClassName={nodeClassName} /> 
            <Controls />
            <Background gap={gridWidth} variant={BackgroundVariant.Lines} color="#aaa" />
            </ReactFlow>
        </div>
        </ReactFlowProvider>
    );
}

export default Diagram;