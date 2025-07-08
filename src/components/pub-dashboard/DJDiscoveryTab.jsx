import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import DJCard from '../DJCard';

const DJDiscoveryTab = ({ filters, setFilters, djs, onBook }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Discover & Book DJs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input placeholder="Genre" value={filters.genre || ''} onChange={e => setFilters(f => ({ ...f, genre: e.target.value }))} />
          <Input placeholder="Location" value={filters.location || ''} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} />
          <Input placeholder="Min Rating" type="number" value={filters.rating || ''} onChange={e => setFilters(f => ({ ...f, rating: e.target.value }))} />
          <Input placeholder="Max Price" type="number" value={filters.price || ''} onChange={e => setFilters(f => ({ ...f, price: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {djs && djs.length > 0 ? djs.map((dj, i) => (
            <DJCard key={dj.id || i} dj={dj} onBook={() => onBook(dj)} showBookButton />
          )) : <div className="text-muted-foreground col-span-full">No DJs found.</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default DJDiscoveryTab; 