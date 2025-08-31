import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const Logout = () => {
  const { logout } = useAppContext();
  localStorage.removeItem("loggedIn");

  useEffect(() => {
    logout();
  }, [logout]);

  return <center className="min-h-screen min-w-screeen">Logging out...</center>;
};

export default Logout;
