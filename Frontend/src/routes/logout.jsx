import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  console.log("Before:", document.cookie);

  const navigate = useNavigate();
  useEffect(() => {
    Cookies.remove("token", { path: "/login", domain: "localhost" });
    navigate("/login");
  }, []);

  console.log("After: ", document.cookie); // Fixed typo from 'document' to 'document.cookie'

  return <div>Logging out...</div>;
};

export default Logout;
