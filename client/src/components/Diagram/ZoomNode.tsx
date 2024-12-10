import React, { memo } from 'react';
import { Handle, useStore, Position } from 'reactflow';
import { createReactFlowIcon } from '../Map/Icons';
 
const zoomSelector = (s) => s.transform[2] >= 0.2;
 
interface ZoomNodeProps {
  data: {
    type: string;
    id: string;
    stakeholders: string[];
  };
}

export default memo(({ data }: ZoomNodeProps) => {
  const showContent = useStore(zoomSelector);
  const IconComponent = createReactFlowIcon(data.type, Number(data.id), data.stakeholders);
  
  return (
    <>
      <Handle type="target" position={Position.Top} id="tt" style={{ width: 15, height: 15, background: 'black' }} />
      <Handle type="target" position={Position.Right} id="tr" style={{ width: 15, height: 15, background: 'black' }} />
      <Handle type="target" position={Position.Bottom} id="tb" style={{ width: 15, height: 15, background: 'black' }} />
      <Handle type="target" position={Position.Left} id="tl" style={{ width: 15, height: 15, background: 'black' }} />
      {showContent ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto', height: 'auto' }}>
        {IconComponent}
      </div>
      ) : (
      "---"
      )}
      <Handle type="source" position={Position.Top} id="st" style={{ width: 15, height: 15, background: 'black' }} />
      <Handle type="source" position={Position.Right} id="sr" style={{ width: 15, height: 15, background: 'black' }} />
      <Handle type="source" position={Position.Bottom} id="sb" style={{ width: 15, height: 15, background: 'black' }} />
      <Handle type="source" position={Position.Left} id="sl" style={{ width: 15, height: 15, background: 'black' }} />
    </>
  );
});