import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import TeamHeader from "./dashboard/TeamHeader";
import TeamStats from "./dashboard/TeamStats";
import TeamMembers from "./dashboard/TeamMembers";
import TeamActions from "./dashboard/TeamActions";

export default function TeamDashboard() {
  const { team, fetchTeam } = useAppContext();
  useEffect(() => {
    setTimeout(() => {
      fetchTeam();
    }, 10000);
  }, []);
  fetchTeam();

  if (!team) return null;

  return (
    <div className="space-y-6">
      <TeamHeader team={team} />
      <TeamStats team={team} />
      <TeamMembers team={team} />
      <TeamActions team={team} />
    </div>
  );
}
