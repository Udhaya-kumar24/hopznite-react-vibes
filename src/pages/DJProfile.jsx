
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Music, Calendar, DollarSign } from 'lucide-react';

const DJProfile = () => {
  const { id } = useParams();
  
  // Mock DJ data - replace with API call
  const dj = {
    id: 1,
    name: "DJ Sonic",
    genre: "EDM",
    rating: 4.8,
    price: 25000,
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    bio: "Professional DJ with 8+ years of experience in electronic dance music. Specializing in creating unforgettable nightlife experiences.",
    experience: "8+ years",
    equipment: "Pioneer DJ, Sound System, Lighting",
    genres: ["EDM", "House", "Techno", "Progressive"],
    availability: ["Friday", "Saturday", "Sunday"],
    reviews: [
      { id: 1, name: "Club Infinity", rating: 5, comment: "Amazing performance! The crowd loved it." },
      { id: 2, name: "Bar Revolution", rating: 4, comment: "Great music selection and energy." }
    ]
  };

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
              <CardTitle>Book DJ Sonic</CardTitle>
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
