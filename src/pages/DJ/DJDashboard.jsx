import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Music, Star, DollarSign, Clock, MapPin, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { getDJHireRequests, respondToDJHireRequest } from '@/services/api';

const DJDashboard = () => {
  const [hireRequests, setHireRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHireRequests();
  }, []);

  const fetchHireRequests = async () => {
    try {
      const response = await getDJHireRequests("current_dj_id"); // This would come from auth context
      if (response.success) {
        setHireRequests(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch hire requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId, response) => {
    try {
      const result = await respondToDJHireRequest(requestId, response, "current_dj_id");
      
      if (result.success) {
        toast.success(`Request ${response} successfully!`);
        // Update the local state
        setHireRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status: response }
              : req
          )
        );
      }
    } catch (error) {
      toast.error(`Failed to ${response} request`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">DJ Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile, bookings, and availability</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Based on 25 reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,000</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hireRequests.filter(req => req.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">New hire requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="w-5 h-5 mr-2" />
              Hire Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : hireRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No hire requests at the moment</p>
            ) : (
              <div className="space-y-4">
                {hireRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{request.pubOwnerName}</h4>
                        <p className="text-sm text-muted-foreground">{request.venueName}</p>
                      </div>
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
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                        {request.eventDate}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                        {request.eventTime}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                        ₹{request.budget.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Music className="w-4 h-4 mr-1 text-muted-foreground" />
                        {request.duration}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Event Type: {request.eventType}</p>
                      {request.specialRequests && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Special Requests: {request.specialRequests}
                        </p>
                      )}
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleRequestResponse(request.id, 'accepted')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRequestResponse(request.id, 'rejected')}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Club Infinity</p>
                  <p className="text-sm text-muted-foreground">June 15, 2024</p>
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Confirmed</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bar Revolution</p>
                  <p className="text-sm text-muted-foreground">June 20, 2024</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>
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
              Update Availability
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Music className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Star className="mr-2 h-4 w-4" />
              View Reviews
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DJDashboard;
