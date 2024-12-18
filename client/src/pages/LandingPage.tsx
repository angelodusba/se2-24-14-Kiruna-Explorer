import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import KirunaLogo from "../assets/KirunaLogo.svg";
import LandingPhoto from "../assets/LandingPhoto.svg";
import LoginButton from "../components/Nav/LoginButton";
import Grid from "@mui/material/Grid2";

function LandingPage({ handleLogout }) {
  const navigate = useNavigate();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          color="transparent"
          sx={{
            boxShadow: "none",
            border: "none",
            zIndex: 1000,
            color: "white",
          }}>
          <Toolbar sx={{ flexGrow: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container>
                <Grid
                  size="grow"
                  sx={{
                    marginTop: "8px",
                  }}>
                  <Link
                    to={"/"}
                    style={{
                      textDecoration: "none",
                      color: "white",
                      justifyContent: "start",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}>
                    <img
                      src={KirunaLogo}
                      width="40px"
                      height="48px"
                      alt="Kiruna Explorer"
                      style={{ marginRight: "8px" }}
                    />
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        display: { sm: "block", xs: "none" },
                        fontWeight: 500,
                        letterSpacing: "0.5px", // Slight spacing
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Text shadow for contrast
                      }}>
                      Kiruna Explorer
                    </Typography>
                  </Link>
                </Grid>

                {/* Login / account button */}
                <Grid
                  size="grow"
                  sx={{
                    justifyContent: "end",
                    alignItems: "center",
                    display: { xs: "flex", sm: "flex" },
                  }}>
                  <LoginButton handleLogout={handleLogout}></LoginButton>
                </Grid>
              </Grid>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          background: "linear-gradient(to left, #5983BB, #EEEEEE)",
          flexDirection: "row",
          position: "relative",
          overflow: "hidden",
        }}>
        {/* Left Section - Image */}

        <Box
          sx={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${LandingPhoto})`,
              backgroundSize: "contain",
              backgroundPosition: "bottom",
              backgroundRepeat: "no-repeat",
            }}
          />
        </Box>

        {/* Right Section - Content */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: 4,
            color: "white",
            backgroundColor: "transparent",
          }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "#021E44",
              marginBottom: 2,
            }}>
            Kiruna Explorer
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#021E44", lineHeight: 2.2, marginBottom: 4 }}>
            Explore the rich history of Kiruna through our platform. We invite
            visitors to engage with the fascinating narrative of the city,
            observe its evolution, and access essential documents about its
            significant landmarks. For urban planners, Kiruna Explorer offers a
            comprehensive suite of tools designed to facilitate the addition,
            organization, and connection of documents, thereby supporting the
            continued development of the city's story.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 5,
              justifyContent: "center",
              width: "100%",
            }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/map")}
              sx={{
                textTransform: "none",
                padding: "12px 24px",
                fontSize: "16px",
                background: "linear-gradient(to bottom,  #002961, #3670BD)",
                "&:hover": {
                  background: "linear-gradient(to bottom, #3670BD, #002961)",
                },
                width: 150,
              }}>
              Map
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/diagram")}
              sx={{
                textTransform: "none",
                padding: "12px 24px",
                fontSize: "16px",
                background: "linear-gradient(to bottom,  #002961, #3670BD)",
                "&:hover": {
                  background: "linear-gradient(to bottom, #3670BD, #002961)",
                },
                width: 150,
              }}>
              Diagram
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default LandingPage;
