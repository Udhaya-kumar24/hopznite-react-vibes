
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Star } from 'lucide-react';
import { getDJList } from '../services/api';

const DJs = () => {
  const [djs, setDjs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const genres = ['House', 'EDM', 'Techno', 'Hip Hop', 'R&B', 'Bollywood', 'Commercial', 'Progressive', 'Trance', 'Psy-Trance', 'Drum & Bass', 'Jungle', 'Deep House', 'Melodic', 'World Music', 'Fusion', 'Electro', 'Synthwave'];

  useEffect(() => {
    const fetchDJs = async () => {
      try {
        const response = await getDJList();
        if (response.success) {
          setDjs(response.data);
        }
      } catch (error) {
        console.error('Error fetching DJs:', error);
      } finally {
        setTimeout(() => setLoading(false), 1500); // Simulate loading time
      }
    };

    fetchDJs();
  }, []);

  const filteredDJs = djs.filter(dj => {
    const matchesSearch = dj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.some(genre => 
      dj.genre.toLowerCase().includes(genre.toLowerCase())
    );
    
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && dj.available) ||
                               (availabilityFilter === 'busy' && !dj.available);
    
    return matchesSearch && matchesGenre && matchesAvailability;
  });

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const DJCardSkeleton = () => (
    <Card className="dj-card">
      <div className="text-center">
        <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
        <Skeleton className="h-6 w-16 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto mb-1" />
        <div className="flex justify-center mb-2">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-1 justify-center mb-3">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-10" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-5 w-96 mb-6" />
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="flex gap-2 mb-4">
              {[1,2,3].map(i => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 8).map((genre, i) => (
                <Skeleton key={i} className="h-8 w-16" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <DJCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Top DJs in Chennai</h1>
              <p className="text-muted-foreground">Book the best talent for your next event</p>
            </div>
            <Button variant="outline" className="text-primary hover:text-primary">
              View All DJs →
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
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

          {/* Availability Filter */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`filter-btn ${availabilityFilter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setAvailabilityFilter('available')}
              className={`filter-btn ${availabilityFilter === 'available' ? 'active' : ''}`}
            >
              Available
            </button>
            <button
              onClick={() => setAvailabilityFilter('busy')}
              className={`filter-btn ${availabilityFilter === 'busy' ? 'active' : ''}`}
            >
              Busy
            </button>
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className={`filter-btn text-sm ${selectedGenres.includes(genre) ? 'active' : ''}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 animate-fade-in">
          {filteredDJs.map((dj, index) => (
            <Card key={dj.id} className="dj-card animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="text-center">
                <div className="dj-avatar">
                  <span className="text-2xl font-bold text-foreground">{dj.name.charAt(0)}</span>
                </div>
                <Badge className={`status-badge mb-2 ${dj.available ? 'status-available' : 'status-busy'}`}>
                  {dj.available ? 'Available' : 'Busy'}
                </Badge>
                <h3 className="font-semibold text-foreground mb-1">{dj.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-muted-foreground ml-1">{dj.rating}</span>
                </div>
                <div className="flex gap-1 justify-center mb-3 flex-wrap">
                  <Badge variant="secondary" className="text-xs">{dj.genre}</Badge>
                  <Badge variant="secondary" className="text-xs">EDM</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredDJs.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground">No DJs found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedGenres([]);
                setAvailabilityFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DJs;
