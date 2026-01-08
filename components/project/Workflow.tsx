// // 'use client';

// // import React, { useState } from 'react';
// // import { Button } from '@/components/ui/button';
// // import WorkflowModal from '../workflow/WorkFlowModal';
// // import CreateWorkflowModal from '../workflow/CreateWorkflowModal';
// // import AddExistingWorkflowModal from '../workflow/AddExistingWorkflowModal';
// // import type { Workflow } from '../workflow/AddExistingWorkflowModal';
// // import {
// //   DropdownMenu,
// //   DropdownMenuTrigger,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// // } from '@/components/ui/dropdown-menu';

// // const Workflow = () => {
// //   const [modalOpen, setModalOpen] = useState(false);//state to view workflow as diagram or text
// //   const [workflows, setWorkflows] = useState<
// //     { workflow: Workflow; issueTypes: string[] }[]
// //   >([]); //state to reflect workflows in table


// //   const [initialView, setInitialView] = useState<'text' | 'image'>('text'); //state for intial vieew of workflow
// //   const [addWorkflowOpen, setAddWorkflowOpen] = useState(false); //state for adding a new workflow
// //   const [existingWorkflowOpen, setExistingWorkflowOpen] = useState(false); //state for opening existing workflow
// //   const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null); //statee to set selected workflow from existing ones to display

// //   const [editable, setEditable] = useState(false); // controls if modal is editable

// //   const openModal = (view: 'text' | 'image', workflow: Workflow, canEdit = false) => {
// //     setInitialView(view);
// //     setSelectedWorkflow(workflow);
// //     setEditable(canEdit); // set edit mode
// //     setModalOpen(true);
// //     console.log("modal opened");
// //   };
// //   //open function to open workflow as a modal or an image and also chang as per view and edit


// //   const handleExistingWorkflowFinish = (
// //     workflow: Workflow,
// //     issueTypes: string[]
// //   ) => {
// //     // Step 1: Add new workflow to existing list
// //     setWorkflows((prev) => [...prev, { workflow, issueTypes }]);

// //     // Step 2: Close the "Existing Workflow" modal
// //     setExistingWorkflowOpen(false);
// //   };


// //   const handleCreate = (workflow: { name: string; description: string }) => {
// //     // Step 1: Create a new Workflow object from the user input
// //     const newWorkflow: Workflow = {
// //       id: Date.now().toString(),                 // Generate a unique ID based on current timestamp
// //       name: workflow.name,                      // Use the name from user input
// //       description: workflow.description,        // Use the description from user input
// //       lastModified: new Date().toISOString(),   // Set current time as last modified timestamp
// //       imageUrl: '',                              // Empty for now; can be updated later if needed
// //     };

// //     // Step 2: Update the workflows state by appending the new workflow
// //     // Wrapping it inside an object with empty issueTypes for now
// //     setWorkflows((prev) => [
// //       ...prev,
// //       { workflow: newWorkflow, issueTypes: [] }
// //     ]);

// //     // Step 3: Close the "Add Workflow" modal after submission
// //     setAddWorkflowOpen(false);
// //   };


// //   return (
// //     <div className="p-6 space-y-6">
// //       {/* Breadcrumbs */}
// //       <div className="text-sm text-muted-foreground">
// //         Projects / <span className="text-black font-medium">my proj</span> / Project settings
// //       </div>

// //       {/* Title */}
// //       <h1 className="text-2xl font-bold">Workflows</h1>
// //       <h2 className="text-lg font-medium">
// //         MP: Software Simplified Workflow Scheme
// //       </h2>

// //       {/* Info Banner */}
// //       <div className="bg-purple-50 border border-purple-200 text-sm text-purple-900 p-4 rounded-md relative">
// //         <strong className="block mb-1">🚀 Speed up your team's workflow updates</strong>
// //         <p>
// //           Grant your team the <strong>Edit Workflows</strong> permission so they can manage workflows themselves.
// //         </p>
// //         <a href="#" className="text-blue-600 underline text-sm">Go to permission schemes</a>
// //         <button className="absolute top-2 right-3 text-xl leading-none text-purple-700 hover:text-purple-900">&times;</button>
// //       </div>

