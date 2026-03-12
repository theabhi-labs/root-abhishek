export default function ScreenshotGrid() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Development Proof
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-orange-500/30 
                       rounded-lg overflow-hidden 
                       hover:scale-105 transition"
          >
            <img
              src={`/screenshots/day-${i}.png`}
              alt="Project proof"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

