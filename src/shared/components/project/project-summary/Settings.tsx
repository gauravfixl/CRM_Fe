// components/ProjectSummary/Settings.tsx
export default function Settings() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Settings</h2>
      <ul className="text-sm space-y-1">
        <li>Application Links: <a className="text-blue-600 underline" href="#">Configure Project Links</a></li>
        <li>Cubicle Mobile: Disabled (<a className="text-blue-600 underline" href="#">Enable</a>)</li>
        <li>Connect: <a className="text-blue-600 underline" href="#">More Info</a></li>
      </ul>
    </div>
  );
}