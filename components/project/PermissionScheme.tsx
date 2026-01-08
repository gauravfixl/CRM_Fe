import React from 'react';

const permissionsData = [
  {
    title: 'Administration Permissions',
    permissions: [
      {
        name: 'Administer Projects',
        description: 'Ability to administer a project in Cubicle.',
      },
      {
        name: 'Manage Issue Layouts',
        description:
          'Ability to modify issue layouts and discover and utilize new fields within an issue layout.',
      },
      {
        name: 'Edit Workflows',
        description: 'Ability to edit workflows.',
      },
    ],
  },
  {
    title: 'Project Permissions',
    permissions: [
      {
        name: 'Browse Projects',
        description:
          'Ability to browse projects and the issues within them.',
      },
      {
        name: 'Manage sprints',
        description: 'Ability to manage sprints.',
      },
      {
        name: 'Service Project Agent',
        description:
          'Allows users to interact with customers and access Cubicle Service Management features of a project.',
      },
      {
        name: 'View aggregated data',
        description:
          'Users with this permission will have access to view combined and summarized project data, regardless of their individual permissions.',
      },
      {
        name: 'View Development Tools',
        description:
          'Allows users in a software project to view development-related information on the issue, such as commits, reviews and build information.',
      },
      {
        name: 'View Read-Only Workflow',
        description:
          'Users with this permission may view a read-only version of a workflow.',
      },
    ],
  },
];

const roles = [
  'Project Role (atlassian-addons-project-access)',
  'Application access (Any logged in user)',
];

const PermissionScheme: React.FC = () => {
  return (
    <div className="p-6 bg-white max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">
        MP software permission scheme
      </h1>
      <p className="text-sm text-gray-700 mb-2">
        Project permissions define who can access a project and what they can do (create and comment on issues, for example). To set security levels for individual issues,{' '}
        <a href="#" className="text-blue-600 underline">
          upgrade your plan
        </a>
        .
      </p>
      <p className="text-sm text-gray-600 mb-4">
        For projects created in a free plan, any logged-in user is an admin. If you changed to a free plan, permissions are locked and not editable.{' '}
        <a href="#" className="text-blue-600 underline">Learn more</a>
      </p>
      <p className="text-sm font-semibold mb-6">
        Note: Permission schemes may be used by multiple projects. Modifying a scheme will affect any project its associated with.
      </p>

      {permissionsData.map((section, idx) => (
        <div key={idx} className="mb-8">
          <h2 className="text-lg font-bold mb-2">{section.title}</h2>
          <table className="w-full border-t border-gray-300">
            <thead>
              <tr>
                <th className="text-left py-2">Permission</th>
                <th className="text-left py-2">Users / Groups / Project Roles</th>
              </tr>
            </thead>
            <tbody>
              {section.permissions.map((perm, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-4 pr-6">
                    <div className="font-semibold">{perm.name}</div>
                    <div className="text-sm text-gray-600">
                      {perm.description}
                    </div>
                  </td>
                  <td className="py-4">
                    <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                      {roles.map((role, j) => (
                        <li key={j}>{role}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default PermissionScheme;
