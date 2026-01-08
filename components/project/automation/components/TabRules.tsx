export default function TabRules() {
  return (
    <div>
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
        <p className="font-bold">We've started deprecating legacy incoming webhooks</p>
        <p className="text-sm mt-1">
          As of May 30, 2025, we’ve started deprecating the legacy incoming webhook in a phased manner.
          Rules triggered through the legacy endpoint can stop working at any time.
          <br />
          <a href="#" className="text-blue-600 underline">View impacted rules</a> · <a href="#" className="text-blue-600 underline">Learn how to update the rules</a>
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input type="text" placeholder="Filter rules" className="border p-2 rounded w-64" />
        <button className="border px-3 py-2 rounded text-sm">🌐 Scope: All rules</button>
        <button className="border px-3 py-2 rounded text-sm">👤 Owned by</button>
        <button className="border px-3 py-2 rounded text-sm">⚡ Action</button>
        <button className="border px-3 py-2 rounded text-sm">▶️ Trigger</button>
        <button className="border px-3 py-2 rounded text-sm">🏷️ Label</button>
      </div>

      <div className="text-center text-gray-400 mt-10">
        <div className="text-5xl">🔍</div>
        <p className="text-lg mt-2">No rules were found</p>
      </div>
    </div>
  );
}
