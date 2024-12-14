import {
  Badge,
  Box,
  Divider,
  Drawer,
  Fab,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import Grid from "@mui/material/Grid2";
import Satellite from "../../assets/Satellite.png";
import Street from "../../assets/Street.png";
import Links from "../../assets/Links.png";
import Areas from "../../assets/Areas.png";

function MapLayersControl({
  mapType,
  setMapType,
  layersVisibility,
  setLayersVisibility,
}) {
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);

  return (
    <>
      <div
        className="leaflet-control-container leaflet-top leaflet-left leaflet-right"
        style={{ position: "relative" }}>
        <div style={{ position: "absolute", right: 0 }}>
          <Badge
            badgeContent={
              (layersVisibility.areas ? 1 : 0) +
              (layersVisibility.links ? 1 : 0)
            }
            color="primary"
            overlap="circular"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              position: "absolute",
              "& .MuiBadge-badge": {
                zIndex: 1200,
              },
              right: 0,
            }}>
            <Tooltip title="Layers" placement="left">
              <Fab
                className="leaflet-control"
                size="medium"
                id="layersControl"
                aria-haspopup="true"
                onClick={() => setDrawerOpened(true)}>
                <LayersOutlinedIcon />
              </Fab>
            </Tooltip>
          </Badge>
        </div>
      </div>
      <Drawer
        anchor={"bottom"}
        open={drawerOpened}
        onClose={() => setDrawerOpened(false)}>
        <Box sx={{ height: "35vh", maxHeight: "400px" }}>
          <Grid container sx={{ height: "100%", width: "100%" }}>
            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                alignItems: "start",
                p: 2,
                height: "50%",
                width: "100%",
              }}>
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                <Typography variant="h6" color="#003d8f" fontWeight="bold">
                  Map Type
                </Typography>
              </Grid>
              <Grid
                size={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                <Box
                  component="button"
                  onClick={() => setMapType("satellite")}
                  sx={{
                    border: "none",
                    backgroundColor: "transparent",
                    display: "inline-block",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    width: "auto",
                    p: 2,
                  }}>
                  <img
                    className={
                      mapType === "satellite"
                        ? "layer-image selected"
                        : "layer-image"
                    }
                    src={Satellite}
                    height={64}
                    width={64}
                    alt="Satellite"
                  />
                  <Typography>Satellite</Typography>
                </Box>
              </Grid>
              <Grid
                size={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                <Box
                  component="button"
                  onClick={() => setMapType("street")}
                  sx={{
                    border: "none",
                    backgroundColor: "transparent",
                    display: "inline-block",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    width: "auto",
                    p: 2,
                  }}>
                  <img
                    className={
                      mapType === "street"
                        ? "layer-image selected"
                        : "layer-image"
                    }
                    src={Street}
                    alt="Street"
                  />
                  <Typography>Street</Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider
              sx={{ display: { xs: "none", md: "flex" }, marginRight: -1 }}
              orientation="vertical"
            />
            <Grid
              container
              size={{ xs: 12, md: 6 }}
              sx={{
                display: "flex",
                alignItems: "start",
                p: 2,
                height: "50%",
                width: "100%",
              }}>
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                <Typography variant="h6" color="#003d8f" fontWeight="bold">
                  Layers
                </Typography>
              </Grid>
              <Grid
                size={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                <Box
                  component="button"
                  disabled={false}
                  onClick={() =>
                    setLayersVisibility((prevLayers) => ({
                      ...prevLayers,
                      links: !prevLayers.links,
                    }))
                  }
                  sx={{
                    border: "none",
                    backgroundColor: "transparent",
                    display: "inline-block",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    width: "auto",
                    p: 2,
                  }}>
                  <img
                    className={
                      layersVisibility.links
                        ? "layer-image selected"
                        : "layer-image"
                    }
                    src={Links}
                    alt="Links"
                  />
                  <Typography>Connections</Typography>
                </Box>
              </Grid>
              <Grid
                size={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                <Box
                  component="button"
                  onClick={() =>
                    setLayersVisibility((prevLayers) => ({
                      ...prevLayers,
                      areas: !prevLayers.areas,
                    }))
                  }
                  sx={{
                    border: "none",
                    backgroundColor: "transparent",
                    display: "inline-block",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    width: "auto",
                    p: 2,
                  }}>
                  <img
                    className={
                      layersVisibility.areas
                        ? "layer-image selected"
                        : "layer-image"
                    }
                    src={Areas}
                    alt="Areas"
                  />
                  <Typography>Areas</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
}

export default MapLayersControl;
