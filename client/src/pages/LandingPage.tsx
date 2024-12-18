import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KirunaLogo from "../assets/KirunaLogo.svg";
import LandingPhoto from "../assets/LandingPhoto.svg";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(to left, #5983BB, #EEEEEE)",
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left Section - Logo & Image */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            position: "absolute",
            left: 16,
            top: 10,
          }}
        >
          <img
            src={KirunaLogo}
            alt="Kiruna Logo"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
        </Box>

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
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "linear-gradient(to bottom,  #002961, #3670BD)",
            "&:hover": {
              background: "linear-gradient(to bottom, #3670BD, #002961)",
            },
            width: 104,
            height:40,
            borderRadius: "5px",
            color: "#FFFFFF",
          }}
        >
          <AccountCircleIcon sx={{ mr: 1 }} />
          LogIn
        </Button>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#021E44",
            marginBottom: 2,
          }}
        >
          Kiruna Explorer
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#021E44", lineHeight: 2.2, marginBottom: 4 }}
        >
          Explore the rich history of Kiruna through our platform. We invite
          visitors to engage with the fascinating narrative of the city, observe
          its evolution, and access essential documents about its significant
          landmarks. For urban planners, Kiruna Explorer offers a comprehensive
          suite of tools designed to facilitate the addition, organization, and
          connection of documents, thereby supporting the continued development
          of the city's story.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 5,
            justifyContent: "center",
            width: "100%",
          }}
        >
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
            }}
          >
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
            }}
          >
            Diagram
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;
