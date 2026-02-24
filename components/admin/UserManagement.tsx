'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'use-debounce';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  isBlocked: boolean;
  createdAt: string;
  lastLogin: string | null;
  calculationsCount: number;
  purchasesCount: number;
  oauthProviders: string[];
}

interface UserFilters {
  search: string;
  emailVerified: boolean | null;
  twoFactorEnabled: boolean | null;
  isBlocked: boolean | null;
  dateFrom: string;
  dateTo: string;
}

interface UserManagementProps {
  locale: 'ru' | 'en';
  currentUserId: string;
}

export default function UserManagement({ locale, currentUserId }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    emailVerified: null,
    twoFactorEnabled: null,
    isBlocked: null,
    dateFrom: '',
    dateTo: '',
  });

  const [debouncedSearch] = useDebounce(filters.search, 300);
  const [sortBy, setSortBy] = useState<'createdAt' | 'email'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const pageSize = 25;
  const totalPages = Math.ceil(totalUsers / pageSize);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        setError('No session found');
        return;
      }

      const params = new URLSearchParams({
        sessionId,
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        sortBy,
        sortOrder,
      });

      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filters.emailVerified !== null) params.append('emailVerified', filters.emailVerified.toString());
      if (filters.twoFactorEnabled !== null) params.append('twoFactorEnabled', filters.twoFactorEnabled.toString());
      if (filters.isBlocked !== null) params.append('isBlocked', filters.isBlocked.toString());
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Get current user ID
  const getCurrentUserId = (): string | null => {
    return currentUserId;
  };

  // Block/Unblock user
  const handleBlockToggle = async (userId: string, currentlyBlocked: boolean) => {
    const currentUserId = getCurrentUserId();
    if (userId === currentUserId) {
      showNotification('error', locale === 'ru' ? 'Вы не можете заблокировать свой собственный аккаунт' : 'You cannot block your own account');
      return;
    }

    const confirmMessage = currentlyBlocked
      ? (locale === 'ru' ? 'Разблокировать этого пользователя?' : 'Unblock this user?')
      : (locale === 'ru' ? 'Вы уверены, что хотите заблокировать этого пользователя?' : 'Are you sure you want to block this user?');

    if (!confirm(confirmMessage)) return;

    try {
      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, isBlocked: !currentlyBlocked }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      showNotification('success', currentlyBlocked 
        ? (locale === 'ru' ? 'Пользователь разблокирован' : 'User unblocked')
        : (locale === 'ru' ? 'Пользователь заблокирован' : 'User blocked')
      );
      fetchUsers();
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  // Delete user
  const handleDelete = async (userId: string, userEmail: string) => {
    const currentUserId = getCurrentUserId();
    if (userId === currentUserId) {
      showNotification('error', locale === 'ru' ? 'Вы не можете удалить свой собственный аккаунт' : 'You cannot delete your own account');
      return;
    }

    const confirmMessage = locale === 'ru' 
      ? `Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.\n\nВведите email пользователя для подтверждения: ${userEmail}`
      : `Are you sure you want to delete this user? This action cannot be undone.\n\nEnter the user's email to confirm: ${userEmail}`;

    const confirmation = prompt(confirmMessage);
    if (confirmation !== userEmail) {
      if (confirmation !== null) {
        showNotification('error', locale === 'ru' ? 'Email не совпадает' : 'Email does not match');
      }
      return;
    }

    try {
      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, confirmation }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user');
      }

      showNotification('success', locale === 'ru' ? 'Пользователь удален' : 'User deleted');
      fetchUsers();
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  // Edit user
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ email: '', name: '', isAdmin: false });

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({ email: user.email, name: user.name, isAdmin: user.isAdmin });
  };

  const handleEditSave = async () => {
    if (!editingUser) return;

    try {
      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, ...editForm }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      showNotification('success', locale === 'ru' ? 'Пользователь обновлен' : 'User updated');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      showNotification('error', err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return locale === 'ru' ? 'Никогда' : 'Never';
    const date = new Date(dateString);
    return date.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US');
  };

  // OAuth provider badges
  const renderOAuthBadges = (providers: string[]) => {
    if (providers.length === 0) return null;
    return (
      <div className="flex gap-1 flex-wrap">
        {providers.map(provider => (
          <span key={provider} className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
            {provider}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {locale === 'ru' ? 'Управление пользователями' : 'User Management'}
        </h2>
        {totalUsers > 0 && (
          <div className="text-sm text-gray-600">
            {locale === 'ru' ? 'Всего пользователей:' : 'Total users:'} {totalUsers}
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder={locale === 'ru' ? 'Поиск по email или имени' : 'Search by email or name'}
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <select
            value={filters.emailVerified === null ? '' : filters.emailVerified.toString()}
            onChange={(e) => setFilters({ ...filters, emailVerified: e.target.value === '' ? null : e.target.value === 'true' })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
          >
            <option value="">{locale === 'ru' ? 'Email (все)' : 'Email (all)'}</option>
            <option value="true">{locale === 'ru' ? 'Подтвержден' : 'Verified'}</option>
            <option value="false">{locale === 'ru' ? 'Не подтвержден' : 'Not verified'}</option>
          </select>

          <select
            value={filters.twoFactorEnabled === null ? '' : filters.twoFactorEnabled.toString()}
            onChange={(e) => setFilters({ ...filters, twoFactorEnabled: e.target.value === '' ? null : e.target.value === 'true' })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
          >
            <option value="">{locale === 'ru' ? '2FA (все)' : '2FA (all)'}</option>
            <option value="true">{locale === 'ru' ? 'Включена' : 'Enabled'}</option>
            <option value="false">{locale === 'ru' ? 'Выключена' : 'Disabled'}</option>
          </select>

          <select
            value={filters.isBlocked === null ? '' : filters.isBlocked.toString()}
            onChange={(e) => setFilters({ ...filters, isBlocked: e.target.value === '' ? null : e.target.value === 'true' })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
          >
            <option value="">{locale === 'ru' ? 'Статус (все)' : 'Status (all)'}</option>
            <option value="false">{locale === 'ru' ? 'Активен' : 'Active'}</option>
            <option value="true">{locale === 'ru' ? 'Заблокирован' : 'Blocked'}</option>
          </select>

          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            placeholder={locale === 'ru' ? 'Дата от' : 'Date from'}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
          />

          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            placeholder={locale === 'ru' ? 'Дата до' : 'Date to'}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
          />
        </div>

        {/* Sort */}
        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'email')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
          >
            <option value="createdAt">{locale === 'ru' ? 'Дата регистрации' : 'Registration date'}</option>
            <option value="email">{locale === 'ru' ? 'Email' : 'Email'}</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-900"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Users Table - Desktop */}
      {!loading && !error && (
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {locale === 'ru' ? 'Пользователь' : 'User'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {locale === 'ru' ? 'Статус' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {locale === 'ru' ? 'Активность' : 'Activity'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {locale === 'ru' ? 'Регистрация' : 'Registration'}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    {locale === 'ru' ? 'Действия' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.isAdmin && (
                          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 w-fit">
                            Admin
                          </span>
                        )}
                        {renderOAuthBadges(user.oauthProviders)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.emailVerified ? '✓' : '✗'} Email
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            user.twoFactorEnabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.twoFactorEnabled ? '✓' : '✗'} 2FA
                          </span>
                        </div>
                        {user.isBlocked && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 w-fit">
                            {locale === 'ru' ? 'Заблокирован' : 'Blocked'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div>{locale === 'ru' ? 'Расчеты:' : 'Calculations:'} {user.calculationsCount}</div>
                        <div>{locale === 'ru' ? 'Покупки:' : 'Purchases:'} {user.purchasesCount}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {locale === 'ru' ? 'Последний вход:' : 'Last login:'} {formatDate(user.lastLogin)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {locale === 'ru' ? 'Редактировать' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleBlockToggle(user.id, user.isBlocked)}
                          className={user.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}
                        >
                          {user.isBlocked 
                            ? (locale === 'ru' ? 'Разблокировать' : 'Unblock')
                            : (locale === 'ru' ? 'Заблокировать' : 'Block')
                          }
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.email)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {locale === 'ru' ? 'Удалить' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Cards - Mobile */}
      {!loading && !error && (
        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                {user.isAdmin && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Admin
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.emailVerified ? '✓' : '✗'} Email
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  user.twoFactorEnabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.twoFactorEnabled ? '✓' : '✗'} 2FA
                </span>
                {user.isBlocked && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    {locale === 'ru' ? 'Заблокирован' : 'Blocked'}
                  </span>
                )}
                {renderOAuthBadges(user.oauthProviders)}
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div>{locale === 'ru' ? 'Расчеты:' : 'Calculations:'} {user.calculationsCount}</div>
                <div>{locale === 'ru' ? 'Покупки:' : 'Purchases:'} {user.purchasesCount}</div>
                <div>{locale === 'ru' ? 'Регистрация:' : 'Registration:'} {formatDate(user.createdAt)}</div>
                <div>{locale === 'ru' ? 'Последний вход:' : 'Last login:'} {formatDate(user.lastLogin)}</div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <button
                  onClick={() => handleEditClick(user)}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  {locale === 'ru' ? 'Редактировать' : 'Edit'}
                </button>
                <button
                  onClick={() => handleBlockToggle(user.id, user.isBlocked)}
                  className={`px-3 py-1 text-sm rounded ${
                    user.isBlocked 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
                >
                  {user.isBlocked 
                    ? (locale === 'ru' ? 'Разблокировать' : 'Unblock')
                    : (locale === 'ru' ? 'Заблокировать' : 'Block')
                  }
                </button>
                <button
                  onClick={() => handleDelete(user.id, user.email)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  {locale === 'ru' ? 'Удалить' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-between items-center bg-white rounded-lg shadow-md p-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {locale === 'ru' ? 'Назад' : 'Previous'}
          </button>

          <div className="text-sm text-gray-600">
            {locale === 'ru' ? 'Страница' : 'Page'} {currentPage} {locale === 'ru' ? 'из' : 'of'} {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {locale === 'ru' ? 'Вперед' : 'Next'}
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">
              {locale === 'ru' ? 'Редактировать пользователя' : 'Edit User'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'ru' ? 'Имя' : 'Name'}
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={editForm.isAdmin}
                  onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                  {locale === 'ru' ? 'Администратор' : 'Administrator'}
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleEditSave}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {locale === 'ru' ? 'Сохранить' : 'Save'}
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {locale === 'ru' ? 'Отмена' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
