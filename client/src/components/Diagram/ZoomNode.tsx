import { memo, useMemo } from "react";
import { Handle, Position } from "reactflow";
import { createReactFlowIcon } from "../shared/Icons";
import { useParams } from "react-router-dom";
import { Box, Tooltip } from "@mui/material";

interface ZoomNodeProps {
  data: {
    type: string;
    id: string;
    title: string;
    stakeholders: string[];
    connections: any;
  };
}

const styles = {
  handle: {
    width: 10,
    height: 10,
    borderRadius: "1%",
  },
  targetHandle: {
    background: "green",
  },
  sourceHandle: {
    background: "blue",
  },
};

const ZoomNode = ({ data }: ZoomNodeProps) => {
  const { id, title, type, stakeholders, connections } = data;
  const docId = Number(id);
  const selectedDocId = Number(useParams().id);

  const IconComponent = useMemo(
    () => createReactFlowIcon(type, docId, stakeholders),
    [type, docId, stakeholders]
  );

  const opacity = useMemo(() => {
    return selectedDocId &&
      selectedDocId !== docId &&
      !connections.some(
        (link) =>
          (link.id_doc1 === selectedDocId && link.id_doc2 === docId) ||
          (link.id_doc1 === docId && link.id_doc2 === selectedDocId)
      )
      ? 0.2
      : 1;
  }, [selectedDocId, docId, connections]);

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: "10px",
        border: selectedDocId === docId ? "5px solid #003d8f" : "none",
        borderRadius: "50%",
        boxShadow: selectedDocId === docId ? "0px 0px 8px 6px #003d8f" : "none",
        position: "relative",
      }}
    >
      {/* Target handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="tt"
        style={{ ...styles.handle, ...styles.targetHandle }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="tl"
        style={{ ...styles.handle, ...styles.targetHandle }}
      />
      {/* Node tooltip and icon */}
      <Tooltip
        title={title}
        placement="top"
        arrow
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 5],
                },
              },
            ],
          },
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity,
          }}
        >
          {IconComponent}
        </div>
      </Tooltip>
      {/* Source handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="sr"
        style={{ ...styles.handle, ...styles.sourceHandle }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="sb"
        style={{ ...styles.handle, ...styles.sourceHandle }}
      />
    </Box>
  );
};

export default memo(ZoomNode);
