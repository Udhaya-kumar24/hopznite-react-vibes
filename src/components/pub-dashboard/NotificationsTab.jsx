import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const NotificationsTab = ({ notifications }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {notifications && notifications.length > 0 ? notifications.map((note, i) => (
            <li key={i} className="py-2 flex items-center justify-between">
              <div>
                <span className="font-medium">{note.title}</span> <span className="text-sm text-muted-foreground">{note.time}</span>
              </div>
              <span className="text-xs text-muted-foreground">{note.type}</span>
            </li>
          )) : <li className="text-muted-foreground py-2">No notifications.</li>}
        </ul>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab; 