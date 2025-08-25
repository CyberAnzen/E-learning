import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useAppContext } from "../../../../context/AppContext";
import { useEffect } from "react";

export default function RefreshButton({}) {
  const [rotating, setRotating] = useState(false);
  const { fetchTeam } = useAppContext();

  const handleClick = async () => {
    setRotating(true);
    await fetchTeam();
  };
  useEffect(() => {
    if (!rotating) return;
    setTimeout(() => setRotating(false), 1000); // stop rotation after animation
  }, [rotating]);

  return (
    <button
      onClick={handleClick}
      className="p-3 rounded-full  text-white shadow-md hover:bg-gray-700 transition"
    >
      <RefreshCw
        className={`w-4 h-4 ${rotating ? "animate-spin" : "animate-none"}`}
      />
    </button>
  );
}
