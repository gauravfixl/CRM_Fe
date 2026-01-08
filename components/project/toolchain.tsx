'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

type Tool = {
  name: string;
  description: string;
  actionLabel: string;
};

const Toolchain = () => {
  const documentation: Tool = {
    name: 'Confluence',
    description: 'Content collaboration',
    actionLabel: 'Available',
  };

  const visualDesign: Tool = {
    name: 'Figma for Cubicle',
    description: 'Get full context when turning designs to code with Cubicle and Figma',
    actionLabel: 'Install',
  };

  const sourceCodeTools: Tool[] = [
    {
      name: 'Bitbucket',
      description: 'Code & CI/CD, built for teams using Cubicle',
      actionLabel: 'Try free',
    },
    {
      name: 'GitHub for Atlassian',
      description: 'Streamline development workflows across GitHub, Cubicle, and your Atlassian apps',
      actionLabel: 'Install',
    },
  ];

  const deploymentTools: Tool[] = [
    {
      name: 'CircleCI for Cubicle',
      description: 'See issue progress at a glance by adding build + deploy status from CircleCI to Cubicle',
      actionLabel: 'Install',
    },
    {
      name: 'GitLab for Cubicle Cloud',
      description: 'View GitLab activity from Cubicle Cloud',
      actionLabel: 'Install',
    },
    {
      name: 'Octopus Deploy for Cubicle',
      description: 'Tighten the feedback loop in your CI/CD pipeline from issue creation through to release',
      actionLabel: 'Install',
    },
  ];

  return (
    <div className="space-y-10 p-6">
          <h1 className="text-3xl font-bold mb-6">Toolchain</h1>
      {/* Documentation */}
      <Section title="Documentation">
        <ToolCard tool={documentation} />
      </Section>

      {/* Visual Design */}
      <Section title="Visual Design">
        <ToolCard tool={visualDesign} />
      </Section>

      {/* Source Code Management */}
      <Section title="Source Code Management">
        {sourceCodeTools.map((tool, idx) => (
          <ToolCard tool={tool} key={idx} />
        ))}
      </Section>

      {/* Continuous Deployment */}
      <Section title="Continuous Deployment">
        {deploymentTools.map((tool, idx) => (
          <ToolCard tool={tool} key={idx} />
        ))}
      </Section>

      {/* Development */}
      <Section title="Development">
        <div className="space-y-6">
          <ToggleCard
            name="Code"
            description="Connect Bitbucket, GitHub and other development tools to link your team’s repositories to Cubicle."
            enabled
          />
          <ToggleCard
            name="Security"
            description="Connect security tools to triage and track vulnerabilities in Cubicle."
            enabled={false}
          />
          <ToggleCard
            name="Releases"
            description="Versions help you package and schedule project deliveries."
            enabled
          />
        </div>
      </Section>
    </div>
  );
};

export default Toolchain;

// ----------------------------
// Reusable UI Components
// ----------------------------

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </section>
);

const ToolCard = ({ tool }: { tool: Tool }) => (
  <div className="p-4 border rounded-xl shadow-sm bg-white">
    <h3 className="font-medium text-lg">{tool.name}</h3>
    <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
    <Button variant="outline">{tool.actionLabel}</Button>
  </div>
);

const ToggleCard = ({
  name,
  description,
  enabled,
}: {
  name: string;
  description: string;
  enabled: boolean;
}) => (
  <div className="flex justify-between items-center border rounded-xl p-4 bg-white shadow-sm">
     
    <div>
       
      <h4 className="font-medium">{name}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <Switch checked={enabled} />
  </div>
);