// //       {/* Controls */}
// //       <div className="flex gap-2">
// //         <DropdownMenu>
// //           <DropdownMenuTrigger asChild>
// //             <Button variant="secondary">New Workflow</Button>
// //           </DropdownMenuTrigger>
// //           <DropdownMenuContent>
// //             <DropdownMenuItem onClick={() => setAddWorkflowOpen(true)}>
// //               ➕ Create New
// //             </DropdownMenuItem>
// //             <DropdownMenuItem
// //               onClick={() => {
// //                 // Delay to avoid DropdownMenu closing interfering with modal open
// //                 setTimeout(() => setExistingWorkflowOpen(true), 0);
// //               }}
// //             >
// //               📁 Add Existing
// //             </DropdownMenuItem>
// //           </DropdownMenuContent>
// //         </DropdownMenu>

// //         <Button variant="secondary">Switch Scheme</Button>
// //       </div>

// //       {/* Workflow Table */}
// //       <div className="mt-4 border-t pt-4 w-full ">
// //         <div className="font-medium mb-2 ">Workflow</div>
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 "  >
// //           <div className="w-full">
// //             {workflows.map(({ workflow, issueTypes }, index) => (
// //               <div
// //                 key={index}
// //                 className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t pt-4 mt-4  w-full"
// //               >
// //                 {/* Workflow Name and View Options */}
// //                 <div>
// //                   <p className="font-semibold">{workflow.name}</p>
// //                   <p className="text-sm text-muted-foreground">
// //                     (View as{' '}
// //                     <button
// //                       onClick={() => openModal('text', workflow)}
// //                       className="text-blue-600 underline"
// //                     >
// //                       text
// //                     </button>{' '}
// //                     /{' '}
// //                     <button
// //                       onClick={() => openModal('image', workflow)}
// //                       className="text-blue-600 underline"
// //                     >
// //                       diagram
// //                     </button>
// //                     )
// //                   </p>
// //                 </div>

// //                 {/* Issue Types */}
// //                 <div className="flex flex-wrap gap-3 text-sm">
// //                   {issueTypes.map((type) => (
// //                     <IssueType key={type} label={type} />
// //                   ))}
// //                 </div>

// //                 {/* Edit Action */}
// //                 <div>
// //                   <button
// //                     className="text-blue-600 underline text-sm"
// //                     onClick={() => openModal('image', workflow, true)} // true means editable
// //                   >
// //                     Edit workflow
// //                   </button>

// //                 </div>
// //               </div>
// //             ))}

// //           </div>


// //         </div>
// //       </div>

// //       {/* Modals */}
// //     <WorkflowModal
// //   open={modalOpen}
// //   onClose={() => setModalOpen(false)}
// //   initialView={initialView}
// //   workflow={selectedWorkflow}
// //   editable={editable}
// // />
// //  {/*modal to view workflow as image or text*/}

// //       <CreateWorkflowModal
// //         open={addWorkflowOpen}
// //         onClose={() => setAddWorkflowOpen(false)}
// //         onCreate={handleCreate}
// //       />{/*modal to create workflow */}

// //       <AddExistingWorkflowModal
// //         open={existingWorkflowOpen}
// //         onClose={() => setExistingWorkflowOpen(false)}
// //         onFinish={handleExistingWorkflowFinish}
// //       />{/*modal to add exis workflow */}
// //     </div>
// //   );
// // };

// // export default Workflow;

// // // ---------------------------
// // // Helper Component
// // // ---------------------------

// // const IssueType = ({ label, emoji }: { label: string; emoji?: string }) => (
// //   <div className="flex items-center gap-1 border rounded-md px-2 py-1 bg-gray-100 text-gray-800">
// //     {emoji && <span>{emoji}</span>}
// //     {label}
// //   </div>
// // );
// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import WorkflowModal from '../workflow/WorkFlowModal';
// import CreateWorkflowModal from '../workflow/CreateWorkflowModal';
// import AddExistingWorkflowModal from '../workflow/AddExistingWorkflowModal';
// import type { Workflow } from '../workflow/AddExistingWorkflowModal';
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from '@/components/ui/dropdown-menu';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import WorkflowDiagram from '../workflow/WorkFlowDiagram';
// // Default placeholder diagram data
// const defaultStates = [
//   { key: 'todo', name: 'To Do', category: 'status', color: '#f87171', order: 1 },
//   { key: 'inprogress', name: 'In Progress', category: 'status', color: '#60a5fa', order: 2 },
//   { key: 'done', name: 'Done', category: 'status', color: '#34d399', order: 3 },
// ];

