import { useState } from 'react';
// import TabRules from '@/components/automation/TabRules';
// import TabAuditLog from '@/components/automation/TabAuditLog';
// import TabTemplates from '@/components/automation/TabTemplates';
// import TabUsage from '@/components/automation/TabUsage';
import TabRules from './components/TabRules';
import TabAuditLog from './components/TabAuditLog';
// import TabTemplates from './components/TabTemplates';
import TabUsage from './components/TabUsage';
import Templates from './components/Templates/Templates';
const tabs = ['Rules', 'Audit log', 'Templates', 'Usage'];

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState('Rules');

  const renderTabComponent = () => {
    switch (activeTab) {
      case 'Audit log':
        return <TabAuditLog />;
      case 'Templates':
        return <Templates />;
      case 'Usage':
        return <TabUsage />;
      case 'Rules':
      default:
        return <TabRules />;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Automation</h2>
      
      <div className="flex space-x-4 border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 border-b-2 ${
              activeTab === tab ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderTabComponent()}
    </div>
  );
}
