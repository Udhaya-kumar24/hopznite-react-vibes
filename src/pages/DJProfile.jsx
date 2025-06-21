
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Music, Calendar, DollarSign, Briefcase, Headset } from 'lucide-react';
import { getDJById } from '../services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '../components/AuthProvider';

const DJProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [dj, setDj] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDj = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await getDJById(id);
        if (response.success) {
          setDj(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch DJ details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDj();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 bg-background text-foreground">
        <Skeleton className="h-48 md:h-64 w-full rounded-lg mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!dj) {
    return <div className="container mx-auto p-6 text-center text-lg">DJ not found.</div>;
  }

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 w-full">
        <img src={dj.image} alt={dj.name} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{dj.name}</h1>
           <div className="flex items-center gap-4 text-white">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium text-lg">{dj.rating}</span>
                <span className="text-gray-300 ml-1">({dj.reviews.length} reviews)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-1" />
                <span className="text-lg">{dj.location}</span>
              </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Card */}
            <Card>
              <CardHeader>
                <CardTitle>About {dj.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{dj.bio}</p>
              </CardContent>
            </Card>
            
            {/* Details Card */}
            <Card>
               <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex items-start">
                  <Music className="w-5 h-5 mr-3 mt-1 text-primary" />
                  <div>
                    <h4 className="font-semibold">Genres</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {dj.genres.map((genre) => (
                        <Badge key={genre} variant="secondary">{genre}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 mr-3 mt-1 text-primary" />
                  <div>
                    <h4 className="font-semibold">Experience</h4>
                    <p className="text-muted-foreground">{dj.experience}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Headset className="w-5 h-5 mr-3 mt-1 text-primary" />
                  <div>
                    <h4 className="font-semibold">Equipment</h4>
                    <p className="text-muted-foreground">{dj.equipment}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 mt-1 text-primary" />
                   <div>
                    <h4 className="font-semibold">Availability</h4>
                    <p className="text-muted-foreground">{dj.availability.join(", ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Card */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dj.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.name}</span>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground italic">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Booking) */}
          {
            (user.role == 'PubOwner' || user.role == 'Admin' || user.role == 'EventManagement') &&
            <div className="lg:sticky top-24 self-start">
              <Card>
                <CardHeader>
                  <CardTitle>Book {dj.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <div className="text-3xl font-bold text-primary">
                      ₹{dj.price.toLocaleString()}
                      <span className="text-lg text-muted-foreground font-normal">/night</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    Check Availability
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact DJ
                  </Button>
                </CardContent>
              </Card>
            </div>
          }


        </div>
      </div>
    </div>
  );
};

export default DJProfile;
