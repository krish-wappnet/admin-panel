/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  updateAddUserField,
  setAddUserPermissions,
  resetAddUserForm,
} from '../../redux/slices/formSlice';
import { addUser } from '../../redux/slices/usersSlice';
import { v4 as uuidv4 } from 'uuid';
import { addLog } from '../../redux/slices/auditLogSlice';
import { validateEmail, checkEmailUniqueness, validatePassword } from '../../utils/validation';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { addUser: form } = useAppSelector((state) => state.form);
  const { users } = useAppSelector((state) => state.users);

  const handleSubmit = () => {
    const emailErrors = validateEmail(form.email);
    const emailUniquenessErrors =
      emailErrors.length === 0 && !checkEmailUniqueness(form.email, users)
        ? ['Email already exists']
        : [];
  
    const passwordErrors = validatePassword(form.password);
  
    const permissionErrors =
      form.role === 'Custom' && form.errors.length > 0 ? ['Invalid permissions'] : [];
  
    const allErrors = [...emailErrors, ...emailUniquenessErrors, ...passwordErrors, ...permissionErrors];
  
    if (allErrors.length === 0) {
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
    } else {
      dispatch(updateAddUserField({ errors: allErrors }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-white-800 p-6 rounded shadow max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Add New User</h2>
        <div className="mb-4 relative">
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => dispatch(updateAddUserField({ name: e.target.value }))}
            className={`w-full p-2 border rounded dark:bg-white-700 dark:border-white-600 ${
              form.errors.find((err: string | string[]) => err.includes('Name')) ? 'border-red-500' : ''
            }`}
            aria-label="User name"
          />
          {form.errors.find((err: string | string[]) => err.includes('Name')) && (
            <p className="absolute text-red-500 text-sm mt-1">Name is required</p>
          )}
        </div>
        <div className="mb-4 relative">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => dispatch(updateAddUserField({ email: e.target.value }))}
            className={`w-full p-2 border rounded dark:bg-white-700 dark:border-white-600 ${
              form.errors.find((err: string | string[]) => err.includes('Email')) ? 'border-red-500' : ''
            }`}
            aria-label="User email"
          />
          {form.errors
          .filter((err: string) => err.includes('Email'))
          .map((err: string, index: number) => (
            <p key={index} className="text-red-500 text-sm">
              {err}
            </p>
          ))}
        </div>
        <div className="mb-4 relative">
          <label className="block mb-1 mt-5">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => dispatch(updateAddUserField({ password: e.target.value }))}
            className={`w-full p-2 border rounded dark:bg-white-700 dark:border-white-600 ${
              form.errors.find((err: string | string[]) => err.includes('Password')) ? 'border-red-500' : ''
            }`}
            aria-label="User password"
          />
          <div className="mt-1">
            {form.errors.filter((err: string | string[]) => err.includes('Password')).map((err: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
              <p key={index} className="text-red-500 text-sm">{err}</p>
            ))}
          </div>
        </div>
        <div className="mb-4 relative">
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
            className={`w-full p-2 border rounded dark:bg-white-700 dark:border-white-600 ${
              form.errors.find((err: string | string[]) => err.includes('Role')) ? 'border-red-500' : ''
            }`}
            aria-label="Select role"
          >
            {['Admin', 'Editor', 'Viewer', 'Custom'].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {form.errors.find((err: string | string[]) => err.includes('Role')) && (
            <p className="absolute text-red-500 text-sm mt-1">Please select a role</p>
          )}
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
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              dispatch(resetAddUserForm());
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
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
