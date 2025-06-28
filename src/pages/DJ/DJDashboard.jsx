import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Music, Star, DollarSign, Clock, MapPin, User, Camera, Settings, Bell, Check, X, Upload, Home, MessageSquare, BarChart3, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { getDJProfile, updateDJProfile, getDJAvailability, updateDJAvailability, getDJBookingRequests, respondToBookingRequest, getDJReviews, updateDJPricing, getDJStats, getVenueById, getEventManagementCompanyById, getDJWallet, updateDJWallet, uploadDJMedia } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import * as RechartsPrimitive from 'recharts';
import DJProfileTab from '../../components/dj-dashboard/DJProfileTab';
import DJAvailabilityTab from '../../components/dj-dashboard/DJAvailabilityTab';
import DJBookingsTab from '../../components/dj-dashboard/DJBookingsTab';
import DJWalletTab from '../../components/dj-dashboard/DJWalletTab';
import DJReviewsTab from '../../components/dj-dashboard/DJReviewsTab';
import DJAnalyticsTab from '../../components/dj-dashboard/DJAnalyticsTab';
import DJOverviewTab from '../../components/dj-dashboard/DJOverviewTab';

const DJDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);

  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [walletLoading, setWalletLoading] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');

  const [performanceImages, setPerformanceImages] = useState([null, null, null]);
  const [performancePreviews, setPerformancePreviews] = useState([null, null, null]);

  const [selectedDayStatus, setSelectedDayStatus] = useState(null);

  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkRange, setBulkRange] = useState({ start: '', end: '' });
  const [bulkStatus, setBulkStatus] = useState('available');
  const [bulkError, setBulkError] = useState('');

  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [manageDate, setManageDate] = useState(null);
  const [manageStatus, setManageStatus] = useState('not_available');

  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const [statsMonth, setStatsMonth] = useState('thisMonth');

  const [bookingPage, setBookingPage] = useState(1);
  const [bookingPageSize, setBookingPageSize] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Profile Setup', icon: User },
    { id: 'availability', label: 'Availability', icon: CalendarIcon },
    { id: 'bookings', label: 'Bookings', icon: MessageSquare },
    { id: 'wallet', label: 'Wallet', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData(statsMonth);
    fetchWallet();
  }, [statsMonth]);

  const fetchDashboardData = async (month = statsMonth) => {
    setLoading(true);
    try {
      let apiMonth = month;
      if (month && month.startsWith('custom-')) {
        // Format: custom-YYYY-MM
        const parts = month.split('-');
        if (parts.length === 3) {
          apiMonth = `${parts[1]}-${parts[2]}`;
        } else {
          apiMonth = 'thisMonth';
        }
      }
      const [profileRes, availabilityRes, bookingsRes, reviewsRes, statsRes] = await Promise.all([
        getDJProfile(1),
        getDJAvailability(1),
        getDJBookingRequests(1),
        getDJReviews(1),
        getDJStats(1, apiMonth)
      ]);
      if (profileRes.success) setProfileData(profileRes.data); else setProfileData(null);
      if (availabilityRes.success) setAvailability(availabilityRes.data); else setAvailability([]);
      if (bookingsRes.success) setBookingRequests(bookingsRes.data); else setBookingRequests([]);
      if (reviewsRes.success) setReviews(reviewsRes.data); else setReviews([]);
      if (statsRes.success) setStats(statsRes.data); else setStats(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setProfileData(null);
      setAvailability([]);
      setBookingRequests([]);
      setReviews([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    setWalletLoading(true);
    const res = await getDJWallet(1);
    if (res.success) setWallet(res.data);
    setWalletLoading(false);
  };

  const handleAddMoney = async () => {
    if (!addMoneyAmount || isNaN(addMoneyAmount)) return toast.error('Enter valid amount');
    setWalletLoading(true);
    const res = await updateDJWallet(1, 'add', parseInt(addMoneyAmount));
    if (res.success) {
      // After top-up, re-fetch wallet from API
      const walletRes = await getDJWallet(1);
      if (walletRes.success) setWallet(walletRes.data);
      setAddMoneyAmount('');
      toast.success('Money added to wallet!');
    } else {
      toast.error(res.error || 'Failed to add money');
    }
    setWalletLoading(false);
  };

  const handleProfileUpdate = async () => {
    try {
      // Upload performance images and collect URLs (if any)
      const uploadedUrls = [];
      for (const file of performanceImages || []) {
        if (file) {
          const res = await uploadDJMedia(1, file, 'performance');
          if (res.success) uploadedUrls.push(res.data.mediaUrl);
        }
      }
      // Update profile with image URLs
      const response = await updateDJProfile(1, { ...profileData, performanceImages: uploadedUrls });
      if (response.success) {
        toast.success('Profile updated successfully!');
        await fetchDashboardData(); // Always re-fetch after update
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleAddAvailability = async () => {
    if (!newAvailability.date || !newAvailability.startTime || !newAvailability.endTime) {
      toast.error('Please fill all availability fields');
      return;
    }

    try {
      const timeSlot = `${newAvailability.startTime}-${newAvailability.endTime}`;
      const newSlot = {
        date: newAvailability.date,
        time: timeSlot,
        status: newAvailability.status
      };

      const response = await updateDJAvailability(1, [...availability, newSlot]);
      if (response.success) {
        setAvailability([...availability, newSlot]);
        setNewAvailability({ date: '', startTime: '', endTime: '', status: 'available' });
        toast.success('Availability added successfully!');
      }
    } catch (error) {
      toast.error('Error adding availability');
    }
  };

  const handleBookingResponse = async (bookingId, response) => {
    try {
      const result = await respondToBookingRequest(bookingId, response);
      if (result.success) {
        setBookingRequests(prev => 
          prev.map(req => 
            req.id === bookingId 
              ? { ...req, status: response } 
              : req
          )
        );

        if (response === 'accepted') {
          const booking = bookingRequests.find(req => req.id === bookingId);
          addToGoogleCalendar(booking);
          toast.success('Booking accepted and added to calendar!');
        } else {
          toast.success('Booking declined');
        }
      }
    } catch (error) {
      toast.error('Error responding to booking');
    }
  };

  const addToGoogleCalendar = (booking) => {
    const startDate = new Date(booking.date + ' ' + booking.time.split('-')[0]);
    const endDate = new Date(booking.date + ' ' + booking.time.split('-')[1]);
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
    };

    const calendarUrl = new URL('https://calendar.google.com/calendar/render');
    calendarUrl.searchParams.set('action', 'TEMPLATE');
    calendarUrl.searchParams.set('text', `DJ Performance at ${booking.venueName}`);
    calendarUrl.searchParams.set('dates', `${formatDate(startDate)}/${formatDate(endDate)}`);
    calendarUrl.searchParams.set('details', `Event: ${booking.eventType}\nVenue: ${booking.venueName}\nLocation: ${booking.location}\nFee: ₹${booking.price}`);
    calendarUrl.searchParams.set('location', `${booking.venueName}, ${booking.location}`);

    window.open(calendarUrl.toString(), '_blank');
  };

  const handleViewBookingDetails = async (booking) => {
    try {
      let details;
      if (booking.venueId) {
        const response = await getVenueById(booking.venueId);
        details = response.success ? response.data : null;
      } else if (booking.eventManagementId) {
        const response = await getEventManagementCompanyById(booking.eventManagementId);
        details = response.success ? response.data : null;
      }
      
      setSelectedBookingDetails({ ...booking, details });
    } catch (error) {
      toast.error('Error fetching booking details');
    }
  };

  const updatePricing = async () => {
    try {
      const response = await updateDJPricing(1, {
        hourlyRate: profileData.hourlyRate,
        eventRate: profileData.eventRate
      });
      if (response.success) {
        toast.success('Pricing updated successfully!');
      }
    } catch (error) {
      toast.error('Error updating pricing');
    }
  };

  const handleAddGenre = async (genre) => {
    if (!profileData || !genre || profileData.genres.includes(genre)) return;
    const updatedGenres = [...profileData.genres, genre];
    const response = await updateDJProfile(1, { ...profileData, genres: updatedGenres });
    if (response.success) {
      toast.success('Genre added!');
      await fetchDashboardData();
    } else {
      toast.error('Failed to add genre');
    }
  };

  const handleRemoveGenre = async (genre) => {
    if (!profileData || !genre) return;
    const updatedGenres = profileData.genres.filter(g => g !== genre);
    const response = await updateDJProfile(1, { ...profileData, genres: updatedGenres });
    if (response.success) {
      toast.success('Genre removed!');
      await fetchDashboardData();
    } else {
      toast.error('Failed to remove genre');
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadDJMedia(1, file, 'profile');
    if (res.success) {
      setProfileData(prev => ({ ...prev, profileImage: res.data.mediaUrl }));
      toast.success('Profile image updated!');
    } else {
      toast.error('Failed to upload image');
    }
  };

  const getDateStatus = (dateStr) => {
    const slot = availability.find(a => a.date === dateStr);
    if (!slot) return null;
    if (slot.status === 'booked') return 'booked';
    if (slot.status === 'available') return 'available';
    if (slot.status === 'busy') return 'busy';
    return null;
  };

  const CustomDayContent = ({ date }) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return <span />;
    }
    const dateStr = date.toISOString().slice(0, 10);
    const status = getDateStatus(dateStr);
    let bgColor = '';
    if (status === 'booked') bgColor = 'bg-green-400 text-white';
    else if (status === 'available') bgColor = 'bg-yellow-300 text-black';
    else if (status === 'busy') bgColor = 'bg-gray-400 text-white';
    return (
      <span
        className={`w-full h-full flex items-center justify-center rounded ${bgColor}`}
        style={{ minHeight: 32, minWidth: 32 }}
      >
        {date.getDate()}
      </span>
    );
  };

  const handleCalendarSelect = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      setSelectedDate(null);
      setSelectedBookingDetails(null);
      return;
    }
    setSelectedDate(date);
    const dateStr = date.toISOString().slice(0, 10);
    const slot = availability.find(a => a.date === dateStr);
    if (slot && (slot.status === 'booked' || slot.status === 'busy')) {
      setSelectedBookingDetails(slot);
      toast.info(`Event: ${slot.status === 'booked' ? 'Booking' : 'Busy'}`);
    } else {
      setSelectedBookingDetails(null);
      // Do not show any toast or popup for available or no slot
    }
  };

  const handlePerformanceImageChange = (index, file) => {
    if (!file) return;
    const updatedImages = [...performanceImages];
    updatedImages[index] = file;
    setPerformanceImages(updatedImages);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedPreviews = [...performancePreviews];
      updatedPreviews[index] = reader.result;
      setPerformancePreviews(updatedPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePerformanceImage = (index) => {
    const updatedImages = [...performanceImages];
    updatedImages[index] = null;
    setPerformanceImages(updatedImages);
    const updatedPreviews = [...performancePreviews];
    updatedPreviews[index] = null;
    setPerformancePreviews(updatedPreviews);
  };

  const getCurrentWeek = () => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
      // Return current week from today if selectedDate is invalid
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });
    }
    const today = selectedDate;
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay()); // Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  useEffect(() => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
      setSelectedDayStatus('not_available');
      return;
    }
    const dateStr = selectedDate.toISOString().slice(0, 10);
    const slot = availability.find(a => a.date === dateStr);
    setSelectedDayStatus(slot ? slot.status : 'not_available');
  }, [selectedDate, availability]);

  const handleSetDayAvailability = async (status) => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) return;
    const dateStr = selectedDate.toISOString().slice(0, 10);
    let updated = availability.filter(a => a.date !== dateStr);
    if (status === 'available') {
      updated.push({ date: dateStr, status: 'available', time: '00:00-23:59' });
    }
    const response = await updateDJAvailability(1, updated);
    if (response.success) {
      toast.success('Availability updated!');
      setAvailability(updated);
      setSelectedDayStatus(status);
    } else {
      toast.error('Failed to update availability');
    }
  };

  const handleBulkApply = async () => {
    setBulkError('');
    if (!bulkRange.start || !bulkRange.end) {
      setBulkError('Please select both start and end dates.');
      return;
    }
    if (bulkRange.end < bulkRange.start) {
      setBulkError('End date must be after start date.');
      return;
    }
    const start = new Date(bulkRange.start);
    const end = new Date(bulkRange.end);
    const newAvailability = [...availability];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (!(d instanceof Date) || isNaN(d)) continue;
      const dateStr = d.toISOString().slice(0, 10);
      const idx = newAvailability.findIndex(a => a.date === dateStr);
      if (idx !== -1) newAvailability.splice(idx, 1);
      if (bulkStatus === 'available') {
        newAvailability.push({ date: dateStr, status: 'available', time: '00:00-23:59' });
      }
    }
    const response = await updateDJAvailability(1, newAvailability);
    if (response.success) {
      toast.success('Bulk availability updated!');
      setBulkModalOpen(false);
      await fetchDashboardData();
    } else {
      toast.error('Failed to update bulk availability');
    }
  };

  const openManageModal = (date) => {
    setManageDate(date);
    if (!(date instanceof Date) || isNaN(date)) {
      setManageStatus('not_available');
      setManageModalOpen(true);
      return;
    }
    const dateStr = date.toISOString().slice(0, 10);
    const slot = availability.find(a => a.date === dateStr);
    setManageStatus(slot && slot.status === 'available' ? 'available' : 'not_available');
    setManageModalOpen(true);
  };

  const handleManageSave = async () => {
    if (!(manageDate instanceof Date) || isNaN(manageDate)) return;
    const dateStr = manageDate.toISOString().slice(0, 10);
    let updated = availability.filter(a => a.date !== dateStr);
    if (manageStatus === 'available') {
      updated.push({ date: dateStr, status: 'available', time: '00:00-23:59' });
    }
    const response = await updateDJAvailability(1, updated);
    if (response.success) {
      toast.success('Availability updated!');
      setManageModalOpen(false);
      await fetchDashboardData();
    } else {
      toast.error('Failed to update availability');
    }
  };

  const fetchBookingRequests = async (page = bookingPage, pageSize = bookingPageSize) => {
    const res = await getDJBookingRequests(1, page, pageSize);
    if (res.success) {
      setBookingRequests(res.data);
      setTotalBookings(res.total);
    } else {
      setBookingRequests([]);
      setTotalBookings(0);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookingRequests(bookingPage, bookingPageSize);
    }
  }, [activeTab, bookingPage, bookingPageSize]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DJOverviewTab
            profileData={profileData}
            stats={stats}
            wallet={wallet}
            bookingRequests={bookingRequests}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onUpgrade={() => toast.info('Upgrade to Premium clicked!')}
            onTopUp={() => setActiveTab('wallet')}
            onSetupLocation={() => toast.info('Setup Location clicked!')}
            onViewAllBookings={() => setActiveTab('bookings')}
            onManageAvailability={() => setActiveTab('availability')}
            availability={availability}
            CustomDayContent={CustomDayContent}
          />
        );

      case 'profile':
        return (
          <DJProfileTab
            profileData={profileData}
            setProfileData={setProfileData}
            performanceImages={performanceImages}
            performancePreviews={performancePreviews}
            handleProfileImageChange={handleProfileImageChange}
            handlePerformanceImageChange={handlePerformanceImageChange}
            handleRemovePerformanceImage={handleRemovePerformanceImage}
            handleProfileUpdate={handleProfileUpdate}
            handleAddGenre={handleAddGenre}
            handleRemoveGenre={handleRemoveGenre}
          />
        );

      case 'availability':
        return (
          <DJAvailabilityTab
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            availability={availability}
            setAvailability={setAvailability}
            selectedDayStatus={selectedDayStatus}
            setSelectedDayStatus={setSelectedDayStatus}
            bulkModalOpen={bulkModalOpen}
            setBulkModalOpen={setBulkModalOpen}
            bulkRange={bulkRange}
            setBulkRange={setBulkRange}
            bulkStatus={bulkStatus}
            setBulkStatus={setBulkStatus}
            bulkError={bulkError}
            setBulkError={setBulkError}
            handleBulkApply={handleBulkApply}
            manageModalOpen={manageModalOpen}
            setManageModalOpen={setManageModalOpen}
            manageDate={manageDate}
            setManageDate={setManageDate}
            manageStatus={manageStatus}
            setManageStatus={setManageStatus}
            openManageModal={openManageModal}
            handleManageSave={handleManageSave}
            handleCalendarSelect={handleCalendarSelect}
            CustomDayContent={CustomDayContent}
            getCurrentWeek={getCurrentWeek}
            handleSetDayAvailability={handleSetDayAvailability}
            X={X}
          />
        );

      case 'bookings':
        return (
          <>
            {/* Top bar: left Booking Details with icon, right Show entries */}
            <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-2 mb-4 px-1">
              <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                <CalendarIcon className="w-6 h-6 text-primary" />
                Booking Details
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <select
                  className="border border-border rounded-md px-2 py-1 text-sm focus:outline-none bg-background text-foreground shadow-sm"
                  value={bookingPageSize}
                  onChange={e => {
                    setBookingPageSize(e.target.value === 'all' ? 'all' : parseInt(e.target.value));
                    setBookingPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={100}>100</option>
                  <option value="all">All</option>
                </select>
                <span className="text-sm text-muted-foreground">entries</span>
              </div>
            </div>
            <DJBookingsTab
              bookingRequests={bookingRequests}
              handleBookingResponse={handleBookingResponse}
              selectedBookingDetails={selectedBookingDetails}
              setSelectedBookingDetails={setSelectedBookingDetails}
              handleViewBookingDetails={handleViewBookingDetails}
              navigate={navigate}
            />
            {/* Pagination Controls - only flex row, no card box */}
            {bookingPageSize !== 'all' && (
              <div className="w-full max-w-6xl mx-auto flex items-center justify-end gap-2 mt-8 px-1">
                <button
                  className="px-3 py-1 rounded-md border border-border text-sm bg-background hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50"
                  onClick={() => setBookingPage(p => Math.max(1, p - 1))}
                  disabled={bookingPage === 1}
                >
                  Prev
                </button>
                <span className="text-sm text-muted-foreground">Page <span className="font-semibold text-foreground">{bookingPage}</span> of <span className="font-semibold text-foreground">{Math.ceil(totalBookings / bookingPageSize)}</span></span>
                <button
                  className="px-3 py-1 rounded-md border border-border text-sm bg-background hover:bg-accent hover:text-accent-foreground transition disabled:opacity-50"
                  onClick={() => setBookingPage(p => p + 1)}
                  disabled={bookingPage >= Math.ceil(totalBookings / bookingPageSize)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        );

      case 'wallet':
        return (
          <DJWalletTab
            wallet={wallet}
            walletLoading={walletLoading}
            addMoneyAmount={addMoneyAmount}
            setAddMoneyAmount={setAddMoneyAmount}
            handleAddMoney={handleAddMoney}
            setWallet={setWallet}
          />
        );

      case 'reviews':
        return (
          <DJReviewsTab
            reviews={reviews}
            rating={stats.rating}
            totalReviews={stats.totalReviews}
            responseRate={stats.acceptanceRate}
          />
        );

      case 'analytics':
        return (
          <DJAnalyticsTab
            stats={stats}
            statsMonth={statsMonth}
            onChangeMonth={setStatsMonth}
          />
        );

      default:
        return null;
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
                <h2 className="text-xl font-bold text-foreground">DJ Dashboard</h2>
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
        <div className="flex-1 p-6">
          {/* Stats Cards */}
          

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DJDashboard;
