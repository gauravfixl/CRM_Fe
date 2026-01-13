// pages/features.tsx
import React, { useState } from 'react';
import FeatureCard from './components/FeatureCard';
import { HiOutlineChartBar, HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineShieldCheck, HiOutlineDocumentText } from 'react-icons/hi';

const Features = () => {
  const [features, setFeatures] = useState([
    {
      id: 'summary',
      title: 'Summary',
      description: "Get a snapshot of your project's progress, priorities, team workload, and more.",
      learnMoreLink: '#',
      icon: <HiOutlineChartBar size={40} />,
      enabled: true,
      category: 'Planning',
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'Create and manage your epics on a timeline.',
      learnMoreLink: '#',
      icon: <HiOutlineClipboardList size={40} />,
      enabled: false,
      category: 'Planning',
    },
    {
      id: 'code',
      title: 'Code',
      description: 'Connect GitHub, Bitbucket, and more to Cubicle.',
      learnMoreLink: '#',
      icon: <HiOutlineCheckCircle size={40} />,
      enabled: true,
      configurable: true,
      category: 'Development',
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Connect tools to triage and track vulnerabilities.',
      learnMoreLink: '#',
      icon: <HiOutlineShieldCheck size={40} />,
      enabled: false,
      category: 'Development',
    },
    {
      id: 'pages',
      title: 'Pages',
      description: 'Create and share docs in one place.',
      learnMoreLink: '#',
      icon: <HiOutlineDocumentText size={40} />,
      enabled: true,
      configurable: true,
      category: 'More items',
    },
  ]);

  const grouped = features.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, typeof features>);

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Features</h1>
      {Object.entries(grouped).map(([category, group]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <div className="flex flex-col gap-4">
            {group.map((feature) => (
              <FeatureCard
                key={feature.id}
                {...feature}
                onToggle={() => toggleFeature(feature.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;
