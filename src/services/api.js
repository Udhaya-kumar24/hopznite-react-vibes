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
    success: true,
    data: {
      token: "dummy_jwt_token_" + Date.now(),
      user: { 
        id: 1, 
        name: "Test User", 
        email: credentials.email,
        role: role 
      }
    }
  };
};

export const registerUser = async (userData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    data: {
      token: "dummy_jwt_token_" + Date.now(),
      user: { 
        id: Date.now(), 
        name: userData.name, 
        email: userData.email,
        role: userData.role 
      }
    }
  };
};

// DJ APIs
export const getDJList = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: [
      { 
        id: 1, 
        name: "DJ Sonic", 
        genre: "EDM",
        genres: ["EDM", "House", "Techno"],
        rating: 4.8, 
        price: 25000,
        location: "Mumbai",
        available: true,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        bio: "Professional DJ with 8+ years of experience in electronic dance music."
      },
      { 
        id: 2, 
        name: "DJ Blaze", 
        genre: "Hip-hop", 
        genres: ["Hip-hop", "R&B"],
        rating: 4.6,
        price: 20000,
        location: "Delhi",
        available: false,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        bio: "Hip-hop specialist known for high-energy performances and crowd engagement."
      },
      { 
        id: 3, 
        name: "DJ Luna", 
        genre: "House",
        genres: ["House", "Deep House", "Progressive"],
        rating: 4.9,
        price: 30000,
        location: "Bangalore",
        available: true,
        image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400",
        bio: "House music expert with a unique style that keeps the dance floor packed."
      },
      { 
        id: 4, 
        name: "DJ Storm", 
        genre: "Techno",
        genres: ["Techno", "Minimal"],
        rating: 4.7,
        price: 28000,
        location: "Chennai",
        available: false,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        bio: "Techno master creating immersive electronic experiences."
      },
      { 
        id: 5, 
        name: "DJ Vibe", 
        genre: "Trance",
        genres: ["Trance", "Psy-Trance"],
        rating: 4.8,
        price: 32000,
        location: "Hyderabad",
        available: true,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        bio: "Trance specialist taking audiences on melodic journeys."
      },
      { 
        id: 6, 
        name: "DJ Retro", 
        genre: "Bollywood",
        genres: ["Bollywood", "Retro", "Commercial"],
        rating: 4.5,
        price: 22000,
        location: "Chennai",
        available: true,
        image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400",
        bio: "Bollywood beats specialist for high-energy parties."
      },
      { 
        id: 7, 
        name: "DJ Ace", 
        genre: "R&B", 
        genres: ["R&B", "Hip-hop", "Soul"],
        rating: 4.7,
        price: 26000,
        location: "Mumbai",
        available: false,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        bio: "Smooth R&B grooves for a classy night."
      },
      { 
        id: 8, 
        name: "DJ Flash", 
        genre: "EDM",
        genres: ["EDM", "Big Room", "Electro House"],
        rating: 4.9,
        price: 35000,
        location: "Delhi",
        available: true,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        bio: "High-octane EDM DJ for the biggest festivals."
      },
      { 
        id: 9, 
        name: "DJ Queen", 
        genre: "Hip-hop", 
        genres: ["Hip-hop", "Trap"],
        rating: 4.8,
        price: 29000,
        location: "Chennai",
        available: true,
        image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400",
        bio: "The queen of hip-hop, bringing fresh beats."
      },
      { 
        id: 10, 
        name: "DJ Zenith", 
        genre: "Techno",
        genres: ["Techno", "Industrial"],
        rating: 4.6,
        price: 27000,
        location: "Bangalore",
        available: false,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        bio: "Deep and dark techno journeys."
      }
    ]
  };
};

export const getDJById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const djsResponse = await getDJList();
  if (!djsResponse.success) {
    return { success: false, data: null };
  }
  const dj = djsResponse.data.find(d => d.id === parseInt(id));

  if (!dj) {
    return { success: false, data: null };
  }

  // Add more detailed mock data for the profile page
  const detailedDj = {
    ...dj,
    experience: "8+ years",
    equipment: "Pioneer DJ, Sound System, Lighting",
    availability: ["Friday", "Saturday", "Sunday"],
    reviews: [
      { id: 1, name: "Club Infinity", rating: 5, comment: "Amazing performance! The crowd loved it." },
      { id: 2, name: "Bar Revolution", rating: 4, comment: "Great music selection and energy." }
    ]
  };
  
  return {
    success: true,
    data: detailedDj
  };
};

// Venue APIs
export const getVenues = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: [
      { 
        id: 1, 
        name: "Skyline Lounge", 
        location: "Bandra, Mumbai", 
        capacity: 250,
        type: "Nightclub",
        image: "https://images.unsplash.com/photo-1571266028243-d220c2dc4bbe?w=600",
        description: "Premier nightclub in the heart of Mumbai offering world-class entertainment.",
        rating: 4.8
      },
      { 
        id: 2, 
        name: "Beach Club", 
        location: "Connaught Place, Delhi", 
        capacity: 180,
        type: "Bar & Lounge",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600",
        description: "Trendy bar and lounge with innovative cocktails and live music.",
        rating: 4.6
      },
      { 
        id: 3, 
        name: "Urban Beats", 
        location: "Koramangala, Bangalore", 
        capacity: 120,
        type: "Rooftop Bar",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600",
        description: "Rooftop bar with stunning city views and premium dining experience.",
        rating: 4.7
      },
      { 
        id: 4, 
        name: "Rhythm Bar", 
        location: "T. Nagar, Chennai", 
        capacity: 200,
        type: "Music Bar",
        image: "https://images.unsplash.com/photo-1571266028243-d220c2dc4bbe?w=600",
        description: "Music-focused bar with excellent acoustics and live performances.",
        rating: 4.5
      },
      { 
        id: 5, 
        name: "The Cave", 
        location: "Jubilee Hills, Hyderabad", 
        capacity: 150,
        type: "Underground Club",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600",
        description: "An underground club experience with a focus on techno and house music.",
        rating: 4.9
      }
    ]
  };
};

