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

function LoginCard() {
  const [usernameError, setUsernameError] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (usernameError || passwordError) {
      return;
    }
    //TODO LOGIN API
    console.log({
      username: username,
      password: password,
    });
  };

  const validateInputs = () => {
    if (!username || !/^[a-zA-Z_][a-zA-Z0-9_]{2,14}$/.test(username)) {
      setUsernameError("Please enter a valid username.");
    } else {
      setUsernameError("");
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
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
          <FormLabel htmlFor="username">Username</FormLabel>
          <TextField
            error={!!usernameError}
            helperText={usernameError}
            id="username"
            type="username"
            name="username"
            placeholder="Username"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={usernameError ? "error" : "primary"}
            aria-label="username"
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(event.target.value);
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
          <Link component="button" variant="body2" underline="hover">
            Continue as a visitor
          </Link>
        </span>
      </Typography>
    </Card>
  );
}

export default LoginCard;
