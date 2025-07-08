import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import DJCard from '../DJCard';

const TopDJsTab = ({ topDjs, onBook }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Top Performing DJs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topDjs && topDjs.length > 0 ? topDjs.map((dj, i) => (
            <DJCard key={dj.id || i} dj={dj} onBook={() => onBook(dj)} showBookButton showRating showMedia />
          )) : <div className="text-muted-foreground col-span-full">No top DJs found.</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDJsTab; 