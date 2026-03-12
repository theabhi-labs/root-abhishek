import ProgressBar from "./ProgressBar";
import ScreenshotGrid from "./ScreenshotGrid";

export default function ProjectCard({ projectCode }) {
  return (
    <div className="bg-[#121212] 
                    border border-orange-500/20 
                    rounded-xl p-8 
                    mt-8 backdrop-blur-md">

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          Coaching Management System
        </h2>
        <p className="text-gray-400 text-sm">
          Project Code: {projectCode}
        </p>
      </div>

      <ProgressBar percentage={65} />

      <ScreenshotGrid />
    </div>
  );
}

