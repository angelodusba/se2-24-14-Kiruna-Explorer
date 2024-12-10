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
  selected: boolean;
}

export default memo(({ data, selected }: ZoomNodeProps) => {
  const showContent = useStore(zoomSelector);
  const IconComponent = createReactFlowIcon(
    data.type,
    Number(data.id),
    data.stakeholders
  );

  const nodeStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: selected ? "auto" : "auto",
    height: selected ? "auto" : "auto",
    transform: selected ? "scale(1.5)" : "scale(1)",
    background: selected
      ? "linear-gradient(135deg, #3670BD 0%, #002961 100%)"
      : "none",
    borderRadius: "50%",
    transition: "transform 0.3s, background 0.3s",
  };

  return (
    <>
      <Handle type="target" position={Position.Top} id="tt" />
      <Handle type="target" position={Position.Right} id="tr" />
      <Handle type="target" position={Position.Bottom} id="tb" />
      <Handle type="target" position={Position.Left} id="tl" />
      {showContent ? <div style={nodeStyle}>{IconComponent}</div> : "---"}
      <Handle type="source" position={Position.Top} id="st" />
      <Handle type="source" position={Position.Right} id="sr" />
      <Handle type="source" position={Position.Bottom} id="sb" />
      <Handle type="source" position={Position.Left} id="sl" />
    </>
  );
});