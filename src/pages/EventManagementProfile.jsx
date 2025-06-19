import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Phone, Mail, CheckCircle } from 'lucide-react';
import { getEventManagementCompanyById } from '@/services/api';

const EventManagementProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEventManagementCompanyById(id).then(res => {
      setCompany(res.data || null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Loading company profile...</div>;
  }

  if (!company) {
    return <div className="text-center py-20 text-destructive">Company not found.</div>;
  }

  // Dummy values for employees worked and events completed
  const employeesWorked = 35;
  const eventsCompleted = 120;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <img
                src={company.image}
                alt={company.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {company.location}
                </div>
                <Badge variant="secondary">{company.type}</Badge>
              </div>
              <p className="text-muted-foreground mb-6">{company.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Specialized In</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.services && company.services.map((service) => (
                      <Badge key={service} variant="outline">{service}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Employees Worked: {employeesWorked}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Events Completed: {eventsCompleted}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {company.upcomingEvents && company.upcomingEvents.length > 0 ? (
                  company.upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-muted-foreground">{event.date} • {event.venue}</p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No upcoming events.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{company.contact?.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{company.contact?.email}</span>
              </div>
              <Button className="w-full">
                Contact Company
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventManagementProfile; 