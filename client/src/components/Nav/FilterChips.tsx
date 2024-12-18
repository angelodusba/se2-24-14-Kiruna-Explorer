import { Box, Chip } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import {
  AccountBalanceOutlined,
  TranslateOutlined,
  SupervisorAccountOutlined,
  TitleOutlined,
  TodayOutlined,
  TypeSpecimenOutlined,
  VpnKeyOutlined,
  MoreHorizOutlined,
  EventOutlined,
  AspectRatioOutlined,
} from "@mui/icons-material";

const chipsData = [
  { key: 0, label: "title", icon: <TitleOutlined /> },
  { key: 1, label: "types", icon: <TypeSpecimenOutlined /> },
  { key: 2, label: "languages", icon: <TranslateOutlined /> },
  { key: 3, label: "start_year", icon: <TodayOutlined /> },
  { key: 4, label: "end_year", icon: <EventOutlined /> },
  { key: 5, label: "stakeholders", icon: <SupervisorAccountOutlined /> },
  { key: 6, label: "keywords", icon: <VpnKeyOutlined /> },
  { key: 7, label: "municipality", icon: <AccountBalanceOutlined /> },
  { key: 8, label: "scales", icon: <AspectRatioOutlined /> },
];

function FilterChips({
  filterNames,
  handleRemoveFilter,
}: {
  filterNames: string[];
  handleRemoveFilter: (filterName: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(filterNames.length);

  useEffect(() => {
    const container = containerRef.current; // Capture the current ref value
    const resizeObserver = new ResizeObserver(() => {
      const containerWidth = container?.offsetWidth || 0;
      const avgChipWidth = 135; // Average chip width in pixels
      const chipsThatFit = Math.floor(containerWidth / avgChipWidth);
      setVisibleCount(Math.max(1, chipsThatFit)); // Ensure at least one chip is displayed
    });
    if (container) {
      resizeObserver.observe(container);
    }
    // Cleanup function
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [filterNames]);

  return (
    <Box
      ref={containerRef}
      component="ul"
      sx={{
        position: "absolute",
        top: "65px",
        left: "50%",
        transform: "translate(-50%, 0)",
        width: "80%",
        zIndex: 410,
        display: "flex",
        justifyContent: "center",
        gap: 1,
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
    >
      {filterNames.slice(0, visibleCount).map((filter) => {
        const data = chipsData.find((chipData) => chipData.label === filter);
        return (
          <Chip
            key={data?.key}
            style={{ backgroundColor: "#EBEBEB" }}
            label={data?.label.replace("_", " ")}
            icon={data?.icon}
            onDelete={() => {
              if (data) handleRemoveFilter(data.label);
            }}
          />
        );
      })}
      {filterNames.length > visibleCount && (
        <Chip
          style={{ backgroundColor: "#EBEBEB" }}
          label={`+${filterNames.length - visibleCount}`}
        />
      )}
    </Box>
  );
}

export default FilterChips;
