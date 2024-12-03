import React, { memo } from 'react';
import { Handle, useStore, Position } from 'reactflow';
import { createReactFlowIcon } from '../Map/Icons';
 
const Placeholder = () => (
  <div className="placeholder">
    <div />
    <div />
    <div />
  </div>
);
 
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
      <Handle type="target" position={Position.Left} />
      {showContent ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'auto', height: 'auto' }}>
            {IconComponent}
          </div>

      ) : (
        "---"
      )}
      <Handle type="source" position={Position.Right} />
    </>
  );
});