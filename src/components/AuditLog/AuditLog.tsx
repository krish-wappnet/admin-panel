import React from 'react';
import { useAppSelector } from '../../redux/hooks';

const AuditLog: React.FC = () => {
  const { selectedUserId, users } = useAppSelector((state) => state.users);
  const auditLogs = useAppSelector((state) => state.auditLog);
  const selectedUser = users.find((u) => u.id === selectedUserId);

  if (!selectedUser) return null;

  const userLogs = auditLogs
    .filter((log) => log.userId === selectedUser.id)
    .slice(0, 10);

  return (
    <div className="mt-4 p-4 bg-white dark:bg-white-800 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Audit Log for {selectedUser.name}</h2>
      {userLogs.length === 0 ? (
        <p className="text-gray-500 dark:text-white-400">No audit logs available.</p>
      ) : (
        <ul className="space-y-2">
          {userLogs.map((log) => (
            <li key={log.id} className="text-sm">
              {log.action} at {new Date(log.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuditLog;