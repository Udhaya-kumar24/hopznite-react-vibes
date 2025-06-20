
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Music, Star, DollarSign, Clock, MapPin, User, Camera, Settings, Bell, Check, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import GoogleCalendar from '../../components/GoogleCalendar';

const DJDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const [availability, setAvailability] = useState([
    { date: '2024-06-15', status: 'available', time: '20:00-02:00' },
    { date: '2024-06-16', status: 'booked', time: '21:00-03:00' },
    { date: '2024-06-20', status: 'available', time: '19:00-01:00' },
  ]);

  const [bookingRequests, setBookingRequests] = useState([
    {
      id: 1,
      venueName: 'Club Infinity',
      date: '2024-06-22',
      time: '22:00-04:00',
      price: 30000,
      status: 'pending',
      location: 'Bandra, Mumbai',
      eventType: 'Saturday Night Party'
    },
    {
      id: 2,
      venueName: 'Skybar Lounge',
      date: '2024-06-25',
      time: '20:00-02:00',
      price: 25000,
      status: 'pending',
      location: 'Juhu, Mumbai',
      eventType: 'Weekend Special'
    }
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      venue: 'Club Revolution',
      rating: 5,
      comment: 'Amazing performance! The crowd loved every minute.',
      date: '2024-06-10'
    },
    {
      id: 2,
      venue: 'Rooftop Bar',
      rating: 4,
      comment: 'Great music selection and professional setup.',
      date: '2024-06-05'
    }
  ]);

  const [stats, setStats] = useState({
    totalBookings: 12,
    rating: 4.8,
    earnings: 45000,
    profileViews: 234
  });

  const handleProfileUpdate = () => {
    // API call to update profile
    toast.success('Profile updated successfully!');
  };

  const handleBookingResponse = (bookingId, response) => {
    setBookingRequests(prev => 
      prev.map(req => 
        req.id === bookingId 
          ? { ...req, status: response } 
          : req
      )
    );
    
    if (response === 'accepted') {
      const booking = bookingRequests.find(req => req.id === bookingId);
      // Add to Google Calendar
      const event = {
        title: `DJ Performance at ${booking.venueName}`,
        date: booking.date,
        time: booking.time.split('-')[0],
        venue: booking.venueName,
        location: booking.location,
        price: booking.price
      };
      
      toast.success(`Booking accepted! Added to calendar.`);
    } else {
      toast.success('Booking declined.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">DJ Dashboard</h1>
          <p className="text-blue-200">Manage your profile, bookings, and grow your music career</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarIcon className="h-4 w-4 text-blue-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-blue-200">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating}</div>
              <p className="text-xs text-blue-200">Based on 25 reviews</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-green-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.earnings.toLocaleString()}</div>
              <p className="text-xs text-blue-200">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Music className="h-4 w-4 text-purple-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profileViews}</div>
              <p className="text-xs text-blue-200">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-lg">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">Overview</TabsTrigger>
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/20">Profile</TabsTrigger>
            <TabsTrigger value="availability" className="text-white data-[state=active]:bg-white/20">Calendar</TabsTrigger>
            <TabsTrigger value="pricing" className="text-white data-[state=active]:bg-white/20">Pricing</TabsTrigger>
            <TabsTrigger value="bookings" className="text-white data-[state=active]:bg-white/20">Bookings</TabsTrigger>
            <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-white/20">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Club Infinity</p>
                        <p className="text-sm text-blue-200">June 15, 2024</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300">Confirmed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium">Bar Revolution</p>
                        <p className="text-sm text-blue-200">June 20, 2024</p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-300">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Update Availability
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Update Pricing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.profileImage} />
                    <AvatarFallback className="bg-blue-600 text-white text-2xl">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">DJ Name</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                        className="bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="topGenre" className="text-white">Top Genre</Label>
                      <Input 
                        id="topGenre" 
                        value={profileData.topGenre}
                        onChange={(e) => setProfileData(prev => ({...prev, topGenre: e.target.value}))}
                        className="bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-white">Years of Experience</Label>
                      <Input 
                        id="experience" 
                        type="number"
                        value={profileData.experience}
                        onChange={(e) => setProfileData(prev => ({...prev, experience: parseInt(e.target.value)}))}
                        className="bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bio" className="text-white">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                        className="bg-white/10 border-white/20 text-white placeholder-white/60 min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Genres</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.genres.map((genre, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-600/20 text-blue-300">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <Button onClick={handleProfileUpdate} className="bg-blue-600 hover:bg-blue-700">
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Availability Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-white/20 bg-white/5"
                  />
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Availability Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availability.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="font-medium">{new Date(slot.date).toLocaleDateString()}</p>
                          <p className="text-sm text-blue-200">{slot.time}</p>
                        </div>
                        <Badge className={slot.status === 'available' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                          {slot.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    Add Available Slot
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pricing Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="hourlyRate" className="text-white">Hourly Rate (₹)</Label>
                    <Input 
                      id="hourlyRate" 
                      type="number"
                      value={profileData.hourlyRate}
                      onChange={(e) => setProfileData(prev => ({...prev, hourlyRate: parseInt(e.target.value)}))}
                      className="bg-white/10 border-white/20 text-white placeholder-white/60"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventRate" className="text-white">Event Package (₹)</Label>
                    <Input 
                      id="eventRate" 
                      type="number"
                      value={profileData.eventRate}
                      onChange={(e) => setProfileData(prev => ({...prev, eventRate: parseInt(e.target.value)}))}
                      className="bg-white/10 border-white/20 text-white placeholder-white/60"
                    />
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Update Pricing
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  Booking Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{request.venueName}</h3>
                          <p className="text-blue-200 mb-2">{request.eventType}</p>
                          <div className="space-y-1 text-sm text-blue-200">
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
                          {request.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  handleBookingResponse(request.id, 'accepted');
                                  addToGoogleCalendar(request);
                                }}
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
                            <Badge className="bg-green-500/20 text-green-300">Accepted</Badge>
                          )}
                          {request.status === 'declined' && (
                            <Badge className="bg-red-500/20 text-red-300">Declined</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Performance Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{review.venue}</h3>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-blue-200 mb-2">{review.comment}</p>
                      <p className="text-xs text-blue-300">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DJDashboard;
