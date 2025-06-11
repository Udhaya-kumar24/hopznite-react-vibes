
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import DJCard from '../components/DJCard';
import { getDJList } from '../services/api';

const DJs = () => {
  const [djs, setDjs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDJs = async () => {
      try {
        const data = await getDJList();
        setDjs(data);
      } catch (error) {
        console.error('Error fetching DJs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDJs();
  }, []);

  const filteredDJs = djs.filter(dj =>
    dj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dj.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dj.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookDJ = (djId) => {
    console.log('Booking DJ with ID:', djId);
    // Implement booking logic here
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading DJs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find DJs</h1>
        <p className="text-muted-foreground mb-6">Discover talented DJs for your next event</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search DJs by name, genre, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDJs.map((dj) => (
          <DJCard 
            key={dj.id} 
            dj={dj} 
            showBookButton={true}
            onBook={handleBookDJ}
          />
        ))}
      </div>

      {filteredDJs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No DJs found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default DJs;
