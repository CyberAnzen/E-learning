import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import TeamInitialState from "./team/TeamInitialState";
import TeamDashboard from "./team/TeamDashboard";

export default function Team() {
  const { team, fetchTeam } = useAppContext();
  useEffect(() => {
    fetchTeam();
  }, []);
  return (
    <div className="px-0 min-h-screen font-sans">
      {team ? <TeamDashboard /> : <TeamInitialState />}
    </div>
  );
}
