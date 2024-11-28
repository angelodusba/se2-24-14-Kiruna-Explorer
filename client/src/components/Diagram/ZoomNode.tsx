import React, { memo } from 'react';
import { Handle, useStore, Position } from 'reactflow';
 
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
    label: React.ReactNode;
  };
}

export default memo(({ data }: ZoomNodeProps) => {
  const showContent = useStore(zoomSelector);
 
  return (
    <>
      <Handle type="target" position={Position.Left} />
      {showContent ? data.label : "---"}
      <Handle type="source" position={Position.Right} />
    </>
  );
});