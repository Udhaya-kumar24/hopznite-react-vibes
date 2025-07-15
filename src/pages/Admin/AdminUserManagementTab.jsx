import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { getDJList, updateProfile } from '@/services/api';

const roleOptions = ['All', 'DJ', 'PubOwner', 'Admin', 'Customer', 'EventManagement'];
const PAGE_SIZE = 6;

const AdminUserManagementTab = () => {
  const [activeRole, setActiveRole] = useState('All');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [roleChangeLoading, setRoleChangeLoading] = useState({});

  // Simulate API fetch with role and pagination
  const fetchUsers = async (role, pageNum) => {
    setLoading(true);
    const res = await getDJList();
    let filtered = res.data || [];
    if (role && role !== 'All') filtered = filtered.filter(u => u.role === role);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
    setUsers(filtered.slice((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE));
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(activeRole, page);
  }, [activeRole, page]);

  const handleRoleChange = async (user, newRole) => {
    setRoleChangeLoading(l => ({ ...l, [user.id]: true }));
    await updateProfile(user.id, { ...user, role: newRole });
    setRoleChangeLoading(l => ({ ...l, [user.id]: false }));
    fetchUsers(activeRole, page);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <div className="flex gap-2 mb-6 border-b pb-2">
        {roleOptions.map(role => (
          <Button
            key={role}
            variant={activeRole === role ? 'default' : 'ghost'}
            className="rounded-b-none"
            onClick={() => { setActiveRole(role); setPage(1); }}
          >
            {role}
          </Button>
        ))}
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading users...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {users.map(user => (
              <div key={user.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 shadow-md relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl font-bold border">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email || user.genre}</div>
                  </div>
                  <span className="ml-auto px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">{user.role || 'DJ'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium">Change Role:</label>
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={user.role || 'DJ'}
                    disabled={roleChangeLoading[user.id]}
                    onChange={e => handleRoleChange(user, e.target.value)}
                  >
                    {roleOptions.filter(r => r !== 'All').map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {roleChangeLoading[user.id] && <span className="text-xs ml-2 text-muted-foreground">Saving...</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUserManagementTab; 