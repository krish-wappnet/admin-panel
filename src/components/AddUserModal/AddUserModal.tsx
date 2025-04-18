/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  updateAddUserField,
  setAddUserPermissions,
  validateAddUserForm,
  resetAddUserForm,
} from '../../redux/slices/formSlice';
import { addUser } from '../../redux/slices/usersSlice';
import { v4 as uuidv4 } from 'uuid';
import { addLog } from '../../redux/slices/auditLogSlice';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { addUser: form } = useAppSelector((state) => state.form);
  const { users } = useAppSelector((state) => state.users);

  const handleSubmit = () => {
    dispatch(validateAddUserForm(users));
    if (form.errors.length === 0) {
      const newUser = {
        id: uuidv4(),
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        permissions: form.role === 'Custom' ? form.permissions : undefined,
      };
      dispatch(addUser(newUser));
      dispatch(
        addLog({
          id: uuidv4(),
          userId: newUser.id,
          action: `Created user with role ${form.role}`,
          timestamp: new Date().toISOString(),
        })
      );
      dispatch(resetAddUserForm());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => dispatch(updateAddUserField({ name: e.target.value }))}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            aria-label="User name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => dispatch(updateAddUserField({ email: e.target.value }))}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            aria-label="User email"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => dispatch(updateAddUserField({ password: e.target.value }))}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            aria-label="User password"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Role</label>
          <select
            value={form.role}
            onChange={(e) =>
              dispatch(
                updateAddUserField({
                  role: e.target.value as 'Admin' | 'Editor' | 'Viewer' | 'Custom',
                })
              )
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            aria-label="Select role"
          >
            {['Admin', 'Editor', 'Viewer', 'Custom'].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        {form.role === 'Custom' && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Permissions</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-2">Module</th>
                  {(['Read', 'Write', 'Delete', 'Share'] as const).map((perm) => (
                    <th key={perm} className="p-2">
                      {perm}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(['Dashboard', 'Reports', 'Settings'] as const).map((module) => (
                  <tr key={module}>
                    <td className="p-2">{module}</td>
                    {(['Read', 'Write', 'Delete', 'Share'] as const).map((perm) => (
                      <td key={perm} className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={form.permissions[module][perm]}
                          onChange={() =>
                            dispatch(
                              setAddUserPermissions({
                                module,
                                permission: perm,
                                value: !form.permissions[module][perm],
                              })
                            )
                          }
                          aria-label={`${perm} permission for ${module}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {form.errors.length > 0 && (
          <div className="mb-4 text-red-500">
            {form.errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              dispatch(resetAddUserForm());
              onClose();
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            aria-label="Add user"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;