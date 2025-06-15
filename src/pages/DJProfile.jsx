
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Music, Calendar, DollarSign } from 'lucide-react';
import { getDJById } from '../services/api';
import { Skeleton } from '@/components/ui/skeleton';

const DJProfile = () => {
  const { id } = useParams();
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
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="w-full md:w-48 h-48 rounded-lg" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!dj) {
    return <div className="container mx-auto p-6 text-center text-lg">DJ not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={dj.image}
                  alt={dj.name}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{dj.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{dj.rating}</span>
                      <span className="text-muted-foreground ml-1">({dj.reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {dj.location}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{dj.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dj.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ₹{dj.price.toLocaleString()}
                    <span className="text-sm text-muted-foreground font-normal">/night</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Book {dj.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" size="lg">
                Book Now - ₹{dj.price.toLocaleString()}
              </Button>
              <Button variant="outline" className="w-full">
                Contact DJ
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Music className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Experience: {dj.experience}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Available: {dj.availability.join(", ")}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Equipment: {dj.equipment}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DJProfile;
