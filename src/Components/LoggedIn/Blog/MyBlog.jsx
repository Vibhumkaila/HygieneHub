import React, { useEffect, useState } from "react";

import axios from "axios";
import { Box, styled, Typography } from "@mui/material";
import { useRhinoValue } from "react-rhino";
import Blog from "./BlogsCard";
const BACKEND = import.meta.env.VITE_BACKEND_URL;

const Image = styled(Box)`
  width: 100%;
  background: url(https://www.wallpapertip.com/wmimgs/23-236943_us-wallpaper-for-website.jpg)
    center/100% no-repeat #000;
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Heading = styled(Typography)`
  font-size: 70px;
  color: #ffffff;
  line-height: 1;
  font-family: "Poppins,sans-serif";
`;

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const id = useRhinoValue("id");
  const sendRequest = async () => {
    const res = await axios.get(`${BACKEND}/api/blog`).catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };
  useEffect(() => {
    sendRequest().then((data) => setBlogs(data.blogs));
  }, []);
  // console.log(blogs);
  return (
    <div>
      <Image>
        <Heading>All my Blogs</Heading>
      </Image>
      <Box>
        {blogs &&
          blogs
            .filter((blog) => blog.user._id === id)
            .map((blog) => <Blog key={blog._id} param={blog} />)}
      </Box>
      <Box marginTop="2rem"></Box>
    </div>
  );
};

export default MyBlogs;
