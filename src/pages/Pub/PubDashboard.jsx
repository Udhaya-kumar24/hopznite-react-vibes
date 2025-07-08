import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Home, Calendar as CalendarIcon, Music, Users, TrendingUp, Bell, Star, BookOpen } from 'lucide-react';
import PubProfileTab from '@/components/pub-dashboard/PubProfileTab';
import EventCalendarTab from '@/components/pub-dashboard/EventCalendarTab';
import DJDiscoveryTab from '@/components/pub-dashboard/DJDiscoveryTab';
import TopDJsTab from '@/components/pub-dashboard/TopDJsTab';
import BookingManagementTab from '@/components/pub-dashboard/BookingManagementTab';
import NotificationsTab from '@/components/pub-dashboard/NotificationsTab';
import MyEventsTab from '@/components/pub-dashboard/MyEventsTab';
import { getEvents, getBookings, getDJList, updatePubProfile, createEvent } from '@/services/api';
import DJs from '../DJs';
import { toast } from 'sonner';
import PubDJsTab from '@/components/pub-dashboard/PubDJsTab';
import EventCreateModal from '@/components/pub-dashboard/EventCreateModal';

const PubDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Placeholder state for each tab
  const [profile, setProfile] = useState({});
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({});
  const [filters, setFilters] = useState({});
  const [djs, setDjs] = useState([]);
  const [topDjs, setTopDjs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('pending');
  const [eventsTabData, setEventsTabData] = useState([]);

  // Overview tab state
  const [overviewStats, setOverviewStats] = useState({
    totalBookings: 0,
    totalEvents: 0,
    activeDJs: 0,
    revenue: 0,
    capacity: 0,
    recentBookings: [],
    availableDJs: [],
  });

  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    // Fetch overview data
    const fetchOverview = async () => {
      const [eventsRes, bookingsRes, djsRes] = await Promise.all([
        getEvents(),
        getBookings(1), // 1 is dummy pub owner/user id
        getDJList(),
      ]);
      // Calculate stats
      const totalEvents = eventsRes.success ? eventsRes.data.length : 0;
      const totalBookings = bookingsRes.length;
      const activeDJs = djsRes.success ? djsRes.data.filter(dj => dj.available).length : 0;
      const availableDJs = djsRes.success ? djsRes.data.filter(dj => dj.available) : [];
      // Dummy revenue and capacity
      const revenue = bookingsRes.reduce((sum, b) => sum + (b.amount || 0), 0);
      const capacity = 250;
      // Recent bookings (show last 3)
      const recentBookings = bookingsRes.slice(0, 3);
      setOverviewStats({
        totalBookings,
        totalEvents,
        activeDJs,
        revenue,
        capacity,
        recentBookings,
        availableDJs,
      });
    };
    if (activeTab === 'overview') fetchOverview();

    // Fetch events for MyEventsTab
    const fetchEventsTab = async () => {
      const [eventsRes, bookingsRes] = await Promise.all([
        getEvents(),
        getBookings(1),
      ]);
      // Map events/bookings to UI format
      const events = eventsRes.success ? eventsRes.data.map((e, i) => ({
        title: e.title,
        status: i % 2 === 0 ? 'completed' : (i % 3 === 0 ? 'pending' : 'confirmed'),
        price: e.price,
        date: e.date,
        time: e.time,
        duration: '3h',
        venue: e.venue,
        dj: {
          name: e.dj,
          genre: e.genre,
          rating: 4.8,
          reviews: 120,
        },
        paymentStatus: i % 2 === 0 ? 'complete' : (i % 3 === 0 ? 'pending' : 'due'),
        paymentLabel: i % 2 === 0 ? 'Payment Complete' : (i % 3 === 0 ? 'Payment Pending' : 'Payment Due'),
      })) : [];
      setEventsTabData(events);
    };
    if (activeTab === 'bookings') fetchEventsTab();
  }, [activeTab]);

  // Handlers (to be implemented)
  const handleSaveProfile = async () => {
    setUploading(true);
    try {
      const res = await updatePubProfile(1, profile);
      if (res.success) {
        setProfile(res.data);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (e) {
      toast.error('Error updating profile');
    } finally {
      setUploading(false);
    }
  };
  const handleMediaChange = () => {};
  const handleCreateEvent = async (form) => {
    const res = await createEvent(form);
    if (res.success) {
      setEventsTabData(prev => [res.data, ...prev]);
    }
  };
  const handleBookDJ = () => {};
  const handleRebook = () => {};
  const handleBookingStatusChange = (status) => setBookingStatus(status);
  const handleRateDJ = () => {};
  const handleEventDetails = () => {};
  const handleEventMessage = () => {};

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'djs', label: 'Browse DJs', icon: Music },
    { id: 'bookings', label: 'My Events', icon: BookOpen },
    { id: 'profile', label: 'Profile Setup', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <PubProfileTab profile={profile} setProfile={setProfile} onSave={handleSaveProfile} uploading={uploading} mediaPreviews={mediaPreviews} onMediaChange={handleMediaChange} />;
      case 'calendar':
        return <EventCalendarTab events={events} onCreateEvent={handleCreateEvent} newEvent={newEvent} setNewEvent={setNewEvent} />;
      case 'djs':
        return <PubDJsTab />
      case 'topdjs':
        return <TopDJsTab topDjs={topDjs} onBook={handleBookDJ} />;
      case 'bookings':
        return <>
          <MyEventsTab events={eventsTabData} onRate={handleRateDJ} onDetails={handleEventDetails} onMessage={handleEventMessage} onCreateEvent={() => setShowCreateEvent(true)} />
          <EventCreateModal open={showCreateEvent} onClose={() => setShowCreateEvent(false)} onCreate={handleCreateEvent} />
        </>;
      case 'notifications':
        return <NotificationsTab notifications={notifications} />;
      case 'overview':
      default:
  return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Total Bookings</span><Music className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{overviewStats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Active DJs</span><Users className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{overviewStats.activeDJs}</div>
                <p className="text-xs text-muted-foreground">Available this week</p>
              </div>
      </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-lg">Recent bookings</div>
                  <Button size="sm" variant="outline">View All</Button>
      </div>
            <div className="space-y-4">
                  {overviewStats.recentBookings.map((b, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2">
                <div>
                        <div className="font-medium">{b.djName}</div>
                        <div className="text-xs text-muted-foreground">{b.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === 'confirmed' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>{b.status}</span>
                        <span className="font-semibold">${b.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="font-semibold text-lg mb-4">Quick Actions</div>
                <Button className="w-full mb-4 bg-black text-white"><Music className="mr-2 h-4 w-4" />Browse DJs</Button>
                <div className="font-semibold text-md mb-2">Available DJs</div>
                <div className="space-y-2">
                  {overviewStats.availableDJs.map((dj, i) => (
                    <div key={dj.id} className="flex items-center justify-between border rounded px-2 py-2">
                <div>
                        <div className="font-medium">{dj.name}</div>
                        <div className="text-xs text-muted-foreground">{dj.genres?.join(', ')}</div>
                      </div>
                      <span className={`w-3 h-3 rounded-full ${dj.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                  ))}
                </div>
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
                <h2 className="text-xl font-bold text-foreground">Pub Dashboard</h2>
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

export default PubDashboard;
