import React from 'react';
import UsersList from '../components/UsersList/UsersList';
import RoleAssignment from '../components/RoleAssignment/RoleAssignment';
import AddUserModal from '../components/AddUserModal/AddUserModal';
import AuditLog from '../components/AuditLog/AuditLog';
import DarkModeToggle from '../components/DarkModeToggle/DarkModeToggle';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setAddUserModalOpen } from '../redux/slices/uiSlice';

const AdminPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { snackbar, isAddUserModalOpen } = useAppSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(setAddUserModalOpen(true))}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"
            >
              Add User
            </button>
            <DarkModeToggle />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[700px]">
          {/* Users List */}
          <div className="xl:col-span-5 bg-white p-6 rounded-xl shadow overflow-hidden">
            <UsersList />
          </div>

          {/* Right Panel: RoleAssignment + AuditLog */}
          <div className="xl:col-span-7 flex flex-col space-y-6">
            <div className="flex-1 bg-white p-6 rounded-xl shadow overflow-auto">
              <RoleAssignment />
            </div>
            <div className="flex-1 bg-white p-6 rounded-xl shadow overflow-auto">
              <AuditLog />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => dispatch(setAddUserModalOpen(false))} />

      {/* Snackbar */}
      {snackbar && (
        <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-4 z-50">
          <span>{snackbar.message}</span>
          {snackbar.undo && (
            <button
              onClick={snackbar.undo}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
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
