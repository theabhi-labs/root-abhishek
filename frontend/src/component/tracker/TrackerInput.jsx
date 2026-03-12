export default function TrackerInput({
  projectCode,
  setProjectCode,
  onTrack
}) {
  return (
    <div className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Enter Project Code"
        value={projectCode}
        onChange={(e) => setProjectCode(e.target.value)}
        className="flex-1 bg-[#0f0f0f] 
                   border border-orange-500/40 
                   rounded-lg px-5 py-3 
                   focus:outline-none 
                   focus:border-orange-500"
      />

      <button
        onClick={onTrack}
        className="bg-orange-500 hover:bg-orange-600 
                   px-6 py-3 rounded-lg 
                   font-medium transition"
      >
        Track Status
      </button>
    </div>
  );
}

