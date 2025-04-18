import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  updateRoleAssignmentField,
  setRoleAssignmentPermissions,
} from '../../redux/slices/formSlice';
import { updateUser } from '../../redux/slices/usersSlice';
import { showSnackbar, hideSnackbar } from '../../redux/slices/uiSlice';
import { addLog } from '../../redux/slices/auditLogSlice';
import { exportJson } from '../../utils/exportJson';
import { v4 as uuidv4 } from 'uuid';

const RoleAssignment: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roleAssignment: form } = useAppSelector((state) => state.form);
  const { selectedUserId, users } = useAppSelector((state) => state.users);
  const selectedUser = users.find((u) => u.id === selectedUserId);

  useEffect(() => {
    if (selectedUser) {
      dispatch(
        updateRoleAssignmentField({
          role: selectedUser.role,
          permissions: selectedUser.permissions || {
            Dashboard: { Read: false, Write: false, Delete: false, Share: false },
            Reports: { Read: false, Write: false, Delete: false, Share: false },
            Settings: { Read: false, Write: false, Delete: false, Share: false },
          },
        })
      );
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    if (form.role === 'Admin') {
      dispatch(
        updateRoleAssignmentField({
          permissions: {
            Dashboard: { Read: true, Write: true, Delete: true, Share: true },
            Reports: { Read: true, Write: true, Delete: true, Share: true },
            Settings: { Read: true, Write: true, Delete: true, Share: true },
          },
          errors: [],
        })
      );
    } else if (form.role === 'Viewer') {
      dispatch(
        updateRoleAssignmentField({
          permissions: {
            Dashboard: { Read: true, Write: false, Delete: false, Share: false },
            Reports: { Read: true, Write: false, Delete: false, Share: false },
            Settings: { Read: true, Write: false, Delete: false, Share: false },
          },
          errors: [],
        })
      );
    }
  }, [form.role, dispatch]);

  const handleSave = async () => {
    // Guard against undefined selectedUser or form.role
    if (!selectedUser || !form.role) {
      dispatch(showSnackbar({ message: 'No user selected or invalid role' }));
      return;
    }

    if (form.role === 'Custom' && form.errors.length > 0) {
      dispatch(showSnackbar({ message: 'Invalid permissions' }));
      return;
    }

    const previousUser = { ...selectedUser };
    dispatch(
      updateUser({
        id: selectedUser.id,
        role: form.role,
        permissions: form.permissions,
      })
    );
    dispatch(
      addLog({
        id: uuidv4(),
        userId: selectedUser.id,
        action: `Updated role to ${form.role}`,
        timestamp: new Date().toISOString(),
      })
    );

    try {
      await new Promise((resolve, reject) =>
        setTimeout(() => (Math.random() > 0.2 ? resolve(null) : reject('API failure')), 1000)
      );
      dispatch(
        showSnackbar({
          message: 'Saved successfully!',
          undo: () => {
            dispatch(
              updateUser({
                id: previousUser.id,
                role: previousUser.role,
                permissions: previousUser.permissions,
              })
            );
            dispatch(hideSnackbar());
          },
        })
      );
      setTimeout(() => dispatch(hideSnackbar()), 5000);
    } catch {
      dispatch(
        updateUser({
          id: previousUser.id,
          role: previousUser.role,
          permissions: previousUser.permissions,
        })
      );
      dispatch(showSnackbar({ message: 'Save failed!' }));
      setTimeout(() => dispatch(hideSnackbar()), 3000);
    }
  };

  const handleExport = () => {
    exportJson(form.permissions, 'role_matrix.json');
  };

  if (!selectedUser) return <div className="p-4">Select a user</div>;

  return (
    <div className="w-2/3 p-4 bg-white dark:bg-white-800 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Role & Permissions</h2>
      <div className="mb-4">
        <label className="block mb-2">Role</label>
        <select
          value={form.role || ''}
          onChange={(e) =>
            dispatch(
              updateRoleAssignmentField({
                role: e.target.value as 'Admin' | 'Editor' | 'Viewer' | 'Custom',
              })
            )
          }
          className="p-2 border rounded dark:bg-white-700 dark:border-white-600"
          aria-label="Select role"
        >
          <option value="" disabled>
            Select a role
          </option>
          {['Admin', 'Editor', 'Viewer', 'Custom'].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      {form.role === 'Custom' && (
        <div>
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
                            setRoleAssignmentPermissions({
                              module,
                              permission: perm,
                              value: !form.permissions[module][perm],
                            })
                          )
                        }
                        disabled={form.role !== 'Custom'}
                        aria-label={`${perm} permission for ${module}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {form.errors.length > 0 && (
            <div className="mt-2 text-red-500">
              {form.errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          aria-label="Save changes"
        >
          Save
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          aria-label="Export role matrix"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
};

export default RoleAssignment;