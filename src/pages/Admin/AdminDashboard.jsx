
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Users, Shield, AlertTriangle, BarChart, Bell, Star } from 'lucide-react';
import { getDJList, getVenues, getEvents, getBookings, getReviews, updateProfile, addReview } from '@/services/api';
import Modal from '@/components/ui/Modal';
import AdminUserManagementTab from './AdminUserManagementTab';

const roleOptions = ['DJ', 'PubOwner', 'Admin', 'Customer', 'EventManagement'];
const REVIEWS_PER_PAGE = 4;

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userRoleFilter, setUserRoleFilter] = useState('All Roles');
  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'users') getDJList().then(res => setUsers(res.data || []));
    if (activeTab === 'overview' || activeTab === 'venues') getVenues().then(res => setVenues(res.data || []));
    if (activeTab === 'overview' || activeTab === 'events') getEvents().then(res => setEvents(res.data || []));
    if (activeTab === 'overview' || activeTab === 'bookings') getBookings(1).then(res => setBookings(res || []));
    if (activeTab === 'overview' || activeTab === 'moderation') getReviews(1).then(res => setReviews(res || []));
  }, [activeTab]);

  // Edit Role Modal
  const handleEditRole = (user) => {
    setEditUser(user);
    setEditRole(user.role || 'DJ');
  };
  const handleSaveRole = async () => {
    setEditLoading(true);
    await updateProfile(editUser.id, { ...editUser, role: editRole });
    setEditLoading(false);
    setEditUser(null);
    // Refresh users
    getDJList().then(res => setUsers(res.data || []));
  };

  // Edit/Flag Review Modal
  const handleEditReview = (review) => {
    setEditReview(review);
    setReviewText(review.comment);
  };
  const handleSaveReview = async () => {
    setReviewLoading(true);
    await addReview(1, { ...editReview, comment: reviewText });
    setReviewLoading(false);
    setEditReview(null);
    // Refresh reviews
    getReviews(1).then(res => setReviews(res || []));
  };

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'moderation', label: 'Content Moderation', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const paginatedReviews = reviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE);
  const totalReviewPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));

  const renderEditRoleModal = () => (
    <Modal
      open={!!editUser}
      onClose={() => setEditUser(null)}
      title={`Edit Role for ${editUser?.name}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="font-medium">Select Role</div>
        <select
          className="w-full border rounded px-3 py-2"
          value={editRole}
          onChange={e => setEditRole(e.target.value)}
        >
          {roleOptions.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
          <Button onClick={handleSaveRole} disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>
    </Modal>
  );

  const renderEditReviewModal = () => (
    <Modal
      open={!!editReview}
      onClose={() => setEditReview(null)}
      title={`Flag/Edit Review`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <div className="font-medium">Edit or flag this review:</div>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setEditReview(null)}>Cancel</Button>
          <Button onClick={handleSaveReview} disabled={reviewLoading}>{reviewLoading ? 'Saving...' : 'Save'}</Button>
        </div>
      </div>
    </Modal>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUserManagementTab />;
      case 'moderation':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Content Moderation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map(r => (
                <div key={r.id} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                  <div className="font-semibold text-base mb-1">{r.comment}</div>
                  <div className="text-muted-foreground text-xs mb-2">By {r.customerName} on {r.date}</div>
                  <div className="flex-1" />
                  <Button size="sm" className="w-full" onClick={() => handleEditReview(r)}>Flag / Edit</Button>
                </div>
              ))}
            </div>
            {renderEditReviewModal()}
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Total DJs</span><Users className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{users.length}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Total Venues</span><Shield className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{venues.length}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Total Events</span><BarChart className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{events.length}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Total Bookings</span><AlertTriangle className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{bookings.length}</div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            <Button className="mb-2">Send Broadcast</Button>
            <div className="text-muted-foreground">(Email templates and broadcast features can be managed here.)</div>
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Total DJs</span><Users className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{users.length}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Total Venues</span><Shield className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{venues.length}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Total Events</span><BarChart className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{events.length}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Total Bookings</span><AlertTriangle className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{bookings.length}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <div className="font-semibold text-lg mb-4">Recent Reviews</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginatedReviews.map(r => (
                    <div key={r.id} className="bg-white border border-border rounded-xl p-5 flex flex-col gap-3 shadow-md relative">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold border text-primary">
                          {r.customerName ? r.customerName[0] : <Star className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-semibold">{r.customerName}</div>
                          <div className="text-xs text-muted-foreground">{r.date}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          {[...Array(r.rating || 0)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">{r.comment}</div>
                      <div className="flex-1" />
                      <Button size="sm" className="w-full" onClick={() => handleEditReview(r)}>Flag / Edit</Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button size="sm" variant="outline" disabled={reviewPage === 1} onClick={() => setReviewPage(p => Math.max(1, p - 1))}>Prev</Button>
                  <span className="text-sm">Page {reviewPage} of {totalReviewPages}</span>
                  <Button size="sm" variant="outline" disabled={reviewPage === totalReviewPages} onClick={() => setReviewPage(p => Math.min(totalReviewPages, p + 1))}>Next</Button>
                </div>
                {renderEditReviewModal()}
              </div>
              <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                <div className="font-semibold text-lg mb-4">Quick Actions</div>
                <Button className="w-full mb-2">Manage Users</Button>
                <Button className="w-full mb-2" variant="outline">Review Reports</Button>
                <Button className="w-full mb-2" variant="outline">View Analytics</Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-xl font-bold text-foreground">Admin Dashboard</h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  {sidebarOpen && <span className="ml-2">{item.label}</span>}
                </Button>
              ))}
            </div>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
