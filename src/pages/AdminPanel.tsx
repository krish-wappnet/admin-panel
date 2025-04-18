import React, { useState } from 'react';
import UsersList from '../components/UsersList/UsersList';
import RoleAssignment from '../components/RoleAssignment/RoleAssignment';
import AddUserModal from '../components/AddUserModal/AddUserModal';
import AuditLog from '../components/AuditLog/AuditLog';
import DarkModeToggle from '../components/DarkModeToggle/DarkModeToggle';
import { useAppSelector } from '../redux/hooks';

const AdminPanel: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { snackbar } = useAppSelector((state) => state.ui);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">RBAC Admin Panel</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            aria-label="Add new user"
          >
            Add User
          </button>
          <DarkModeToggle />
        </div>
      </div>
      <div className="flex space-x-4">
        <UsersList />
        <div className="w-2/3">
          <RoleAssignment />
          <AuditLog />
        </div>
      </div>
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {snackbar && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded shadow flex items-center space-x-4">
          <span>{snackbar.message}</span>
          {snackbar.undo && (
            <button
              onClick={snackbar.undo}
              className="px-2 py-1 bg-red-500 text-white rounded"
              aria-label="Undo action"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;