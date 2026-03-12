export default function ProgressBar({ percentage }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm mb-2">
        <span>Status</span>
        <span className="text-orange-500">
          {percentage}% Complete
        </span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-3">
        <div
          className="bg-orange-500 h-3 rounded-full 
                     transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

