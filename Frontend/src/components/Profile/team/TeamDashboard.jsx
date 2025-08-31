import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import TeamHeader from "./dashboard/TeamHeader";
import TeamStats from "./dashboard/TeamStats";
import TeamMembers from "./dashboard/TeamMembers";
import TeamActions from "./dashboard/TeamActions";

export default function TeamDashboard() {
  const { team, fetchTeam } = useAppContext();
  const [Team, setTeam] = useState();
  useEffect(() => {
    setTimeout(() => {
      fetchTeam();
    }, 20000);
  }, []);
  useEffect(() => {
    if (team) {
      setTeam(team);
    }
  }, [team]);
  if (!Team) return null;

  return (
    <div className="space-y-6">
      <TeamHeader team={Team} />
      <TeamStats team={Team} />
      <TeamMembers team={Team} />
      <TeamActions team={Team} />
    </div>
  );
}
