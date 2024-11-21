import * as React from "react";
import {
  Button,
  Box,
  Divider,
  FormLabel,
  FormControl,
  Link,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MuiCard from "@mui/material/Card";

//Card Style
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

function LoginCard(props) {
  const [emailError, setEmailError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError || passwordError) {
      return;
    }

    props.login(email, password);
  };

  const validateInputs = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email.");
    } else {
      setEmailError("");
    }

    if (!password || password.length < 4) {
      setPasswordError("Password must be at least 4 characters long.");
    } else {
      setPasswordError("");
    }
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h5"
        fontSize="clamp(2rem, 10vw, 2.15rem)"
        width="100%">
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        display="flex"
        flexDirection="column"
        width="100%"
        gap={2}>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={!!emailError}
            helperText={emailError}
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
            aria-label="email"
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            error={!!passwordError}
            helperText={passwordError}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          sx={{ backgroundColor: "#003d8f", color: "white" }}
          onClick={validateInputs}>
          Login
        </Button>
      </Box>
      <Divider>or</Divider>
      <Typography textAlign="center">
        <span>
          <Link
            component={RouterLink}
            variant="body2"
            underline="hover"
            to="/map">
            Continue as a visitor
          </Link>
        </span>
      </Typography>
    </Card>
  );
}

export default LoginCard;
