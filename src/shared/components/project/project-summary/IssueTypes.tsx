// components/ProjectSummary/IssueTypes.tsx
export default function IssueTypes() {
  const issueTypes = ["Bug", "Epic", "Story", "Sub-task", "Task"];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Issue types</h2>
      <p className="text-sm text-gray-600 mb-2">
        Keep track of different types of issues, such as bugs or tasks.
      </p>
      <p className="text-sm mb-2">
        Scheme: <a href="#" className="text-blue-600 underline">MP: Scrum Issue Type Scheme</a>
      </p>
      <ul className="space-y-1">
        {issueTypes.map(type => (
          <li key={type} className="text-blue-700 font-medium">{type}</li>
        ))}
      </ul>
    </div>
  );
}