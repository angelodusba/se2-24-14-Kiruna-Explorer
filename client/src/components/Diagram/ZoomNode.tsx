import React, { memo } from 'react';
import { Handle, useStore, Position } from 'reactflow';
import { createReactFlowIcon } from '../Map/Icons';
import { useParams } from 'react-router-dom';
import zIndex from '@mui/material/styles/zIndex';

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
    <>
      <Handle type="target" position={Position.Top} id="tt" style={{ width: 15, height: 15, background: 'green', borderRadius: '1%' }} />
      <Handle type="target" position={Position.Right} id="tr" style={{ width: 15, height: 15, background: 'green', borderRadius: '1%' }} />
      <Handle type="target" position={Position.Bottom} id="tb" style={{ width: 15, height: 15, background: 'green', borderRadius: '1%' }} />
      <Handle type="target" position={Position.Left} id="tl" style={{ width: 15, height: 15, background: 'green', borderRadius: '1%' }} />
      {showContent ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto', height: 'auto' }}>
      {IconComponent}
      </div>
      ) : (
      "---"
      )}
      <Handle type="source" position={Position.Top} id="st" style={{ width: 15, height: 15, background: 'blue', borderRadius: '1%', marginTop: '-15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '10px' }}>S</div>
      </Handle>
      <Handle type="source" position={Position.Right} id="sr" style={{ width: 15, height: 15, background: 'blue', borderRadius: '1%', marginTop: '-15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '10px' }}>S</div>
      </Handle>
      <Handle type="source" position={Position.Bottom} id="sb" style={{ width: 15, height: 15, background: 'blue', borderRadius: '1%', marginBottom: '-15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '10px' }}>S</div>
      </Handle>
      <Handle type="source" position={Position.Left} id="sl" style={{ width: 15, height: 15, background: 'blue', borderRadius: '1%', marginTop: '-15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '10px' }}>S</div>
      </Handle>
    </>
  );
});