
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Heart, Ticket, MapPin } from 'lucide-react';

const CustomerDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <p className="text-muted-foreground">Discover events, book tickets, and track your favorites</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Booked tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite DJs</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Following</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venues Visited</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Different venues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Electronic Vibes</p>
                  <p className="text-sm text-muted-foreground">Club Infinity - June 15, 2024</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Confirmed</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Retro Night</p>
                  <p className="text-sm text-muted-foreground">Bar Revolution - June 20, 2024</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Booked</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Browse Events
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Heart className="mr-2 h-4 w-4" />
              Favorite DJs
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MapPin className="mr-2 h-4 w-4" />
              Discover Venues
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
