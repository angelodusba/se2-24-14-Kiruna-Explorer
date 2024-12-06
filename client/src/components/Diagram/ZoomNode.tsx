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
      <Handle type="target" position={Position.Top} id="tt" />
      <Handle type="target" position={Position.Right} id="tr" />
      <Handle type="target" position={Position.Bottom} id="tb" />
      <Handle type="target" position={Position.Left} id="tl" />
      {showContent ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto', height: 'auto' }}>
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
  );
});