import React, { useState, useEffect, useMemo } from "react";
import { Terminal } from "lucide-react";
import ChapterProgress from "../../components/content/ChapterProgress";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const WS_URL =`${BACKEND_URL}/leaderboard` 


export default function Leaderboard() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let ws;
    let reconnectTimer;

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("[WS] Connected to leaderboard");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            setRows(data); // replace full leaderboard
          } else if (data.type === "update") {
            setRows((prev) => {
              const copy = [...prev];
              const idx = copy.findIndex((t) => t.id === data.payload.id);
              if (idx !== -1) copy[idx] = data.payload;
              else copy.push(data.payload);
              return copy;
            });
          }
        } catch (err) {
          console.warn("[WS] Invalid message:", err);
        }
      };

      ws.onclose = () => {
        console.log("[WS] Disconnected. Reconnecting in 2s...");
        reconnectTimer = setTimeout(connect, 2000);
      };

      ws.onerror = (err) => {
        console.error("[WS] Error:", err);
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => r.team.toLowerCase().includes(q));
    if (sortBy === "score") list = list.sort((a, b) => b.score - a.score);
    if (sortBy === "solves") list = list.sort((a, b) => b.solves - a.solves);
    if (sortBy === "name")
      list = list.sort((a, b) => a.team.localeCompare(b.team));
    return list;
  }, [rows, query, sortBy]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Right: Live Feed Panel */}
        <div className="col-span-1 flex items-center justify-center">
          <div className="w-full bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] backdrop-blur-[8px] border border-[rgba(1,255,219,0.12)] shadow-[0_8px_30px_rgba(1,255,219,0.04)] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] md:min-h-[420px]">
            <div className="text-xl font-semibold text-[#01ffdb]">
              CTF Live Feed
            </div>
            <div className="text-[rgba(255,255,255,0.55)] text-center mt-2">
              Half of this page reserved for live graph / match info
            </div>
            <ChapterProgress />
          </div>
        </div>

        {/* Left: Leaderboard */}
        <div className="col-span-1 flex items-stretch">
          <div className="w-full bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] backdrop-blur-[8px] border border-[rgba(1,255,219,0.12)] shadow-[0_8px_30px_rgba(1,255,219,0.04)] rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4 md:gap-0">
              <div className="flex items-center gap-2">
                <Terminal size={22} color="#01ffdb" />
                <div>
                  <h2 className="text-2xl font-semibold text-[#01ffdb]">
                    CTF Leaderboard
                  </h2>
                  <div className="text-sm text-[rgba(255,255,255,0.55)]">
                    Live standings · minimal glass UI
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 items-stretch md:items-center w-full md:w-auto">
                <input
                  placeholder="Search team"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="px-3 py-2 bg-transparent border rounded-lg outline-none border-[rgba(255,255,255,0.06)] text-white flex-1"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="py-2 bg-black/80 border rounded-lg outline-none border-[rgba(255,255,255,0.06)] text-white flex-1"
                >
                  <option value="score">Sort: Score</option>
                  <option value="solves">Sort: Solves</option>
                  <option value="name">Sort: Name</option>
                </select>
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="overflow-hidden rounded-xl">
              <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs text-[rgba(255,255,255,0.55)] border-b border-[rgba(255,255,255,0.04)]">
                <div className="col-span-1">#</div>
                <div className="col-span-6">Team</div>
                <div className="col-span-3 text-right">Score</div>
                <div className="col-span-2 text-right">Solves</div>
              </div>

              <div className="space-y-2 p-3">
                {filtered.map((r, i) => (
                  <div
                    key={r.id}
                    className={`flex items-center gap-4 px-3 py-3 rounded-lg ${
                      i < 3
                        ? "shadow-[0_6px_28px_rgba(1,255,219,0.08),inset_0_1px_0_rgba(255,255,255,0.02)]"
                        : ""
                    }`}
                    style={{
                      background:
                        i % 2 === 0
                          ? "linear-gradient(180deg, rgba(255,255,255,0.01), transparent)"
                          : "transparent",
                    }}
                  >
                    <div
                      className="min-w-[2rem] text-lg font-medium"
                      style={{ color: i === 0 ? "#01ffdb" : "white" }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{r.team}</div>
                      <div className="text-xs text-[rgba(255,255,255,0.55)]">
                        team id: {r.id}
                      </div>
                    </div>
                    <div className="min-w-[6rem] text-right font-semibold">
                      {r.score}
                    </div>
                    <div className="min-w-[4rem] text-right text-[rgba(255,255,255,0.55)]">
                      {r.solves}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-[rgba(255,255,255,0.55)] text-right">
              Live updates via WebSocket
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
