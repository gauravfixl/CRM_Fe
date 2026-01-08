import React from 'react'


export default function StepSetup({ payload, setPayload }) {
return (
<div className="p-6 text-xs">
<div className="mb-4">
<label className="block text-xs font-medium mb-1">Name of offer letter template</label>
<input className="w-full border px-2 py-2 text-xs rounded" value={payload.name} onChange={(e)=> setPayload({...payload, name: e.target.value})} />
</div>


<div className="mb-4">
<label className="block text-xs font-medium mb-1">Description of template</label>
<textarea className="w-full border px-2 py-2 text-xs rounded" value={payload.description} onChange={(e)=> setPayload({...payload, description: e.target.value})} />
</div>


<div className="flex items-center gap-3 text-xs">
<label className="flex items-center gap-2">
<input type="checkbox" checked={payload.workflowEnabled} onChange={(e)=> setPayload({...payload, workflowEnabled: e.target.checked})} />
<span>Offer letter workflow</span>
</label>
</div>


{payload.workflowEnabled && (
<div className="mt-4 p-3 border rounded text-xs">
<p className="text-xs text-gray-600">Workflow levels (placeholder UI)</p>
<div className="mt-2">
<button className="text-xs px-2 py-1 border rounded" onClick={() => setPayload({...payload, workflow: [...payload.workflow, { role: 'Department Head' }]})}>+ Add level</button>
</div>
<div className="mt-3 space-y-2">
{payload.workflow.map((l, i) => (
<div key={i} className="flex items-center justify-between text-xs">
<div>{l.role}</div>
<button className="text-xs text-red-600" onClick={() => setPayload({...payload, workflow: payload.workflow.filter((_,idx)=>idx!==i)})}>Remove</button>
</div>
))}
</div>
</div>
)}
</div>
)
}