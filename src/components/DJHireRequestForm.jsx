
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, DollarSign, Music } from 'lucide-react';
import { toast } from 'sonner';
import { sendDJHireRequest } from '@/services/api';

const DJHireRequestForm = ({ djId, djName, onClose }) => {
  const [formData, setFormData] = useState({
    eventDate: '',
    eventTime: '',
    duration: '',
    budget: '',
    eventType: '',
    specialRequests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData = {
        djId: djId,
        pubOwnerId: "current_pub_owner_id", // This would come from auth context
        venueId: "current_venue_id", // This would come from pub owner's venue
        ...formData
      };

      const response = await sendDJHireRequest(requestData);
      
      if (response.success) {
        toast.success('Hire request sent successfully!');
        onClose();
      } else {
        toast.error('Failed to send request');
      }
    } catch (error) {
      toast.error('Error sending request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="w-5 h-5 mr-2" />
          Hire {djName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventTime">Event Time</Label>
            <Input
              id="eventTime"
              type="time"
              value={formData.eventTime}
              onChange={(e) => handleChange('eventTime', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select onValueChange={(value) => handleChange('duration', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2 hours">2 Hours</SelectItem>
                <SelectItem value="3 hours">3 Hours</SelectItem>
                <SelectItem value="4 hours">4 Hours</SelectItem>
                <SelectItem value="5 hours">5 Hours</SelectItem>
                <SelectItem value="6 hours">6 Hours</SelectItem>
                <SelectItem value="8 hours">8 Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget (₹)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="Enter your budget"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type</Label>
            <Select onValueChange={(value) => handleChange('eventType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Club Night">Club Night</SelectItem>
                <SelectItem value="Private Party">Private Party</SelectItem>
                <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Birthday Party">Birthday Party</SelectItem>
                <SelectItem value="Festival">Festival</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              placeholder="Any special music preferences or requirements..."
              value={formData.specialRequests}
              onChange={(e) => handleChange('specialRequests', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DJHireRequestForm;
