
import axios from "axios";

const api = axios.create({
  baseURL: "https://dummy.hopznite.api", // Can be replaced later
  timeout: 10000,
});

// Dummy data
const dummyDJs = [
  { 
    id: 1, 
    name: "DJ Sonic", 
    genre: "EDM", 
    rating: 4.8, 
    price: 15000, 
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    bio: "Professional EDM DJ with 5+ years experience",
    availability: ["2025-06-20", "2025-06-21", "2025-06-22"]
  },
  { 
    id: 2, 
    name: "DJ Blaze", 
    genre: "Hip-hop", 
    rating: 4.6, 
    price: 12000, 
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    bio: "Hip-hop specialist with international experience",
    availability: ["2025-06-21", "2025-06-23", "2025-06-24"]
  },
  { 
    id: 3, 
    name: "DJ Nova", 
    genre: "House", 
    rating: 4.9, 
    price: 18000, 
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400",
    bio: "House music expert with club residencies",
    availability: ["2025-06-20", "2025-06-22", "2025-06-25"]
  }
];

const dummyVenues = [
  { 
    id: 1, 
    name: "Bar X", 
    location: "Chennai", 
    capacity: 200, 
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400",
    description: "Premium lounge with state-of-the-art sound system",
    amenities: ["Sound System", "Lighting", "VIP Area"]
  },
  { 
    id: 2, 
    name: "Pub Z", 
    location: "Bangalore", 
    capacity: 300, 
    image: "https://images.unsplash.com/photo-1559329007-40df8c9345d8?w=400",
    description: "Popular nightclub in the heart of the city",
    amenities: ["Dance Floor", "Bar", "Private Booths"]
  }
];

const dummyEvents = [
  { 
    id: 1, 
    title: "Saturday Vibes", 
    venue: "Bar X", 
    venueId: 1,
    djId: 1,
    djName: "DJ Sonic",
    date: "2025-06-20", 
    time: "21:00",
    price: 1500,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    description: "An electrifying night of EDM music"
  },
  { 
    id: 2, 
    title: "Hip-Hop Night", 
    venue: "Pub Z", 
    venueId: 2,
    djId: 2,
    djName: "DJ Blaze",
    date: "2025-06-22", 
    time: "22:00",
    price: 1200,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    description: "Best hip-hop beats in the city"
  }
];

const dummyBookings = [
  {
    id: 1,
    djId: 1,
    venueId: 1,
    eventId: 1,
    status: "pending",
    date: "2025-06-20",
    amount: 15000,
    customerName: "John Doe"
  }
];

// Auth APIs
export const loginUser = async (credentials) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    let role = "Customer";
    if (credentials.email.includes("dj")) role = "DJ";
    else if (credentials.email.includes("pub")) role = "PubOwner";
    else if (credentials.email.includes("admin")) role = "Admin";

    return {
      success: true,
      data: {
        token: "dummy_jwt_token_" + Date.now(),
        role: role,
        user: { 
          id: 1, 
          name: "Test User", 
          email: credentials.email,
          role: role 
        }
      }
    };
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const registerUser = async (userData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: {
        message: "Registration successful",
        user: { ...userData, id: Date.now() }
      }
    };
  } catch (error) {
    throw new Error("Registration failed");
  }
};

// DJ APIs
export const getDJList = async (filters = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredDJs = [...dummyDJs];
    
    if (filters.genre) {
      filteredDJs = filteredDJs.filter(dj => 
        dj.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }
    
    if (filters.location) {
      filteredDJs = filteredDJs.filter(dj => 
        dj.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    return { success: true, data: filteredDJs };
  } catch (error) {
    throw new Error("Failed to fetch DJs");
  }
};

export const getDJById = async (id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const dj = dummyDJs.find(dj => dj.id === parseInt(id));
    if (!dj) throw new Error("DJ not found");
    return { success: true, data: dj };
  } catch (error) {
    throw new Error("Failed to fetch DJ details");
  }
};

// Venue APIs
export const getVenues = async (filters = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredVenues = [...dummyVenues];
    
    if (filters.location) {
      filteredVenues = filteredVenues.filter(venue => 
        venue.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    return { success: true, data: filteredVenues };
  } catch (error) {
    throw new Error("Failed to fetch venues");
  }
};

export const getVenueById = async (id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const venue = dummyVenues.find(venue => venue.id === parseInt(id));
    if (!venue) throw new Error("Venue not found");
    return { success: true, data: venue };
  } catch (error) {
    throw new Error("Failed to fetch venue details");
  }
};

// Event APIs
export const getEvents = async (filters = {}) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredEvents = [...dummyEvents];
    
    if (filters.location) {
      const venuesInLocation = dummyVenues.filter(venue => 
        venue.location.toLowerCase().includes(filters.location.toLowerCase())
      );
      const venueNames = venuesInLocation.map(venue => venue.name);
      filteredEvents = filteredEvents.filter(event => 
        venueNames.includes(event.venue)
      );
    }
    
    if (filters.date) {
      filteredEvents = filteredEvents.filter(event => event.date === filters.date);
    }
    
    return { success: true, data: filteredEvents };
  } catch (error) {
    throw new Error("Failed to fetch events");
  }
};

export const getEventById = async (id) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const event = dummyEvents.find(event => event.id === parseInt(id));
    if (!event) throw new Error("Event not found");
    return { success: true, data: event };
  } catch (error) {
    throw new Error("Failed to fetch event details");
  }
};

// Booking APIs
export const bookDJ = async (bookingData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    dummyBookings.push(newBooking);
    return { success: true, data: newBooking };
  } catch (error) {
    throw new Error("Booking failed");
  }
};

export const getBookings = async (userId, role) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Filter bookings based on user role
    let userBookings = [...dummyBookings];
    
    if (role === "DJ") {
      userBookings = userBookings.filter(booking => booking.djId === userId);
    } else if (role === "PubOwner") {
      userBookings = userBookings.filter(booking => booking.venueId === userId);
    }
    
    return { success: true, data: userBookings };
  } catch (error) {
    throw new Error("Failed to fetch bookings");
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const bookingIndex = dummyBookings.findIndex(booking => booking.id === bookingId);
    if (bookingIndex !== -1) {
      dummyBookings[bookingIndex].status = status;
      return { success: true, data: dummyBookings[bookingIndex] };
    }
    throw new Error("Booking not found");
  } catch (error) {
    throw new Error("Failed to update booking status");
  }
};

// Reviews APIs
export const getReviews = async (targetId, targetType) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const dummyReviews = [
      {
        id: 1,
        targetId,
        targetType,
        rating: 5,
        comment: "Amazing performance! Highly recommended.",
        customerName: "Sarah Johnson",
        date: "2025-06-15"
      },
      {
        id: 2,
        targetId,
        targetType,
        rating: 4,
        comment: "Great music and energy throughout the night.",
        customerName: "Mike Chen",
        date: "2025-06-10"
      }
    ];
    return { success: true, data: dummyReviews };
  } catch (error) {
    throw new Error("Failed to fetch reviews");
  }
};

export const submitReview = async (reviewData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newReview = {
      id: Date.now(),
      ...reviewData,
      date: new Date().toISOString().split('T')[0]
    };
    return { success: true, data: newReview };
  } catch (error) {
    throw new Error("Failed to submit review");
  }
};

// Profile APIs
export const updateProfile = async (profileData) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      success: true, 
      data: { 
        message: "Profile updated successfully",
        profile: profileData 
      } 
    };
  } catch (error) {
    throw new Error("Failed to update profile");
  }
};

export default api;
