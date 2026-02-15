pm flow


Step-by-Step Flow (Clean & Linear)
1️⃣User logs in
● User belongs to an Organization
● Organization context is set
2️⃣User creates a Workspace
● Workspace is created inside the Organization
● Example:
○ “Engineering”
○ “Marketing”
○ “Client Projects”
👉 Workspace = grouping layer
👉 No tasks, no boards yet
3️⃣User selects a Project Template
● Template defines:
○ Board type (Kanban / Scrum)
○ Default columns
○ Workflow states & transitions
○ Optional automation rules
● Can be:
○ System template (global)
○ Org-specific template
👉 Template is read-only blueprint
4️⃣User creates a Project (inside Workspace)
● Project is created using:
○ workspaceId
○ templateId
● Backend automatically:
○ Creates Board
○ Creates Workflow
○ Seeds Columns
○ Links everything together
👉 This is where real work starts
5️⃣Project becomes operational
● Project now contains:
○ Board(s)
○ Workflow
○ Tasks
○ Members
○ Comments
○ Documents
● Permissions apply at:
○ Org → Workspace → Project → Task
🧩 Visual Flow Diagram
5
Tab 2
Organization
│
└── Workspace
│
└── Project ← created from Template
│
├── Board
│ └── Columns
│
├── Workflow
│ └── States & Transitions
│
├── Tasks
│ ├── Comments
│ └── Documents
│
└── Project Members