'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StepSetup
 from './stepsetup'
 import StepCompose from './stepcompose'
 import StepFinalize from './stepfinalize'


export default function OfferTemplateWizard({ open, onClose, onCreate }) {
const [step, setStep] = useState(0)
const [payload, setPayload] = useState({ name: '', description: '', workflowEnabled: false, workflow: [] as any[], contentHtml: '', msDoc: null })


const goto = (i) => setStep(i)


const handleCreate = () => {
onCreate({ name: payload.name || 'Untitled', description: payload.description || '' , contentHtml: payload.contentHtml })
}


return (
<AnimatePresence>
{open && (
<motion.div
initial={{ y: '100%' }}
animate={{ y: 0 }}
exit={{ y: '100%' }}
transition={{ type: 'spring', damping: 25, stiffness: 200 }}
className="fixed inset-0 z-50 flex flex-col bg-white"
>
<div className="flex items-center justify-between border-b p-4 text-xs">
<div className="flex items-center gap-4">
<h3 className="font-medium">Create offer letter template</h3>
<div className="flex gap-2 text-[11px] text-gray-500">
<span className={`px-2 py-1 rounded-full ${step===0? 'bg-blue-50 text-blue-600' : ''}`}>1 Setup</span>
<span className={`px-2 py-1 rounded-full ${step===1? 'bg-blue-50 text-blue-600' : ''}`}>2 Compose</span>
<span className={`px-2 py-1 rounded-full ${step===2? 'bg-blue-50 text-blue-600' : ''}`}>3 Finalize</span>
</div>
</div>


<div className="flex items-center gap-2">
{step>0 && <button onClick={() => goto(step-1)} className="text-xs px-3 py-1 border rounded">Back</button>}
<button onClick={onClose} className="text-xs px-3 py-1 border rounded">Cancel</button>
{step<2 && <button onClick={() => goto(step+1)} className="bg-blue-600 text-white text-xs px-3 py-1 rounded">Continue</button>}
{step===2 && <button onClick={() => { handleCreate(); onClose() }} className="bg-blue-600 text-white text-xs px-3 py-1 rounded">Save</button>}
</div>
</div>


<div className="flex-1 overflow-y-auto">
{step===0 && <StepSetup payload={payload} setPayload={setPayload} />}
{step===1 && <StepCompose payload={payload} setPayload={setPayload} />}
{step===2 && <StepFinalize payload={payload}  />}
</div>
</motion.div>
)}
</AnimatePresence>
)
}