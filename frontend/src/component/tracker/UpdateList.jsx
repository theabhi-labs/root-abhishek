export default function UpdateList() {
  const updates = [
    { day: "Day 1", text: "Database schema finalized", done: true },
    { day: "Day 2", text: "Authentication module completed", done: true },
    { day: "Day 3", text: "Dashboard UI in progress", done: false },
  ];

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-4">
        Daily Progress
      </h3>

      <ul className="space-y-3 text-sm">
        {updates.map((u, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className={u.done ? "text-orange-500" : "text-gray-500"}>
              {u.done ? "✔" : "⏳"}
            </span>
            <span className="text-gray-300">
              {u.day} – {u.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
