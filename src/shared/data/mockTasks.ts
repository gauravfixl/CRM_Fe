// data/tasks.ts
export const triggerOptions = [
  "Before offer release",
  "After offer release",
  "After offer acceptance",
  "Before joining",
  "Joining day",
  "After joining",
];

export const taskTypeOptions = [
  "Default",
  "ID Collection",
  "Document Collection",
];

export const initialTasks = [
  {
    id: 1,
    name: "Joining Task",
    owner: "Global Admin",
    when: "Before offer release",
    appliesTo: ["Human Resource", "Finance and Accounting", "Product"],
  },
];
