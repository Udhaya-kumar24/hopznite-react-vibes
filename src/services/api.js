
import axios from "axios";

const api = axios.create({
  baseURL: "https://dummy.hopznite.api",
  timeout: 10000,
});

// Auth APIs
export const loginUser = async (credentials) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Determine role based on email
  let role = "Customer";
  if (credentials.email.includes("dj")) role = "DJ";
  else if (credentials.email.includes("pub")) role = "PubOwner";
  else if (credentials.email.includes("admin")) role = "Admin";

  return {
    token: "dummy_jwt_token_" + Date.now(),
    user: { 
      id: 1, 
      name: "Test User", 
      email: credentials.email,
      role: role 
    }
  };
};

export const registerUser = async (userData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    token: "dummy_jwt_token_" + Date.now(),
    user: { 
      id: Date.now(), 
      name: userData.name, 
      email: userData.email,
      role: userData.role 
    }
  };
};

// DJ APIs
export const getDJList = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { 
      id: 1, 
      name: "DJ Sonic", 
      genre: "EDM", 
      rating: 4.8, 
      price: 25000,
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      bio: "Professional DJ with 8+ years of experience in electronic dance music."
    },
    { 
      id: 2, 
      name: "DJ Blaze", 
      genre: "Hip-hop", 
      rating: 4.6,
      price: 20000,
      location: "Delhi",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      bio: "Hip-hop specialist known for high-energy performances and crowd engagement."
    },
    { 
      id: 3, 
      name: "DJ Luna", 
      genre: "House", 
      rating: 4.9,
      price: 30000,
      location: "Bangalore",
      image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400",
      bio: "House music expert with a unique style that keeps the dance floor packed."
    }
  ];
};

// Venue APIs
export const getVenues = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { 
      id: 1, 
      name: "Club Infinity", 
      location: "Bandra, Mumbai", 
      capacity: 250,
      type: "Nightclub",
      image: "https://images.unsplash.com/photo-1571266028243-d220c2dc4bbe?w=600",
      description: "Premier nightclub in the heart of Mumbai offering world-class entertainment."
    },
    { 
      id: 2, 
      name: "Bar Revolution", 
      location: "Connaught Place, Delhi", 
      capacity: 180,
      type: "Bar & Lounge",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600",
      description: "Trendy bar and lounge with innovative cocktails and live music."
    },
    { 
      id: 3, 
      name: "Skybar Rooftop", 
      location: "Koramangala, Bangalore", 
      capacity: 120,
      type: "Rooftop Bar",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600",
      description: "Rooftop bar with stunning city views and premium dining experience."
    }
  ];
};

// Event APIs
export const getEvents = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    { 
      id: 1, 
      title: "Saturday Night Fever", 
      venue: "Club Infinity", 
      location: "Mumbai",
      date: "June 15, 2024",
      price: 1500,
      genre: "EDM",
      dj: "DJ Sonic",
      status: "available",
      image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=600"
    },
    { 
      id: 2, 
      title: "Hip-Hop Night", 
      venue: "Bar Revolution", 
      location: "Delhi",
      date: "June 22, 2024",
      price: 1200,
      genre: "Hip-Hop",
      dj: "DJ Blaze",
      status: "available",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600"
    },
    { 
      id: 3, 
      title: "House Music Paradise", 
      venue: "Skybar Rooftop", 
      location: "Bangalore",
      date: "June 29, 2024",
      price: 2000,
      genre: "House",
      dj: "DJ Luna",
      status: "sold-out",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600"
    }
  ];
};

// Booking APIs
export const bookDJ = async (djId, eventDetails) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    bookingId: "BOOK_" + Date.now(),
    djId: djId,
    status: "pending",
    message: "Booking request sent successfully"
  };
};

export const getBookings = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return [
    {
      id: 1,
      djName: "DJ Sonic",
      venue: "Club Infinity",
      date: "June 15, 2024",
      status: "confirmed",
      amount: 25000
    },
    {
      id: 2,
      djName: "DJ Blaze",
      venue: "Bar Revolution",
      date: "June 22, 2024",
      status: "pending",
      amount: 20000
    }
  ];
};

// Review APIs
export const getReviews = async (djId) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return [
    {
      id: 1,
      customerName: "John Doe",
      rating: 5,
      comment: "Amazing performance! The crowd loved it.",
      date: "May 20, 2024"
    },
    {
      id: 2,
      customerName: "Jane Smith",
      rating: 4,
      comment: "Great music selection and energy.",
      date: "May 15, 2024"
    }
  ];
};

export const addReview = async (djId, reviewData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: Date.now(),
    ...reviewData,
    date: new Date().toISOString()
  };
};

// Profile APIs
export const updateProfile = async (userId, profileData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    ...profileData,
    id: userId,
    updatedAt: new Date().toISOString()
  };
};

export default api;
