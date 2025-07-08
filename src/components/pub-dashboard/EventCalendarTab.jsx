import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar.jsx';

const EventCalendarTab = ({ events, onCreateEvent, onChange, newEvent, setNewEvent }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Event Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Create New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Date</Label>
              <Calendar selected={newEvent.date} onSelect={date => setNewEvent(e => ({ ...e, date }))} className="mb-2" />
              <Label>Time</Label>
              <Input type="time" value={newEvent.time || ''} onChange={e => setNewEvent(ev => ({ ...ev, time: e.target.value }))} className="mb-2" />
              <Label>Theme / Event Type</Label>
              <Input value={newEvent.theme || ''} onChange={e => setNewEvent(ev => ({ ...ev, theme: e.target.value }))} className="mb-2" />
              <Label>DJ Required?</Label>
              <select value={newEvent.djRequired ? 'yes' : 'no'} onChange={e => setNewEvent(ev => ({ ...ev, djRequired: e.target.value === 'yes' }))} className="mb-2 border rounded px-2 py-1">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <Label>Publish Event</Label>
              <input type="checkbox" checked={!!newEvent.published} onChange={e => setNewEvent(ev => ({ ...ev, published: e.target.checked }))} className="ml-2" />
            </div>
          </div>
          <Button onClick={onCreateEvent}>Create Event</Button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Upcoming Events</h3>
          <ul className="divide-y">
            {events && events.length > 0 ? events.map((event, i) => (
              <li key={i} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-medium">{event.theme}</span> <span className="text-sm text-muted-foreground">{event.date?.toLocaleDateString?.() || event.date} {event.time}</span>
                  {event.djRequired && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">DJ</span>}
                  {event.published && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Published</span>}
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </li>
            )) : <li className="text-muted-foreground py-2">No events yet.</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendarTab; 