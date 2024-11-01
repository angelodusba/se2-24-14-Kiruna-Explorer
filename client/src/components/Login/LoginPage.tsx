import Grid from "@mui/material/Grid2";
import LoginCard from "./LoginCard";
import KirunaImage from "../../assets/Kiruna.webp";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import { Box, Typography } from "@mui/material";

function LoginPage() {
  return (
    <Grid
      container
      sx={[
        (theme) => ({
          "&::before": {
            content: '""',
            display: "flex",
            position: "absolute",
            zIndex: -1,
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
            backgroundRepeat: "no-repeat",
            ...theme.applyStyles("dark", {
              backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
            }),
          },
        }),
      ]}>
      <Grid size="grow" display={{ md: "flex", xs: "none" }}>
        <img src={KirunaImage} alt="Kiruna" height={"100%"} width={"100%"} />
      </Grid>
      <Grid
        size="grow"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={3}
        sx={{
          p: 2,
          m: "auto",
        }}>
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            p: 2,
            m: "auto",
          }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}>
            <img src={KirunaLogo} alt="Kiruna" height={"96px"} width={"80px"} />
            <Typography
              variant="h4"
              noWrap
              component="div"
              color="#003d8f"
              display="block">
              Kiruna Explorer
            </Typography>
          </Box>
          <LoginCard />
        </Box>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
