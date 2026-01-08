import React from 'react';

const notificationEmail = 'Cubicle@poojafixl.atlassian.net';

const notifications = [
  'A work item is created',
  'A work item is edited',
  "You're assigned to a work item",
  'A work item is resolved',
  'A work item is closed',
  'Someone made a comment',
  'A comment is edited',
  'A comment is deleted',
  'A work item is reopened',
  'A work item is deleted',
  'A work item is moved',
];

const recipients = ['All Watchers', 'Current Assignee', 'Reporter'];

const NotificationSettings: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto bg-white">
      <h1 className="text-2xl font-semibold mb-2">Internal notifications</h1>

      <div className="mb-4">
        <h2 className="text-md font-medium">Notification email</h2>
        <p className="text-sm text-gray-700">
          {notificationEmail}{' '}
          <a href="#" className="text-blue-600 underline ml-2">
            Edit
          </a>
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-md font-medium">Scheme</h2>
        <div className="text-sm font-semibold text-gray-800">
          Default Notification Scheme
          <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
            SHARED BY 2 PROJECTS
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Cubicle can notify the appropriate people of particular events in your project, e.g. "Issue Commented". You can choose specific people, groups, or roles to receive notifications.
        </p>
        <p className="text-sm text-gray-600 mt-1">
          The notification scheme defines how the notifications are configured for this project. To change the notifications, you can select a different notification scheme, or modify the currently selected scheme.
        </p>
      </div>

      <table className="w-full mt-6 border-t border-gray-300 text-sm">
        <thead>
          <tr className="text-left">
            <th className="py-2 font-medium">Notification Type</th>
            <th className="py-2 font-medium">Recipients</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((type, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="py-4 pr-6">{type}</td>
              <td className="py-4">
                <ul className="list-disc ml-5 space-y-1 text-gray-700">
                  {recipients.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationSettings;
