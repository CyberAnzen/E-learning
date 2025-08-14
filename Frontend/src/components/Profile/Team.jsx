import React from "react";
import { useAppContext } from "../../context/AppContext";
import TeamInitialState from "./team/TeamInitialState";
import TeamDashboard from "./team/TeamDashboard";

export default function Team() {
  const { team } = useAppContext();

  return (
    <div className="px-0 min-h-screen font-sans">
      {team ? <TeamDashboard /> : <TeamInitialState />}
    </div>
  );
}