// const defaultTransitions = [
//   { fromKey: 'todo', toKey: 'inprogress' },
//   { fromKey: 'inprogress', toKey: 'done' },
// ];

// const Workflow = () => {
//   const [viewType, setViewType] = useState<'project' | 'team'>('project'); // tab type
//   const [selectedTeam, setSelectedTeam] = useState<string | null>(null); // selected team for team workflows

//   const [modalOpen, setModalOpen] = useState(false);
//   const [workflows, setWorkflows] = useState<{ workflow: Workflow; issueTypes: string[]; team?: string }[]>([]);

//   const [initialView, setInitialView] = useState<'text' | 'image'>('image'); // now default diagram
//   const [addWorkflowOpen, setAddWorkflowOpen] = useState(false);
//   const [existingWorkflowOpen, setExistingWorkflowOpen] = useState(false);
//   const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
//   const [editable, setEditable] = useState(false);

//   const openModal = (workflow: Workflow, canEdit = false) => {
//     setInitialView('image'); // Always open in diagram view
//     setSelectedWorkflow(workflow);
//     setEditable(canEdit);
//     setModalOpen(true);
//   };

//   const handleExistingWorkflowFinish = (workflow: Workflow, issueTypes: string[], team?: string) => {
//     setWorkflows((prev) => [...prev, { workflow, issueTypes, team }]);
//     setExistingWorkflowOpen(false);
//   };

//   const handleCreate = (workflow: { name: string; description: string }, team?: string) => {
//     const newWorkflow: Workflow = {
//       id: Date.now().toString(),
//       name: workflow.name,
//       description: workflow.description,
//       lastModified: new Date().toISOString(),
//       imageUrl: '',
//     };
//     setWorkflows((prev) => [...prev, { workflow: newWorkflow, issueTypes: [], team }]);
//     setAddWorkflowOpen(false);
//   };

//   // Teams list (dummy for now)
//   const teams = ['Design', 'Development', 'QA', 'Marketing'];

//   // Filter workflows based on view type
//   const displayedWorkflows =
//     viewType === 'project'
//       ? workflows.filter((wf) => !wf.team)
//       : workflows.filter((wf) => wf.team === selectedTeam);

//   return (
//     <div className="p-6 space-y-6">
//       {/* Breadcrumbs */}
//       <div className="text-sm text-muted-foreground">
//         Projects / <span className="text-black font-medium">my proj</span> / Project settings
//       </div>

//       {/* Title */}
//       <h1 className="text-2xl font-bold">Workflows</h1>

//       {/* View type toggle */}
//       <div className="flex gap-4 mt-4">
//         <Button
//           variant={viewType === 'project' ? 'default' : 'secondary'}
//           onClick={() => setViewType('project')}
//         >
//           Project Workflow
//         </Button>
//         <Button
//           variant={viewType === 'team' ? 'default' : 'secondary'}
//           onClick={() => setViewType('team')}
//         >
//           Teams Workflow
//         </Button>
//       </div>

//       {/* Team selector for Teams Workflow */}
//       {viewType === 'team' && (
//         <div className="mt-4 w-60">
//           <Select onValueChange={(val) => setSelectedTeam(val)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select a team" />
//             </SelectTrigger>
//             <SelectContent>
//               {teams.map((team) => (
//                 <SelectItem key={team} value={team}>
//                   {team}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       )}

//       {/* Controls */}
//       {/* <div className="flex gap-2 mt-4">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="secondary">New Workflow</Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent>
//             <DropdownMenuItem onClick={() => setAddWorkflowOpen(true)}>➕ Create New</DropdownMenuItem>
//             <DropdownMenuItem onClick={() => setTimeout(() => setExistingWorkflowOpen(true), 0)}>
//               📁 Add Existing
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <Button variant="secondary">Switch Scheme</Button>
//       </div> */}

