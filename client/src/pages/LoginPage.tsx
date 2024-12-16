import Grid from "@mui/material/Grid2";
import LoginCard from "../components/Login/LoginCard";
import KirunaImage from "../assets/Kiruna.webp";
import KirunaLogo from "../assets/KirunaLogo.svg";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginPage({ login }) {
  const navigate = useNavigate();

  return (
    <Grid
      container
      style={{
        height: "100vh",
        width: "100vw",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Grid
        size={5}
        display={{ md: "flex", xs: "none" }}
        style={{
          backgroundImage: KirunaImage,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover" /* This makes the image cover the container */,
        }}
      >
        <img src={KirunaImage} alt="Kiruna" width="100%" height="100%" />
      </Grid>
      <Grid
        size={"grow"}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={3}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          <img src={KirunaLogo} alt="Kiruna" height={"96px"} width={"80px"} />
          <Typography
            variant="h4"
            noWrap
            component="div"
            color="#003d8f"
            display="block"
            fontWeight={600}
          >
            Kiruna Explorer
          </Typography>
        </Box>
        <LoginCard login={login} />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
