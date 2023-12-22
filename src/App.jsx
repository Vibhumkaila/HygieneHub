import { useEffect, useState } from "react";

import { Routes, Route } from "react-router-dom";

import { useRhinoState } from "react-rhino";

import { Home, Error } from "./Pages";

import { Footer } from "./Components";

// for not signed in
import Navbar from "./Components/LoggedOut/Navbar/Navbar";
import Signin from "./Components/LoggedOut/Register/Signin";
import Signup from "./Components/LoggedOut/Register/Signup";
import ForgotPassword from "./Components/LoggedOut/Register/ForgotPassword";
import OutBlogs from "./Components/LoggedOut/Blog/Blogs";
// Always
import MaleArticle from "./Components/Articles/MaleArticle";
import FemaleArticle from "./Components/Articles/FemaleArticle";
import TransgenderArticle from "./Components/Articles/TransgenderArticle";
import Bot from "./Pages/Bot/Bot";

// for Signed In

import InNavbar from "./Components/LoggedIn/Navbar/Navbar";
import InBlogs from "./Components/LoggedIn/Blog/Blogs";
import MyBlogs from "./Components/LoggedIn/Blog/MyBlog";
import BlogUploadPage from "./Components/LoggedIn/Blog/BlogUploadPage";
import UpdateBlog from "./Components/LoggedIn/Blog/UpdateBlog";

const App = () => {
  const [id, setid] = useRhinoState("id");
  const [cachedValue, setCachedValue] = useState("");

  useEffect(() => {
    // Read the cached value on component mount
    const cachedData = localStorage.getItem("cachedValue");
    if (cachedData) {
      setCachedValue(cachedData);
      setid(cachedData);
    }
  }, []);

  useEffect(() => {
    // Store the updated id value in local storage
    localStorage.setItem("cachedValue", id);
  }, [id]);

  return (
    <div>
      {id === "" ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Error />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/male" element={<MaleArticle />} />
            <Route path="/female" element={<FemaleArticle />} />
            <Route path="/transgender" element={<TransgenderArticle />} />
            <Route path="/blog" element={<OutBlogs />} />
          </Routes>
          <Footer />
        </>
      ) : (
        <>
          <InNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Error />} />
            <Route path="/bot" element={<Bot />} />
            <Route path="/male" element={<MaleArticle />} />
            <Route path="/female" element={<FemaleArticle />} />
            <Route path="/transgender" element={<TransgenderArticle />} />
            <Route path="/blog" element={<InBlogs />} />
            <Route path="/myblog" element={<MyBlogs />} />
            <Route path="/blogupload" element={<BlogUploadPage />} />
            <Route path="/blog/update/:id" element={<UpdateBlog />} />
          </Routes>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