// Event APIs
export const getEvents = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: [
      { 
        id: 1, 
        title: "Bounce Beats Party", 
        venue: "Skyline Lounge", 
        location: "Mumbai",
        date: "June 20, 2025",
        time: "9:00 PM",
        price: 1500,
        genre: "EDM",
        dj: "DJ Sonic",
        status: "available",
        image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=600"
      },
      { 
        id: 2, 
        title: "Urban Beat Night", 
        venue: "Beach Club", 
        location: "Delhi",
        date: "June 28, 2025",
        time: "8:30 PM",
        price: 1200,
        genre: "Hip-Hop",
        dj: "DJ Blaze",
        status: "available",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600"
      },
      { 
        id: 3, 
        title: "Bollywood Bash", 
        venue: "Urban Beats", 
        location: "Bangalore",
        date: "July 05, 2025",
        time: "10:00 PM",
        price: 2000,
        genre: "Bollywood",
        dj: "DJ Luna",
        status: "sold-out",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600"
      },
      { 
        id: 4, 
        title: "Retro Night", 
        venue: "Rhythm Bar", 
        location: "Chennai",
        date: "July 12, 2025",
        time: "9:30 PM",
        price: 1800,
        genre: "Retro",
        dj: "DJ Storm",
        status: "available",
        image: "https://images.unsplash.com/photo-1571266028243-d220c2dc4bbe?w=600"
      },
      { 
        id: 5, 
        title: "Trance Nation", 
        venue: "Skyline Lounge", 
        location: "Mumbai",
        date: "July 19, 2025",
        time: "11:00 PM",
        price: 2500,
        genre: "Trance",
        dj: "DJ Vibe",
        status: "available",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600"
      },
      { 
        id: 6, 
        title: "Deep House Revolution", 
        venue: "Urban Beats", 
        location: "Bangalore",
        date: "July 26, 2025",
        time: "8:00 PM",
        price: 1600,
        genre: "House",
        dj: "DJ Luna",
        status: "available",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600"
      }
    ]
  };
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

// DJ Hiring Request APIs
export const sendDJHireRequest = async (requestData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newRequest = {
    id: "REQ_" + Date.now(),
    djId: requestData.djId,
    pubOwnerId: requestData.pubOwnerId,
    venueId: requestData.venueId,
    eventDate: requestData.eventDate,
    eventTime: requestData.eventTime,
    duration: requestData.duration,
    budget: requestData.budget,
    eventType: requestData.eventType,
    specialRequests: requestData.specialRequests,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  
  return {
    success: true,
    data: newRequest,
    message: "Hire request sent successfully to DJ"
  };
};

export const getDJHireRequests = async (djId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: [
      {
        id: "REQ_001",
        djId: djId,
        pubOwnerId: "PUB_001",
        pubOwnerName: "Club Infinity",
        venueId: "VEN_001",
        venueName: "Skyline Lounge",
        eventDate: "2024-07-15",
        eventTime: "21:00",
        duration: "4 hours",
        budget: 25000,
        eventType: "Weekend Party",
        specialRequests: "EDM and House music preferred",
        status: "pending",
        createdAt: "2024-06-15T10:30:00Z"
      },
      {
        id: "REQ_002",
        djId: djId,
        pubOwnerId: "PUB_002",
        pubOwnerName: "Bar Revolution",
        venueId: "VEN_002",
        venueName: "Urban Beats",
        eventDate: "2024-07-20",
        eventTime: "20:30",
        duration: "5 hours",
        budget: 30000,
        eventType: "Birthday Celebration",
        specialRequests: "Mix of Bollywood and International hits",
        status: "pending",
        createdAt: "2024-06-16T14:15:00Z"
      }
    ]
  };
};

export const respondToDJHireRequest = async (requestId, response, djId) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    data: {
      requestId: requestId,
      djId: djId,
      status: response, // "accepted" or "rejected"
      respondedAt: new Date().toISOString()
    },
    message: `Request ${response} successfully`
  };
};

export const getPubOwnerSentRequests = async (pubOwnerId) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: [
      {
        id: "REQ_001",
        djId: "1",
        djName: "DJ Sonic",
        pubOwnerId: pubOwnerId,
        venueId: "VEN_001",
        venueName: "Skyline Lounge",
        eventDate: "2024-07-15",
        eventTime: "21:00",
        duration: "4 hours",
        budget: 25000,
        eventType: "Weekend Party",
        status: "pending",
        createdAt: "2024-06-15T10:30:00Z"
      },
      {
        id: "REQ_003",
        djId: "2",
        djName: "DJ Blaze",
        pubOwnerId: pubOwnerId,
        venueId: "VEN_002",
        venueName: "Urban Beats",
        eventDate: "2024-07-25",
        eventTime: "22:00",
        duration: "6 hours",
        budget: 35000,
        eventType: "Club Night",
        status: "accepted",
        createdAt: "2024-06-17T09:45:00Z"
      }
    ]
  };
};

export default api;
