import React from "react";
import TemplateHero from "./components/TemplateHero";
import TemplateCategory from "./components/TemplateCategory";
const Templates = () => {
  return (
    <div className="p-4 space-y-8">
    
      <TemplateHero />

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search for template"
          className="border px-3 py-2 rounded w-64"
        />
        <select className="border px-3 py-2 rounded">
          <option>Categories</option>
        </select>
        <select className="border px-3 py-2 rounded">
          <option>Apps</option>
        </select>
        <select className="border px-3 py-2 rounded">
          <option>Triggers</option>
        </select>
      </div>

      {/* Template Categories */}
      <TemplateCategory
        title="Rovo AI Agents"
        templates={[
          "Use Rovo Agent to triage bugs in Cubicle",
          "Use Rovo Agent to assess work readiness in Cubicle",
          "Use Rovo agent to send Cubicle project summary to Slack",
          "Use Rovo agent to create Cubicle project summary page in Confluence",
        ]}
      />

      <TemplateCategory
        title="Organize tasks"
        templates={[
          "Clone work item to another project",
          "Create work item in another project",
          "When epic is ready to release → create release notes in Confluence and notify team",
          "When epic is created → create feature spec page in Confluence",
          "When a bug is created → add someone as a watcher",
          "When a task is near due → send email reminder",
          "When a bug is created → set the due date based on the priority",
          "Schedule a recurring ticket",
        ]}
      />

      <TemplateCategory
        title="Developer tools"
        templates={[
          "When a commit is made → then move work item to in progress",
          "When a component is created in Compass → Create a work item in Cubicle",
          "When a branch is created → then move work item to in progress",
          "When a pull request is merged → then move work item to done",
        ]}
      />

      <TemplateCategory
        title="Design"
        templates={[
          "When a design is linked to a work item → add a label to the work item",
          "When a design is linked to a work item → send a Microsoft Teams message",
          "When a design is linked to a work item → email the work item assignee",
        ]}
      />

      <TemplateCategory
        title="Security"
        templates={[
          "When content scanning alert generated → send email",
          "When content scanning alert generated → add comment",
          "When content scanning alert generated → change issue security level and send email",
        ]}
      />
    </div>
  );
};

export default Templates;
