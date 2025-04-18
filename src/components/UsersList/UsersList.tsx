import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUser } from '../../redux/slices/usersSlice';
import { Input } from '../common/Input';
import { User } from '../../types';

const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, selectedUserId } = useAppSelector((state) => state.users);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof User>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const usersPerPage = 10;

  // Log to debug re-rendering
  useEffect(() => {
    console.log('UsersList re-rendered with users:', users);
  }, [users]);

  const filteredUsers = React.useMemo(() => {
    return users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        return sortOrder === 'asc'
        ? (aValue as string).localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue as string);
      });
  }, [users, search, sortBy, sortOrder]);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  const handleSort = (key: keyof User) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleUserClick = (userId: string) => {
    dispatch(selectUser(userId));
  };

  return (
    <div className="h-full p-4 bg-white dark:bg-white-900 shadow rounded-xl overflow-auto">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <Input
        type="text"
        label="Search users"
        value={search}
        onChange={setSearch}
        aria-label="Search users"
      />
      <table className="min-w-full table-fixed border-collapse">
        <thead>
          <tr>
            {(['name', 'email', 'role'] as const).map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="p-2 text-left cursor-pointer hover:bg-white dark:hover:bg-gray-200"
                aria-sort={
                  sortBy === key
                    ? sortOrder === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'
                }
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}{' '}
                {sortBy === key ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-white-700 ${
                selectedUserId === user.id ? 'bg-white-200 dark:bg-white-600' : ''
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleUserClick(user.id)}
            >
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredUsers.length === 0 && (
        <p className="mt-4 text-white-500 dark:text-white-400">No users found.</p>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-white-400 hover:bg-blue-600 transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="self-center">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page * usersPerPage >= filteredUsers.length}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-white-400 hover:bg-blue-600 transition-colors"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;