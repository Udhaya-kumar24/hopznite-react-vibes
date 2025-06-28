import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar.jsx';
import { Star, DollarSign, Calendar as CalendarIcon, Eye } from 'lucide-react';

const DJOverviewTab = ({
  profileData,
  stats,
  wallet,
  bookingRequests,
  selectedDate,
  onSelectDate,
  onUpgrade,
  onTopUp,
  onSetupLocation,
  onViewAllBookings,
  onManageAvailability,
  availability = [],
  CustomDayContent
}) => {
  if (!profileData || !stats || !wallet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-lg bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-2xl font-bold mb-1">Welcome, {profileData.name}!</div>
          <div className="text-sm">Ready to take your DJ career to the next level? Upgrade to Premium today!</div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={onUpgrade}>Upgrade to Premium</Button>
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-700" onClick={onTopUp}>Top-Up Wallet</Button>
        </div>
      </div>
      {/* Plan Info & Setup Location */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="bg-blue-50 border border-blue-200 rounded px-4 py-2 text-blue-800 text-sm flex-1">
          Free Plan: 2 profile views and 4 bookings remaining. <Button variant="link" className="p-0 h-auto text-blue-700" onClick={onUpgrade}>Upgrade now</Button>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded px-4 py-2 text-orange-800 text-sm flex-1">
          Complete your profile setup by selecting your location to start receiving bookings. <Button variant="link" className="p-0 h-auto text-orange-700" onClick={onSetupLocation}>Setup Location</Button>
        </div>
      </div>
      {/* Dashboard Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="text-xs text-muted-foreground mb-1">Wallet Balance</div>
            <div className="text-2xl font-bold text-green-600">₹{wallet.balance}</div>
            <div className="text-xs text-muted-foreground">Available for bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-xs text-muted-foreground mb-1">Booking Status</div>
            <div className="text-2xl font-bold">1</div>
            <div className="text-xs text-muted-foreground">Free bookings left</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-xs text-muted-foreground mb-1">This Month</div>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <div className="text-xs text-muted-foreground">Events completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="text-xs text-muted-foreground mb-1">Average Rating</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{stats.rating}</span>
              <span className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(stats.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Based on {stats.totalReviews} reviews</div>
          </CardContent>
        </Card>
      </div>
      {/* Recent Bookings & Availability Calendar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bookingRequests.slice(0, 2).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{booking.venueName}</div>
                    <div className="text-xs text-muted-foreground">{new Date(booking.date).toLocaleDateString()} - {booking.time}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{booking.status}</span>
                    <span className="text-green-700 font-semibold text-sm mt-1">₹{booking.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" onClick={onViewAllBookings}>View All Bookings</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Availability Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-xs text-muted-foreground">Quick view of your schedule</div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onSelectDate}
              className="rounded-md border"
              components={CustomDayContent ? { DayContent: CustomDayContent } : {}}
            />
            <Button variant="outline" className="w-full mt-2" onClick={onManageAvailability}>Manage Availability</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DJOverviewTab; 