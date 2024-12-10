import React, { memo } from 'react';
import { Handle, useStore, Position } from 'reactflow';
import { createReactFlowIcon } from '../Map/Icons';
import { useParams } from 'react-router-dom';
 
const zoomSelector = (s) => s.transform[2] >= 0.2;
 
interface ZoomNodeProps {
  data: {
    type: string;
    id: string;
    stakeholders: string[];
    connections: any;
  };
}

export default memo(({ data }: ZoomNodeProps) => {
  const showContent = useStore(zoomSelector);
  const selectedDocId = Number(useParams().id);
  const docId = Number(data.id);
  const IconComponent = createReactFlowIcon(data.type, docId, data.stakeholders);
  const opacity = selectedDocId && selectedDocId !== docId && !data.connections.some((link) => (link.id_doc1 === selectedDocId && link.id_doc2 === docId) || (link.id_doc1 === docId && link.id_doc2 === selectedDocId)) ? 0.5 : 1;
  return (
    <div style={{ 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      padding: '10px',
      border: selectedDocId === docId ? '5px solid #003d8f' : 'none',
      borderRadius: '50%',
      boxShadow: selectedDocId === docId ?"0px 0px 6px 4px #003d8f" : "none"
    }}>
      <>
      <Handle type="target" position={Position.Top} id="tt" />
      <Handle type="target" position={Position.Right} id="tr" />
      <Handle type="target" position={Position.Bottom} id="tb" />
      <Handle type="target" position={Position.Left} id="tl" />
      {showContent ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto', height: 'auto', opacity: opacity }}>
              {IconComponent}
          </div>
      ) : (
          "---"
      )}
      <Handle type="source" position={Position.Top} id="st" />
      <Handle type="source" position={Position.Right} id="sr" />
      <Handle type="source" position={Position.Bottom} id="sb" />
      <Handle type="source" position={Position.Left} id="sl" />
      </>
    </div>
  );
});