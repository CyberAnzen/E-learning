import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const Logout = () => {
  const { logout } = useAppContext();

  useEffect(() => {
    logout();
  }, [logout]);

  return <div>Logging out...</div>;
};

export default Logout;
