import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Welcome to GovPulse</h1>
      <p className="text-gray-400">This is the public home page.</p>
      <Link to="/dashboard" className="text-indigo-500 underline">
        Go to Dashboard
      </Link>
    </div>
  );
}
