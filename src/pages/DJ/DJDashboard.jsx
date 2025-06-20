import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Music, Star, DollarSign, Clock, MapPin, User, Camera, Settings, Bell, Check, X, Upload, Eye, Home, MessageSquare, BarChart3, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { getDJProfile, updateDJProfile, getDJAvailability, updateDJAvailability, getDJBookingRequests, respondToBookingRequest, getDJReviews, updateDJPricing, getDJStats, getVenueById, getEventManagementCompanyById, getDJWallet, updateDJWallet, uploadDJMedia } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const DJDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'DJ Alex Thunder',
    bio: 'Professional DJ with 8+ years of experience in electronic music, house, and techno.',
    genres: ['House', 'Techno', 'Electronic', 'Progressive'],
    topGenre: 'House',
    experience: 8,
    hourlyRate: 5000,
    eventRate: 25000,
    profileImage: '/placeholder.svg',
    phone: '+91 9876543210',
    email: 'alex.thunder@email.com',
    location: 'Mumbai, India'
  });

  const [availability, setAvailability] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 12,
    rating: 4.8,
    earnings: 45000,
    profileViews: 234
  });

  const [newAvailability, setNewAvailability] = useState({
    date: '',
    startTime: '',
    endTime: '',
    status: 'available'
  });

  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [walletLoading, setWalletLoading] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');

  const [newGenre, setNewGenre] = useState('');

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Profile Setup', icon: User },
    { id: 'availability', label: 'Availability', icon: CalendarIcon },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'bookings', label: 'Bookings', icon: MessageSquare },
    { id: 'wallet', label: 'Wallet', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  // Define quickActions array for use in Overview Quick Actions
  const quickActions = [
    { key: 'availability', label: 'Update Availability', icon: CalendarIcon, tab: 'availability' },
    { key: 'profile', label: 'Edit Profile', icon: User, tab: 'profile' },
    { key: 'pricing', label: 'Update Pricing', icon: DollarSign, tab: 'pricing' },
    { key: 'wallet', label: 'Wallet', icon: DollarSign, tab: 'wallet' },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    fetchWallet();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profileRes, availabilityRes, bookingsRes, reviewsRes, statsRes] = await Promise.all([
        getDJProfile(1),
        getDJAvailability(1),
        getDJBookingRequests(1),
        getDJReviews(1),
        getDJStats(1)
      ]);

      if (profileRes.success) setProfileData(profileRes.data);
      if (availabilityRes.success) setAvailability(availabilityRes.data);
      if (bookingsRes.success) setBookingRequests(bookingsRes.data);
      if (reviewsRes.success) setReviews(reviewsRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
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
      setWallet(prev => ({
        balance: res.data.newBalance,
        transactions: [res.data.transaction, ...prev.transactions],
      }));
      setAddMoneyAmount('');
      toast.success('Money added to wallet!');
    } else {
      toast.error('Failed to add money');
    }
    setWalletLoading(false);
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await updateDJProfile(1, profileData);
      if (response.success) {
        toast.success('Profile updated successfully!');
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

  const handleAddGenre = () => {
    if (newGenre && !profileData.genres.includes(newGenre)) {
      setProfileData(prev => ({ ...prev, genres: [...prev.genres, newGenre] }));
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (genre) => {
    setProfileData(prev => ({ ...prev, genres: prev.genres.filter(g => g !== genre) }));
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
    const dateStr = date.toISOString().slice(0, 10);
    const status = getDateStatus(dateStr);
    let dotColor = '';
    if (status === 'booked') dotColor = 'bg-green-500';
    else if (status === 'available') dotColor = 'bg-yellow-400';
    else if (status === 'busy') dotColor = 'bg-gray-400';
    return (
      <span style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        {date.getDate()}
        {status && (
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${dotColor}`}
          ></span>
        )}
      </span>
    );
  };

  const handleCalendarSelect = (date) => {
    setSelectedDate(date);
    const dateStr = date.toISOString().slice(0, 10);
    const slot = availability.find(a => a.date === dateStr);
    if (slot) {
      setSelectedBookingDetails(slot);
      toast.info(`Event: ${slot.status === 'booked' ? 'Booking' : slot.status}`);
    } else {
      setSelectedBookingDetails(null);
      toast.info('No events for this date');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookingRequests.slice(0, 3).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted"
                        onClick={() => navigate(`/events/${booking.id}`)}
                      >
                        <div>
                          <p className="font-medium text-foreground">{booking.venueName}</p>
                          <p className="text-sm text-muted-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={booking.status === 'accepted' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Music className="w-5 h-5 mr-2 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action) => (
                    <Button 
                      key={action.key}
                      className="w-full justify-start bg-primary hover:bg-primary/90"
                      onClick={() => setActiveTab(action.tab)}
                    >
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'profile':
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <User className="w-5 h-5 mr-2 text-primary" />
                Profile Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.profileImage} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button asChild variant="outline">
                    <label htmlFor="profile-upload" className="flex items-center cursor-pointer">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </label>
                  </Button>
                  <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">DJ Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="topGenre">Top Genre</Label>
                    <Input 
                      id="topGenre" 
                      value={profileData.topGenre}
                      onChange={(e) => setProfileData(prev => ({...prev, topGenre: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input 
                      id="experience" 
                      type="number"
                      value={profileData.experience}
                      onChange={(e) => setProfileData(prev => ({...prev, experience: parseInt(e.target.value)}))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Label>Genres</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.genres.map((genre, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {genre}
                          <Button size="icon" variant="ghost" className="p-0 ml-1" onClick={() => handleRemoveGenre(genre)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Add genre"
                        value={newGenre}
                        onChange={e => setNewGenre(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddGenre(); } }}
                        className="w-32"
                      />
                      <Button onClick={handleAddGenre} size="sm">Add</Button>
                    </div>
                  </div>
                </div>
              </div>
              <Button onClick={handleProfileUpdate} className="bg-primary hover:bg-primary/90">
                Update Profile
              </Button>
            </CardContent>
          </Card>
        );

      case 'availability':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Availability Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleCalendarSelect}
                  className="rounded-md border"
                  components={{ DayContent: CustomDayContent }}
                />
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Add New Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="availDate">Date</Label>
                    <Input 
                      id="availDate"
                      type="date"
                      value={newAvailability.date}
                      onChange={(e) => setNewAvailability(prev => ({...prev, date: e.target.value}))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input 
                        id="startTime"
                        type="time"
                        value={newAvailability.startTime}
                        onChange={(e) => setNewAvailability(prev => ({...prev, startTime: e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input 
                        id="endTime"
                        type="time"
                        value={newAvailability.endTime}
                        onChange={(e) => setNewAvailability(prev => ({...prev, endTime: e.target.value}))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newAvailability.status} 
                      onValueChange={(value) => setNewAvailability(prev => ({...prev, status: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddAvailability} className="w-full bg-primary hover:bg-primary/90">
                    Add Availability
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Current Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {availability.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{new Date(slot.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">{slot.time}</p>
                        </div>
                        <Badge variant={slot.status === 'available' ? 'default' : 'secondary'}>
                          {slot.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <DollarSign className="w-5 h-5 mr-2 text-primary" />
                Pricing Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                  <Input 
                    id="hourlyRate" 
                    type="number"
                    value={profileData.hourlyRate}
                    onChange={(e) => setProfileData(prev => ({...prev, hourlyRate: parseInt(e.target.value)}))}
                  />
                </div>
                <div>
                  <Label htmlFor="eventRate">Event Package (₹)</Label>
                  <Input 
                    id="eventRate" 
                    type="number"
                    value={profileData.eventRate}
                    onChange={(e) => setProfileData(prev => ({...prev, eventRate: parseInt(e.target.value)}))}
                  />
                </div>
              </div>
              <Button onClick={updatePricing} className="bg-primary hover:bg-primary/90">
                Update Pricing
              </Button>
            </CardContent>
          </Card>
        );

      case 'bookings':
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                Booking Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{request.venueName}</h3>
                        <p className="text-muted-foreground mb-2">{request.eventType}</p>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {new Date(request.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {request.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {request.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            ₹{request.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/events/${request.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Booking Details</DialogTitle>
                            </DialogHeader>
                            {selectedBookingDetails && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold">{selectedBookingDetails.venueName}</h4>
                                  <p className="text-sm text-muted-foreground">{selectedBookingDetails.eventType}</p>
                                </div>
                                <div className="space-y-2">
                                  <p><strong>Date:</strong> {new Date(selectedBookingDetails.date).toLocaleDateString()}</p>
                                  <p><strong>Time:</strong> {selectedBookingDetails.time}</p>
                                  <p><strong>Location:</strong> {selectedBookingDetails.location}</p>
                                  <p><strong>Fee:</strong> ₹{selectedBookingDetails.price.toLocaleString()}</p>
                                </div>
                                {selectedBookingDetails.details && (
                                  <div className="border-t pt-4">
                                    <h5 className="font-semibold mb-2">Contact Information</h5>
                                    <p><strong>Name:</strong> {selectedBookingDetails.details.name}</p>
                                    {selectedBookingDetails.details.contact && (
                                      <>
                                        <p><strong>Phone:</strong> {selectedBookingDetails.details.contact.phone}</p>
                                        <p><strong>Email:</strong> {selectedBookingDetails.details.contact.email}</p>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleBookingResponse(request.id, 'accepted')}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleBookingResponse(request.id, 'declined')}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </>
                        )}
                        {request.status === 'accepted' && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>
                        )}
                        {request.status === 'declined' && (
                          <Badge variant="destructive">Declined</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'wallet':
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <DollarSign className="w-5 h-5 mr-2 text-primary" />
                Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              {walletLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="text-lg font-bold">Balance: ₹{wallet.balance}</div>
                  </div>
                  <div className="mb-4 flex gap-2">
                    <Input
                      type="number"
                      placeholder="Add money"
                      value={addMoneyAmount}
                      onChange={e => setAddMoneyAmount(e.target.value)}
                      className="w-32"
                    />
                    <Button onClick={handleAddMoney} disabled={walletLoading} className="bg-primary">Add</Button>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Transactions</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {wallet.transactions.map(tx => (
                        <div key={tx.id} className="flex justify-between p-2 bg-muted/50 rounded">
                          <span>{tx.description}</span>
                          <span className={tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                            {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                          </span>
                          <span className="text-xs text-muted-foreground">{tx.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );

      case 'reviews':
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Star className="w-5 h-5 mr-2 text-primary" />
                Performance Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{review.venue}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-2">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'analytics':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">₹{stats.monthlyEarnings?.toLocaleString() || stats.earnings.toLocaleString()}</div>
                <p className="text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.profileViews}</div>
                <p className="text-muted-foreground">Total views</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Acceptance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.acceptanceRate || 85}%</div>
                <p className="text-muted-foreground">Booking acceptance</p>
              </CardContent>
            </Card>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total Bookings</CardTitle>
                <CalendarIcon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Rating</CardTitle>
                <Star className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.rating}</div>
                <p className="text-xs text-muted-foreground">Based on {stats.totalReviews || 25} reviews</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">₹{stats.earnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Profile Views</CardTitle>
                <Music className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.profileViews}</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DJDashboard;
