import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Users, Music, TrendingUp, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { getPubOwnerSentRequests, getDJList } from '@/services/api';
import DJHireRequestForm from '@/components/DJHireRequestForm';

const PubDashboard = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [availableDJs, setAvailableDJs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [selectedDJ, setSelectedDJ] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsResponse, djsResponse] = await Promise.all([
        getPubOwnerSentRequests("current_pub_owner_id"),
        getDJList()
      ]);
      
      if (requestsResponse.success) {
        setSentRequests(requestsResponse.data);
      }
      
      if (djsResponse.success) {
        setAvailableDJs(djsResponse.data.filter(dj => dj.available));
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleHireDJ = (dj) => {
    setSelectedDJ(dj);
    setShowHireDialog(true);
  };

  const handleHireRequestClose = () => {
    setShowHireDialog(false);
    setSelectedDJ(null);
    fetchData(); // Refresh data after sending request
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pub Dashboard</h1>
        <p className="text-muted-foreground">Manage your venue, events, and DJ bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bookings</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Active bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,25,000</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DJ Requests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentRequests.length}</div>
            <p className="text-xs text-muted-foreground">Sent requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="w-5 h-5 mr-2" />
              DJ Hire Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : sentRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No requests sent yet</p>
            ) : (
              <div className="space-y-3">
                {sentRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{request.djName}</h4>
                      <Badge 
                        variant={
                          request.status === 'pending' ? 'secondary' : 
                          request.status === 'accepted' ? 'default' : 
                          'destructive'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.eventDate} • ₹{request.budget.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Available DJs
              </div>
              <Dialog open={showHireDialog} onOpenChange={setShowHireDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Hire DJ
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select a DJ to Hire</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {availableDJs.map((dj) => (
                      <div key={dj.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{dj.name}</h4>
                          <p className="text-sm text-muted-foreground">{dj.genre} • ₹{dj.price.toLocaleString()}</p>
                        </div>
                        <Button size="sm" onClick={() => handleHireDJ(dj)}>
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {availableDJs.slice(0, 4).map((dj) => (
                  <div key={dj.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{dj.name}</p>
                      <p className="text-sm text-muted-foreground">{dj.genre} • ₹{dj.price.toLocaleString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleHireDJ(dj)}>
                      Hire
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedDJ} onOpenChange={(open) => !open && setSelectedDJ(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hire DJ Request</DialogTitle>
          </DialogHeader>
          {selectedDJ && (
            <DJHireRequestForm 
              djId={selectedDJ.id}
              djName={selectedDJ.name}
              onClose={handleHireRequestClose}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Saturday Night Fever</p>
                  <p className="text-sm text-muted-foreground">June 15, 2024 - DJ Sonic</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Upcoming</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Hip-Hop Night</p>
                  <p className="text-sm text-muted-foreground">June 22, 2024 - DJ Blaze</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Confirmed</span>
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
              Create New Event
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Music className="mr-2 h-4 w-4" />
              Browse DJs
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Venue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PubDashboard;