//       {/* Workflow Table */}
//       <div className="mt-4 border-t pt-4 w-full">
//         <div className="font-medium mb-2">Workflow</div>
//         {displayedWorkflows.length > 0 ? (
//           displayedWorkflows.map(({ workflow, issueTypes }, index) => (
//             <div
//               key={index}
//               className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t pt-4 mt-4 w-full"
//             >
//               <div>
//                 <p className="font-semibold">{workflow.name}</p>
//                 <p className="text-sm text-muted-foreground">
//                   (View as{' '}
//                   <button onClick={() => openModal(workflow)} className="text-blue-600 underline">
//                     diagram
//                   </button>
//                   )
//                 </p>
//               </div>
//               <div className="flex flex-wrap gap-3 text-sm">
//                 {issueTypes.map((type) => (
//                   <IssueType key={type} label={type} />
//                 ))}
//               </div>
//               <div>
//                 <button
//                   className="text-blue-600 underline text-sm"
//                   onClick={() => openModal(workflow, true)}
//                 >
//                   Edit workflow
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//            <div className="h-[400px] border rounded-md overflow-hidden">
//     <WorkflowDiagram
//       states={defaultStates}
//       transitions={defaultTransitions}
//       editable={false} // not editable by default
//     />
//   </div>
//         )}
//       </div>

//       {/* Modals */}
//       <WorkflowModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         initialView={initialView}
//         workflow={selectedWorkflow}
//         editable={editable}
//       />

//       <CreateWorkflowModal
//         open={addWorkflowOpen}
//         onClose={() => setAddWorkflowOpen(false)}
//         onCreate={(data) => handleCreate(data, viewType === 'team' ? selectedTeam || undefined : undefined)}
//       />

//       <AddExistingWorkflowModal
//         open={existingWorkflowOpen}
//         onClose={() => setExistingWorkflowOpen(false)}
//         onFinish={(wf, issues) =>
//           handleExistingWorkflowFinish(wf, issues, viewType === 'team' ? selectedTeam || undefined : undefined)
//         }
//       />
//     </div>
//   );
// };

// export default Workflow;

// const IssueType = ({ label, emoji }: { label: string; emoji?: string }) => (
//   <div className="flex items-center gap-1 border rounded-md px-2 py-1 bg-gray-100 text-gray-800">
//     {emoji && <span>{emoji}</span>}
//     {label}
//   </div>
// );
'use client';

