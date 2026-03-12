import { useState } from "react";

export default function TrackerLayout() {
  const [code, setCode] = useState("");
  const [project, setProject] = useState(null);

  const handleTrack = () => {
    // 🔥 DEMO DATA (later backend se replace hoga)
    if (code.trim().toUpperCase() === "RT-2025") {
      setProject({
        client: "Fashion Store Delhi",
        status: "In Progress",
        progress: 65,
        lastUpdate: "Updated 3 hours ago",
      });
    } else {
      setProject("invalid");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white 
                    flex items-center justify-center px-4">

      <div className="w-full max-w-md 
                      bg-[#0f0f0f] border 
                      border-orange-500/30 
                      rounded-xl p-8">

        <h1 className="text-2xl font-bold mb-2">
          Project Status Tracker
        </h1>
        <p className="text-gray-400 mb-6">
          Enter your project code to see real-time progress.
        </p>

        {/* INPUT */}
        <input
          type="text"
          placeholder="Enter Project Code (try RT-2025)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-black border border-[#333] 
                     px-4 py-3 rounded-md
                     focus:border-orange-500 
                     outline-none"
        />

        <button
          onClick={handleTrack}
          className="mt-4 w-full bg-orange-500 
                     py-3 rounded-md font-medium
                     hover:bg-orange-600 transition"
        >
          Track Status
        </button>

        {/* RESULT – VALID */}
        {project && project !== "invalid" && (
          <div className="mt-6 border border-[#333] 
                          rounded-lg p-4 space-y-3">

            <h2 className="font-semibold text-lg">
              {project.client}
            </h2>

            <p className="text-sm text-gray-400">
              Status:{" "}
              <span className="text-orange-500">
                {project.status}
              </span>
            </p>

            {/* PROGRESS BAR */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="text-orange-500">
                  {project.progress}%
                </span>
              </div>

              <div className="w-full h-2 bg-[#222] rounded-full">
                <div
                  className="h-full bg-orange-500 
                             rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              {project.lastUpdate}
            </p>
          </div>
        )}

        {/* RESULT – INVALID */}
        {project === "invalid" && (
          <p className="mt-4 text-red-400 text-sm">
            ❌ Invalid project code. Please contact support.
          </p>
        )}

      </div>
    </div>
  );
}
