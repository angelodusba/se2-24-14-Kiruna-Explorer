import React, { memo, useState } from 'react';
import { Handle, useStore, Position } from 'reactflow';
import { createReactFlowIcon } from '../Map/Icons';
import { useParams } from 'react-router-dom';
import zIndex from '@mui/material/styles/zIndex';

const zoomSelector = (s) => s.transform[2] >= 0.2;

interface ZoomNodeProps {
  data: {
    type: string;
    id: string;
    title: string;
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
  const [showTooltip, setShowTooltip] = useState(false);
  const { zoom } = useStore((state) => ({
    zoom: state.transform[2],
  }));
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
      boxShadow: selectedDocId === docId ? '0px 0px 8px 6px #003d8f' : "none",
      fontSize: `${1/zoom}em`,
    }}
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
    >
      <>
      {selectedDocId !== docId && showTooltip && (
        <div style={{
          position: 'absolute',
          bottom: '115%',
          padding: '5px',
          backgroundColor: '#003d8f',
          color: 'white',
          borderRadius: '5px',

        }}
        >
          {data.title}
        </div>
      )}
        <Handle type="target" position={Position.Top} id="tt" style={{ width: 10, height: 10, background: 'green', borderRadius: '1%' }} />
        <Handle type="target" position={Position.Left} id="tl" style={{ width: 10, height: 10, background: 'green', borderRadius: '1%' }} />
        {showContent ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto', height: 'auto', opacity: opacity }}>
            {IconComponent}
          </div>
        ) : (
        "---"
        )}
        <Handle type="source" position={Position.Right} id="sr" style={{ width: 10, height: 10, background: 'blue', borderRadius: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        <Handle type="source" position={Position.Bottom} id="sb" style={{ width: 10, height: 10, background: 'blue', borderRadius: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
      </>
    </div>
  );
});