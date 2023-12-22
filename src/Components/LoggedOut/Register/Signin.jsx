import { useState } from "react";

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

import { useRhinoState } from "react-rhino";
import axios from "axios";

import { useNavigate } from "react-router-dom";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

const Signin = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [fill, setFill] = useState(false);
  const [newid, setnewid] = useRhinoState("id");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onValueChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const sendRequest = async (type = "login") => {
    const res = await axios
      .post(`${BACKEND}/api/user/${type}`, user)
      .catch((err) => console.log(err));

    const data = await res.data;
    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.email === "" || user.password === "") {
      setFill(true);
      return;
    }
    if (user.password.length < 8) {
      setError("Password must be atleast 8 characters long");
      return;
    }
    setFill(false);
    sendRequest()
      .then((data) => setnewid(data.user._id))
      .then(() => navigate("/"));
    setError("Email or Password may be incorrect");
  };

  return (
    <Container component="main" maxWidth="x">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          SIGN IN
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            onChange={(e) => onValueChange(e)}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            onChange={(e) => onValueChange(e)}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            onClick={(e) => handleSubmit(e)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {" "}
            Sign In{" "}
          </Button>
          {fill && (
            <Typography component="h1" color="red">
              * Please fill all the fields{" "}
            </Typography>
          )}
          {(error && (
            <Typography component="h1" color="red">
              * {error}{" "}
            </Typography>
          )) ||
            newid}
          <Grid container>
            <Grid item xs>
              <Link href="/forgotpassword" variant="body2">
                {" "}
                Forgot password?{" "}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {" "}
                Dont have an account? Sign Up{" "}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Grid marginTop="90px"></Grid>
    </Container>
  );
};

export default Signin;
