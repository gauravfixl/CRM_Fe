// components/ProjectSummary/Priorities.tsx
export default function Priorities() {
  const priorities = ["Highest", "High", "Medium", "Low", "Lowest"];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Priorities</h2>
      <p className="text-sm text-gray-600 mb-2">Priorities are used to indicate the importance of an issue.</p>
      <p className="text-sm mb-2">Scheme: <a href="#" className="text-blue-600 underline">Default priority scheme</a></p>
      <ul className="space-y-1">
        {priorities.map(priority => (
          <li key={priority} className="text-blue-700 font-medium">{priority}</li>
        ))}
      </ul>
    </div>
  );
}