import React, { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import WorkflowModal from '../workflow/WorkFlowModal';
import CreateWorkflowModal from '../workflow/CreateWorkflowModal';
import AddExistingWorkflowModal from '../workflow/AddExistingWorkflowModal';
import type { Workflow } from '../workflow/AddExistingWorkflowModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WorkflowDiagram from '../workflow/WorkFlowDiagram';
import { getWorkFlowByBoard,workflowById ,updateWorkflow} from '@/hooks/workflowHooks';
import UpdateWorkflowModal from '../custom/UpdateWorkFlowModal';
import { useParams } from 'next/navigation';
import { useLoaderStore } from '@/lib/loaderStore';


 interface WorkflowProps {
  boardId?: string;
  teams:any;

}
const Workflow = ({boardId,teams}) => {
  console.log("boardId in workflow component:", boardId, teams)
   const params = useParams();
  const projectId = params.projectId as string; // read directly from route
  console.log("projectId from params:", projectId);
  const [viewType, setViewType] = useState<'project' | 'team'>('project');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState(null);
  const [transitions, setTransitions] = useState<any[]>([]); // <-- NEW

  const [modalOpen, setModalOpen] = useState(false);
  const [workflows, setWorkflows] = useState<{ workflow: Workflow; issueTypes: string[]; states: any[]; transitions: any[]; team?: string }[]>([

  ]);

  const [viewMode, setViewMode] = useState<'table' | 'diagram'>('diagram');
  const [addWorkflowOpen, setAddWorkflowOpen] = useState(false);
  const [existingWorkflowOpen, setExistingWorkflowOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [editable, setEditable] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
const [selectedState, setSelectedState] = useState<any>(null);
const [workflowStates, setWorkflowStates] = useState<any[]>([]);
const {showLoader, hideLoader}= useLoaderStore()


// const handleStateClick = (state: any) => {

//   setSelectedState(state);
//   setUpdateModalOpen(true);
// // };
// const handleStateClick = async (state: any) => {
//   try {
//     const wfId = displayedWorkflows[0].workflow.id;
//     const projectid = projectId;

//     const res = await workflowById(wfId, projectid);
//     const statesToUpdate = res.data.workflow.states;

//     const updatedStates = statesToUpdate.map(s => ({
//       key: s.key,
//       name: s.name,
//       color: s.color,
//       order: s.order,
//       category: 'status'
//     }));
// setSelectedState(typeof state === "string" ? state : state.key);

//     setUpdateModalOpen(true);
//   } catch (err) {
//     console.error("Error fetching workflow by ID:", err);
//   }
// };

const handleStateClick = async (state: any) => {
  try {
    showLoader()
    const wfId = displayedWorkflows[0].workflow.id;
    const projectid = projectId;

    const res = await workflowById(wfId, projectid);
    const statesToUpdate = res.data.workflow.states;

    // Transform the states
    const updatedStates = statesToUpdate.map(s => ({
      key: s.key,
      name: s.name,
      color: s.color,
      order: s.order,
      category: 'status'
    }));

    // Set selected state key (fromKey)
    setSelectedState(typeof state === "string" ? state : state.key);

    // Store workflow-specific states for modal
    setWorkflowStates(updatedStates);

    setUpdateModalOpen(true);
  } catch (err) {
    console.error("Error fetching workflow by ID:", err);
  }finally{
    hideLoader()
  }
};
console.log(workflowStates, "workflowStates")
 console.log("selectedState:", selectedState);

const handleUpdateStateTransitions = async (
  workflowId: string,
  updatedNodeTransitions: any[],
  allStates: any[]
) => {
  console.log("DEBUG - handleUpdateStateTransitions called");
  console.log("workflowId:", workflowId);
  console.log("updatedNodeTransitions:", updatedNodeTransitions);
  console.log("allStates received:", allStates);

  if (!allStates || allStates.length === 0) {
    console.warn("WARNING - allStates is empty or undefined!");
    return;
  }

  setWorkflows(prevWorkflows => {
    return prevWorkflows.map(wf => {
      if (wf.workflow.id !== workflowId) return wf;

      console.log("Current workflow transitions before merge:", wf.transitions);

      // 1. Merge transitions for this node
      const otherTransitions = wf.transitions.filter(
        t => t.fromKey !== updatedNodeTransitions[0].fromKey
      );

      // Prevent duplicates: only add transitions that don't already exist
      const dedupedNewTransitions = updatedNodeTransitions.filter(newT =>
        !otherTransitions.some(
          existing =>
            existing.fromKey === newT.fromKey &&
            existing.toKey === newT.toKey
        )
      );

      const mergedTransitions = [...otherTransitions, ...dedupedNewTransitions];
      console.log("Merged transitions (deduped):", mergedTransitions);

      // 2. Add correct fromOrder and toOrder
      const transitionsWithOrder = mergedTransitions.map(t => {
        const fromStateObj = allStates.find(s => s.key === t.fromKey);
        const toStateObj = allStates.find(s => s.key === t.toKey);

        if (!fromStateObj) console.warn("From state not found:", t.fromKey);
        if (!toStateObj) console.warn("To state not found:", t.toKey);

        return {
          ...t,
          fromOrder: fromStateObj?.order ?? 0,
          toOrder: toStateObj?.order ?? 0
        };
      });

      console.log("Transitions with orders applied:", transitionsWithOrder);

      // 3. Call API to update workflow
      (async () => {
        try {
          showLoader()
          const payload = { name: "workflow update", transitions: transitionsWithOrder };
          console.log("Sending workflow update payload:", payload);
          const response = await updateWorkflow(workflowId, payload);
          console.log("Workflow update response:", response);
        } catch (error) {
          console.error("Failed to update workflow:", error);
        }
        finally{
          hideLoader()
        }
      })();

      // 4. Update state immediately
      return { ...wf, transitions: mergedTransitions };
    });
  });
};


  const openModal = (workflow: Workflow, canEdit = false) => {
    setSelectedWorkflow(workflow);
    setEditable(canEdit);
    setModalOpen(true);
  };

  // const handleExistingWorkflowFinish = (workflow: Workflow, issueTypes: string[], team?: string) => {
  //   setWorkflows((prev) => [...prev, { workflow, issueTypes, states: defaultStates, transitions: defaultTransitions, team }]);
  //   setExistingWorkflowOpen(false);
  // };

  // const handleCreate = (workflow: { name: string; description: string }, team?: string) => {
  //   const newWorkflow: Workflow = {
  //     id: Date.now().toString(),
  //     name: workflow.name,
  //     description: workflow.description,
  //     lastModified: new Date().toISOString(),
  //     imageUrl: '',
  //   };
  //   setWorkflows((prev) => [...prev, { workflow: newWorkflow, issueTypes: [], states: defaultStates, transitions: defaultTransitions, team }]);
  //   setAddWorkflowOpen(false);
  // };
const updateTransitionsForStates = (states: any[], transitions: any[]) => {
  console.log("=== updateTransitionsForStates called ===");
  console.log("States received:", states);
  console.log("Transitions received:", transitions);

  const updated = transitions.map(t => {
    const fromState = states.find(s => s.key === t.fromKey);
    const toState = states.find(s => s.key === t.toKey);

    const result = {
      fromKey: fromState?.key ?? t.fromKey,
      toKey: toState?.key ?? t.toKey,
      fromOrder: fromState?.order ?? 0,
      toOrder: toState?.order ?? 0,
    };

    console.log(`Mapping transition: ${t.fromKey} → ${t.toKey}`);
    console.log("Mapped transition with orders:", result);

    return result;
  });

  console.log("Updated transitions array:", updated);
  return updated;
};

const handleUpdateWorkflowData = (workflowId: string, states: any[], transitions: any[]) => {
  console.log("=== handleUpdateWorkflowData called ===");
  console.log("Workflow ID:", workflowId);
  console.log("Incoming states:", states);
  console.log("Incoming transitions:", transitions);

  const updatedTransitions = updateTransitionsForStates(states, transitions);
  console.log("Updated transitions after mapping:", updatedTransitions);

  setWorkflows(prev =>
    prev.map(wf => {
      if (wf.workflow.id === workflowId) {
        console.log(`Updating workflow: ${workflowId}`);
        console.log("New workflow states:", states);
        console.log("New workflow transitions:", updatedTransitions);
        return { ...wf, states, transitions: updatedTransitions };
      }
      return wf;
    })
  );
};


  const displayedWorkflows =
    viewType === 'project'
      ? workflows.filter((wf) => !wf.team)
      : workflows.filter((wf) => wf.team === selectedTeam);



      console.log(displayedWorkflows, "displayworkflows")
// 2. Fetch workflow after boardId is available
 useEffect(() => {
  if (!boardId) return;

  const fetchWorkflow = async () => {
    try {
      showLoader()
      const res = await getWorkFlowByBoard(boardId);
      // Assuming res.data.workflows is an array with 1 workflow object
      const wf = res.data.workflows[0];
      
      // Make sure the keys are normalized (fix typo if necessary)
      const states = wf.states.map(s => ({
  key: s.key,
  name: s.name,
  color: s.color,
  order: s.order,
  category: 'status'
}));

const transitions = wf.transitions.map(t => ({
  fromKey: t.fromKey,
  toKey: t.toKey
}));

// Update local workflows
setWorkflows([{
  workflow: {
    id: wf._id,
    name: wf.name,
    description: wf.description || '',
    lastModified: new Date().toISOString(),
    imageUrl: ''
  },
  issueTypes: [],
  states,
  transitions
}]);

// ✅ Sync parent-level states
setWorkflowStates(states);
setTransitions(transitions);

    } catch (err) {
      console.error("Error fetching workflow:", err);
    }
    finally{
      hideLoader()
    }
  };

  fetchWorkflow();
}, [boardId]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workflows</h1>
        <div className="flex gap-2">
          <Button variant={viewMode === 'table' ? 'default' : 'secondary'} onClick={() => setViewMode('table')}>View as Table</Button>
          <Button variant={viewMode === 'diagram' ? 'default' : 'secondary'} onClick={() => setViewMode('diagram')}>View as Diagram</Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant={viewType === 'project' ? 'default' : 'secondary'} onClick={() => setViewType('project')}>Project Workflow</Button>
        <Button variant={viewType === 'team' ? 'default' : 'secondary'} onClick={() => setViewType('team')}>Teams Workflow</Button>
      </div>

  {viewType === 'team' && (
  <div className="mt-4 w-60">
    <Select
      onValueChange={async (val) => {
        setSelectedTeam(val);
        // Find the boardId for the selected team
        const selected = teams.find((t) => t._id === val);
        if (!selected) return;

        const boardId = selected.boardId;
        if (!boardId) return;

        try {
          const res = await getWorkFlowByBoard(boardId);
          const wf = res.data.workflows[0];
          if (!wf) return;

          const states = wf.states.map((s) => ({
            key: s.key ,
            name: s.name,
            color: s.color,
            order: s.order,
            category: 'status'
          }));

          const transitions = wf.transitions.map((t) => ({
            fromKey: t.fromKey,
            toKey: t.toKey ,
          }));

          setWorkflows([{
            workflow: {
              id: wf._id,
              name: wf.name,
              description: wf.description || '',
              lastModified: new Date().toISOString(),
              imageUrl: ''
            },
            issueTypes: [],
            states,
            transitions,
            team: val
          }]);
        } catch (err) {
          console.error("Error fetching workflow for team:", err);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a team" />
      </SelectTrigger>
      <SelectContent>
        {teams.map((team) => (
          <SelectItem key={team._id} value={team._id}>
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}


      <div className="mt-4 border-t pt-4">
        {viewMode === 'table' ? (
          displayedWorkflows.map(({ workflow, states, transitions }) => (
            <div key={workflow.id} className="border rounded p-4 mb-4">
              <h2 className="font-bold">{workflow.name}</h2>
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
              <div className="mt-2">
                <strong>States:</strong>
                <ul className="list-disc ml-5">
                  {states.map(s => <li key={s.key} style={{ color: s.color }}>{s.name}</li>)}
                </ul>
              </div>
              <div className="mt-2">
                <strong>Transitions:</strong>
                <ul className="list-disc ml-5">
                  {transitions.map((t, i) => <li key={i}>{t.fromKey} → {t.toKey}</li>)}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="h-[400px] border rounded">
            {displayedWorkflows.length > 0 && (
              // <WorkflowDiagram
              //   states={displayedWorkflows[0].states}
              //   transitions={displayedWorkflows[0].transitions}
              //   editable
              //   onUpdate={(states, transitions) =>
              //     handleUpdateWorkflowData(displayedWorkflows[0].workflow.id, states, transitions)
              //   }
              // />
              <WorkflowDiagram
  // states={displayedWorkflows[0].states}
  states={workflowStates}
  transitions={transitions}
  editable
 onUpdate={(updatedStates, updatedTransitions) => {
    setWorkflowStates(updatedStates);       // update parent immediately
    setTransitions(updatedTransitions);     // update parent immediately
    handleUpdateWorkflowData(displayedWorkflows[0].workflow.id, updatedStates, updatedTransitions);
  }}
  onStateClick={handleStateClick}
/>


            )}
          </div>
        )}
      </div>
    {selectedState && (



// {
  /* <UpdateWorkflowModal
  open={updateModalOpen}
  onClose={() => setUpdateModalOpen(false)}
  workflowId={displayedWorkflows[0].workflow.id}
  state={selectedState}
  allStates={workflowStates} // <-- only workflow states
  transitions={displayedWorkflows[0].transitions}
  onSave={(updatedTransitions) =>
    handleUpdateStateTransitions(
      displayedWorkflows[0].workflow.id,
      updatedTransitions,
      workflowStates // use workflow states here too
    )
  }
/> */
// }
<UpdateWorkflowModal
  open={updateModalOpen}
  onClose={() => setUpdateModalOpen(false)}
  workflowId={displayedWorkflows[0].workflow.id}
  state={selectedState}
  allStates={workflowStates}
  transitions={transitions}   // <-- use shared transitions
  onSave={(updatedTransitions) => {
    setTransitions(updatedTransitions); // update parent immediately
    handleUpdateStateTransitions(displayedWorkflows[0].workflow.id, updatedTransitions, workflowStates);
  }}
/>



)}

    </div>
  );
};

export default Workflow;
