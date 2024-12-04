import { Box, Divider, Drawer, Fab, Tooltip, Typography } from "@mui/material";
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
      <div className="leaflet-control-container leaflet-top leaflet-left leaflet-right">
        <Tooltip title="Layers">
          <Fab
            className=" leaflet-control"
            size="medium"
            id="layersControl"
            //aria-controls={accountOpen ? "accountMenu" : undefined}
            aria-haspopup="true"
            //aria-expanded={accountOpen ? "true" : undefined}
            onClick={() => {
              setDrawerOpened(true);
            }}>
            <LayersOutlinedIcon></LayersOutlinedIcon>
          </Fab>
        </Tooltip>
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
                  <Typography>Links</Typography>
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
