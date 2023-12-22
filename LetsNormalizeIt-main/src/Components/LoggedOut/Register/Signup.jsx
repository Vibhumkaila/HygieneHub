import React, { useState } from "react";

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

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRhinoState } from "react-rhino";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [fill, setfill] = useState(false);
  const [id, setid] = useRhinoState("id");
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const onValueChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const sendRequest = async (type = "signup") => {
    const res = await axios
      .post(`${BACKEND}/api/user/${type}`, user)
      .catch((err) => console.log(err));

    const data = await res.data;

    return data;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user.name === "" || user.email === "" || user.password === "") {
      setfill(true);
      return;
    }
    if (user.password.length < 8) {
      setError("Password must be atleast 8 characters long");
      return;
    }
    setfill(false);
    sendRequest()
      .then((data) => setid(data.user._id))
      .then(() => navigate("/"));
    setError(
      "Make Sure Password has more than 8 characters or Email is not already registered"
    );
  };

  return (
    <Container component="main" maxWidth="x">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          SIGN UP
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            autoComplete="name"
            margin="normal"
            name="name"
            required
            fullWidth
            id="name"
            label="Name"
            autoFocus
            onChange={(e) => onValueChange(e)}
          />
          <TextField
            autoComplete="email"
            margin="normal"
            name="email"
            required
            fullWidth
            id="email"
            label="Email"
            autoFocus
            onChange={(e) => onValueChange(e)}
          />
          <TextField
            autoComplete="password"
            margin="normal"
            name="password"
            required
            fullWidth
            id="password"
            label="Password"
            autoFocus
            onChange={(e) => onValueChange(e)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            SIGN UP
          </Button>
          {fill && <Typography color="red">* Please fill all the fields</Typography>}
          {error && <Typography color="red">* {error}</Typography>}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Grid marginTop="60px"></Grid>
    </Container>
  );
};

export default Signup;
