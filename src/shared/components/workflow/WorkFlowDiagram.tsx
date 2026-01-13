
"use client";

import { useCallback, useMemo, useState,useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

// Types
type State = {
  key: string;
  name: string;
  category: string;
  color: string;
  order: number;
};

type Transition = {
  fromKey: string;
  toKey: string;
};
export interface WorkflowDiagramProps {
  states: State[];
  transitions: Transition[];
  onNodeClick?: (nodeId: string) => void;
  editable?: boolean; // ✅ Add this
   onUpdate?: (states: State[], transitions: Transition[]) => void; // NEW
   onStateClick?: (stateKey: string) => void; // <-- Add this
}



export default function WorkflowDiagram({
  states,
  transitions,
  onNodeClick,
  editable, // ✅ now available
  onUpdate,
  onStateClick
}: WorkflowDiagramProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const allKeys = states.map((s) => s.key);

  const outgoingMap: Record<string, Set<string>> = {};
  const incomingMap: Record<string, Set<string>> = {};

  allKeys.forEach((key) => {
    outgoingMap[key] = new Set();
    incomingMap[key] = new Set();
  });
transitions.forEach(({ fromKey, toKey }) => {
  console.log(`Processing transition: ${fromKey} → ${toKey}`);

  if (!outgoingMap[fromKey]) {
    outgoingMap[fromKey] = new Set();
  }
  if (!incomingMap[toKey]) {
    incomingMap[toKey] = new Set();
  }

  outgoingMap[fromKey].add(toKey);
  incomingMap[toKey].add(fromKey);

  console.log("Outgoing Map (current):", JSON.stringify(
    Object.fromEntries(Object.entries(outgoingMap).map(([k, v]) => [k, [...v]])), 
    null, 
    2
  ));
  console.log("Incoming Map (current):", JSON.stringify(
    Object.fromEntries(Object.entries(incomingMap).map(([k, v]) => [k, [...v]])), 
    null, 
    2
  ));
});

 

 const [flowNodes, setNodes, onNodesChange] = useNodesState([]);
const [flowEdges, setEdges, onEdgesChange] = useEdgesState([]);


  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge({ ...connection, animated: true, style: { stroke: "#6366f1" } }, eds)
      );
    },
    [setEdges]
  );

const handleNodeClick = (_event: any, node: Node) => {
  console.log("DEBUG - Node clicked:", node);
  console.log("DEBUG - Node ID:", node.id);

  if (onNodeClick) {
    console.log("DEBUG - Calling onNodeClick with ID:", node.id);
    onNodeClick(node.id);
  } else {
    console.log("DEBUG - No onNodeClick handler provided.");
  }

  if (onStateClick) {
    console.log("DEBUG - Calling onStateClick with ID:", node.id);
    onStateClick(node.id);
  } else {
    console.log("DEBUG - No onStateClick handler provided.");
  }

  console.log("DEBUG - Setting selectedNodeId to:", node.id);
  setSelectedNodeId(node.id);
};


  const selectedNode = states.find((s) => s.key === selectedNodeId);
useEffect(() => {
  const flowNodes: Node[] = states.map((state, index) => {
    const others = states.filter((s) => s.key !== state.key).map((s) => s.key);
    const outgoing = transitions.filter((t) => t.fromKey === state.key).map((t) => t.toKey);
    const incoming = transitions.filter((t) => t.toKey === state.key).map((t) => t.fromKey);
    const fullyConnected =
      others.every((k) => outgoing.includes(k)) &&
      others.every((k) => incoming.includes(k));

    return {
      id: state.key,
      data: {
        label: `${state.name}${fullyConnected ? " ← All" : ""}`,
      },
      position: { x: 250 * index, y: 100 },
      style: {
        background: state.color,
        padding: 10,
        borderRadius: 8,
        border: "1px solid #ccc",
        minWidth: 120,
        textAlign: "center",
        fontWeight: "bold",
        cursor: editable ? "pointer" : "default",
      },
    };
  });

  const flowEdges: Edge[] = transitions.map((transition) => ({
    id: `e-${transition.fromKey}-${transition.toKey}`,
    source: transition.fromKey,
    target: transition.toKey,
    animated: true,
    label: `${transition.fromKey} → ${transition.toKey}`,
    style: { stroke: "#6366f1" },
  }));

  setNodes(flowNodes);
  setEdges(flowEdges);
   onUpdate?.(states, transitions); // keep parent in sync
}, [states, transitions, editable]);
//ipdated code to reflect changes in ui on update at the same time

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
      >
        <MiniMap nodeColor={() => "#6b7280"} />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>

      {editable && selectedNode && (
        <div className="absolute top-0 right-0 h-full w-80 bg-white border-l border-gray-300 shadow-md p-4 z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Node</h3>
            <button
              onClick={() => setSelectedNodeId(null)}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                className="w-full border px-3 py-1 rounded"
                defaultValue={selectedNode.name}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Color</label>
              <input
                type="color"
                className="w-full h-10"
                defaultValue={selectedNode.color}
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
