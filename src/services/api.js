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
  else if (credentials.email.includes("eventmanagement")) role = "EventManagement";

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
  
  // Determine role based on email or provided role
  let role = userData.role || "Customer";
  if (userData.email && userData.email.includes("dj")) role = "DJ";
  else if (userData.email && userData.email.includes("pub")) role = "PubOwner";
  else if (userData.email && userData.email.includes("admin")) role = "Admin";
  else if (userData.email && userData.email.includes("eventmanagement")) role = "EventManagement";

  return {
    success: true,
    data: {
      token: "dummy_jwt_token_" + Date.now(),
      user: { 
        id: Date.now(), 
        name: userData.name, 
        email: userData.email,
        role: role 
      }
    }
  };
};

export const fetchFilterCountries = async () => {
  //   return new Promise((resolve, reject) => {
  //   api
  //     .post(`${config.SERVER_URL}/fetch_all_reciepe`)
  //     .then((response) => {
  //       resolve(response.data)
  //     })
  //     .catch((error) => {
  //       reject(error?.response) // Reject with error data
  //     })
  // })

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    data: {
      "India": [
            {'label':'Chennai', 'value':'Chennai'},
            {'label':'Bangalore', 'value':'Bangalore'},
            {'label':'Hydrabad', 'value':'Hydrabad'},
            {'label':'Delhi', 'value':'Delhi'}
      ],
      "USA": [
            {'label':'USA1', 'value':'USA1'}, 
            {'label':'USA2', 'value':'USA2'},
            {'label':'USA3', 'value':'USA3'},
            {'label':'USA4', 'value':'USA4'}
      ],
    }
  };
}

// Dynamic Filter APIs for DJs
export const getDJFilterOptions = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
      genres: ['House', 'EDM', 'Techno', 'Hip Hop', 'R&B', 'Bollywood', 'Commercial', 'Progressive', 'Trance', 'Psy-Trance', 'Drum & Bass', 'Jungle', 'Deep House', 'Melodic', 'World Music', 'Fusion', 'Electro', 'Synthwave'],
      locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'],
      availability: ['all', 'available', 'busy']
    }
  };
};

// Dynamic Filter APIs for Events
export const getEventFilterOptions = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
      categories: ['All', 'Upcoming', 'This Weekend', 'Trending', 'Live Music', 'DJ Night', 'Karaoke', 'Comedy', 'Dance', 'Party'],
      locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'],
      priceRanges: ['Free', 'Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', '₹2000+'],
      status: ['all', 'upcoming', 'ongoing', 'completed']
    }
  };
};

// Dynamic Filter APIs for Venues
export const getVenueFilterOptions = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: {
      types: ['Restaurant', 'Bar', 'Club', 'Pub', 'Lounge', 'Cafe', 'Nightclub', 'Brewery', 'Wine Bar', 'Sports Bar'],
      locations: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'],
      priceRanges: ['Budget', 'Mid-range', 'Premium', 'Luxury'],
      ratings: ['4.5+', '4.0+', '3.5+', '3.0+']
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
        bio: "Professional DJ with 8+ years of experience in electronic dance music.",
        role: "DJ"
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
        bio: "Hip-hop specialist known for high-energy performances and crowd engagement.",
        role: "DJ"
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
        bio: "House music expert with a unique style that keeps the dance floor packed.",
        role: "DJ"
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
        bio: "Techno master creating immersive electronic experiences.",
        role: "DJ"
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
        bio: "Trance specialist taking audiences on melodic journeys.",
        role: "DJ"
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
        bio: "Bollywood beats specialist for high-energy parties.",
        role: "DJ"
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
        bio: "Smooth R&B grooves for a classy night.",
        role: "DJ"
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
        bio: "High-octane EDM DJ for the biggest festivals.",
        role: "DJ"
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
        bio: "The queen of hip-hop, bringing fresh beats.",
        role: "DJ"
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
        bio: "Deep and dark techno journeys.",
        role: "DJ"
      }
    ]
  };
};

export const getDJById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
    // Add more detailed mock data for the profile page
  const detailedDj = {
    id: 10, 
    name: "DJ Zenith", 
    genre: "Techno",
    genres: ["Techno", "Industrial"],
    rating: 4.6,
    price: 27000,
    location: "Bangalore",
    available: false,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    bio: "Deep and dark techno journeys.",
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
        date: "June 12, 2025",
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

export const getEventsById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    data: {
      id: 1,
      description: "The biggest electronic dance music event of the month featuring top DJs and incredible vibes. Get ready for a night of non-stop dancing, stunning visuals, and a sound system that will blow you away. This is one party you don't want to miss!",
      title: "Saturday Night Fever",
      date: "June 15, 2024",
      time: "9:00 PM",
      venue: "Club Infinity",
      location: "Bandra, Mumbai",
      dj: "DJ Sonic",
      dj_img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      genre: "EDM",
      image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=600",
      ticketPrice: 1500,
      capacity: 250,
      soldTickets: 180,
      features: ["Live DJ Performance", "Premium Sound System", "Dance Floor", "Bar & Cocktails", "VIP Section"],
      ageLimit: "21+",
      dressCode: "Smart Casual",
    }
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
  await new Promise(resolve => setTimeout(resolve, 600));
  return {
    success: true,
    data: {
      ...reviewData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
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

// Event Management Companies API
export const getEventManagementCompanies = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    data: [
      { 
        id: 1,
        name: 'EventPro', 
        rating: 4.8, 
        description: 'Full-service event management for corporate and private events', 
        events: '120 events organized', 
        avatar: 'E' 
      },
      { 
        id: 2,
        name: 'Celebration Masters', 
        rating: 4.7, 
        description: 'Specializing in weddings and large-scale celebrations', 
        events: '85 events organized', 
        avatar: 'C' 
      },
      { 
        id: 3,
        name: 'NightLife Events', 
        rating: 4.9, 
        description: 'Experts in club events and music festivals', 
        events: '150 events organized', 
        avatar: 'N' 
      },
      { 
        id: 4,
        name: 'Corporate Connect', 
        rating: 4.6, 
        description: 'Business conferences and corporate entertainment', 
        events: '95 events organized', 
        avatar: 'C' 
      },
      { 
        id: 5,
        name: 'Gala Planners', 
        rating: 4.8, 
        description: 'High-end galas and charity events.', 
        events: '70 events organized', 
        avatar: 'G' 
      }
    ]
  };
};

// Testimonials API
export const getTestimonials = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    data: [
      {
        name: "Rahul Kumar",
        role: "DJ",
        rating: 5,
        text: "Hopznite has transformed my career as a DJ. I'm getting more bookings than ever, and the platform makes it easy to manage my schedule and connect with venues."
      },
      {
        name: "Sanjay Patel",
        role: "Venue Owner",
        rating: 5,
        text: "Finding the right DJ for our events used to be a nightmare. With Hopznite, we can browse profiles, check availability, and book instantly. It's been a game-changer for our business."
      },
      {
        name: "Priya U",
        role: "Customer",
        rating: 5,
        text: "The premium membership is worth every penny. I get access to exclusive events and can book my favorite DJs directly. Hopznite has completely changed how I discover and enjoy music events."
      }
    ]
  };
};

export const getVenueById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const venues = {
      id: 1,
      name: "Club Infinity",
      location: "Bandra, Mumbai",
      capacity: 250,
      type: "Nightclub",
      image: "https://images.unsplash.com/photo-1571266028243-d220c2dc4bbe?w=600",
      description: "Premier nightclub in the heart of Mumbai offering world-class entertainment and dining.",
      amenities: ["Bar", "Dance Floor", "VIP Section", "Sound System", "Parking"],
      hours: {
        weekdays: "7:00 PM - 2:00 AM",
        weekends: "8:00 PM - 3:00 AM"
      },
      contact: {
        phone: "+91 9876543210",
        email: "info@clubinfinity.com",
        manager: "Ravi Sharma"
      },
      upcomingEvents: [
        { id: 1, name: "Saturday Night Fever", date: "June 15, 2024", dj: "DJ Sonic", url: '/events/1' },
        { id: 2, name: "Electronic Vibes", date: "June 22, 2024", dj: "DJ Blaze"}
      ]
  };
  
  return { 
    success: true, 
    data: venues || null
  };
};

export const getEventManagementCompanyById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const companies = {
    1: {
      id: 1,
      name: "EventPro Management",
      location: "Mumbai, India",
      type: "Full-Service Event Management",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
      description: "EventPro is a leading event management company specializing in corporate and private events, weddings, and large-scale celebrations.",
      services: ["Corporate Events", "Weddings", "Concerts", "Private Parties", "Product Launches"],
      contact: {
        phone: "+91 9876543220",
        email: "info@eventpro.com",
        manager: "Sarah Johnson"
      },
      upcomingEvents: [
        { id: 1, name: "Corporate Gala", date: "July 10, 2024", venue: "Grand Ballroom" },
        { id: 2, name: "Wedding Extravaganza", date: "August 2, 2024", venue: "Beachside Resort" }
      ]
    }
  };
  
  return {
    success: true,
    data: companies[id] || null
  };
};

// DJ Profile API functions
// --- DJ DASHBOARD DUMMY DATA ---

// Wallet state is now stateless and dummy data is defined inside each function

export const getDJWallet = async (djId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const dummyWallet = {
    balance: 12000,
    transactions: [
      { id: 1, type: 'credit', amount: 5000, date: '2024-06-10', description: 'Booking Payment - Club Infinity' },
      { id: 2, type: 'debit', amount: 2000, date: '2024-06-12', description: 'Withdrawal to Bank' },
      { id: 3, type: 'credit', amount: 7000, date: '2024-06-15', description: 'Booking Payment - Skybar Lounge' },
    ]
  };
  return { success: true, data: { ...dummyWallet } };
};

export const updateDJWallet = async (djId, action, amount) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  // Simulate a wallet update and return new dummy data
  let newBalance = 12000;
  if (action === 'add') newBalance += amount;
  else if (action === 'subtract' || action === 'debit') newBalance -= amount;
  const transaction = {
    id: Date.now(),
    type: action === 'add' ? 'credit' : 'debit',
    amount,
    date: new Date().toISOString().slice(0, 10),
    description: action === 'add' ? 'Wallet Top-up' : 'Withdrawal to Bank'
  };
  // Return the new balance and the new transaction
  return { success: true, data: { newBalance, transaction } };
};

export const getDJProfile = async (djId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const dummyPerformanceImages = [
    '/uploads/dj/1/performance1.jpg',
    '/uploads/dj/1/performance2.jpg',
    '/uploads/dj/1/performance3.jpg'
  ];
  const dummyDJProfile = {
    id: djId,
    name: 'DJ Alex Thunder',
    bio: 'Professional DJ with 8+ years of experience in electronic music, house, and techno.',
    genres: ['House', 'Techno', 'Electronic', 'Progressive'],
    topGenre: 'House',
    experience: 8,
    hourlyRate: 5000,
    eventRate: 25000,
    profileImage: '/placeholder.svg',
    performanceImages: dummyPerformanceImages,
    phone: '+91 9876543210',
    email: 'alex.thunder@email.com',
    location: 'Mumbai, India',
    rating: 4.8,
    totalBookings: 12,
    profileViews: 234,
    socialLinks: {
      soundcloud: 'https://soundcloud.com/alexthunder',
      youtube: 'https://youtube.com/@alexthunder',
      instagram: 'https://instagram.com/alexthunder'
    }
  };
  return { success: true, data: dummyDJProfile };
};

export const updateDJProfile = async (djId, profileData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const dummyPerformanceImages = [
    '/uploads/dj/1/performance1.jpg',
    '/uploads/dj/1/performance2.jpg',
    '/uploads/dj/1/performance3.jpg'
  ];
  const dummyDJProfile = {
    id: djId,
    name: 'DJ Alex Thunder',
    bio: 'Professional DJ with 8+ years of experience in electronic music, house, and techno.',
    genres: ['House', 'Techno', 'Electronic', 'Progressive'],
    topGenre: 'House',
    experience: 8,
    hourlyRate: 5000,
    eventRate: 25000,
    profileImage: '/placeholder.svg',
    performanceImages: dummyPerformanceImages,
    phone: '+91 9876543210',
    email: 'alex.thunder@email.com',
    location: 'Mumbai, India',
    rating: 4.8,
    totalBookings: 12,
    profileViews: 234,
    socialLinks: {
      soundcloud: 'https://soundcloud.com/alexthunder',
      youtube: 'https://youtube.com/@alexthunder',
      instagram: 'https://instagram.com/alexthunder'
    }
  };
  return { success: true, data: { ...dummyDJProfile, ...profileData, id: djId, updatedAt: new Date().toISOString() } };
};

export const getDJAvailability = async (djId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const dummyAvailability = [
    { date: '2024-06-15', status: 'available', time: '20:00-02:00' },
    { date: '2024-06-16', status: 'booked', time: '21:00-03:00' },
    { date: '2024-06-20', status: 'available', time: '19:00-01:00' },
    { date: '2024-06-22', status: 'available', time: '22:00-04:00' },
    { date: '2024-06-25', status: 'available', time: '20:00-02:00' },
    { date: '2024-06-28', status: 'busy', time: '18:00-23:00' },
    { date: '2024-07-01', status: 'available', time: '21:00-03:00' }
  ];
  return { success: true, data: [...dummyAvailability] };
};

export const updateDJAvailability = async (djId, availabilityData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Just echo back the data for now
  return { success: true, data: [...availabilityData] };
};

export const getDJBookingRequests = async (djId, page = 1, pageSize = 10) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const dummyBookingRequests = [
    {
      id: 1,
      venueName: 'Club Infinity',
      date: '2024-06-22',
      time: '22:00-04:00',
      price: 30000,
      status: 'pending',
      location: 'Bandra, Mumbai',
      eventType: 'Saturday Night Party',
      venueId: 1,
      createdAt: '2024-06-18T10:00:00Z',
      contactPerson: 'Ravi Sharma',
      description: 'High-energy night club event expecting 200+ guests'
    },
    // ... (repeat or generate more dummy data for demonstration)
    ...Array.from({ length: 40 }, (_, i) => ({
      id: i + 2,
      venueName: `Venue ${i + 2}`,
      date: '2024-07-01',
      time: '20:00-02:00',
      price: 20000 + i * 1000,
      status: i % 3 === 0 ? 'pending' : i % 3 === 1 ? 'accepted' : 'declined',
      location: `City ${i + 2}`,
      eventType: `Event Type ${i + 2}`,
      venueId: i + 2,
      createdAt: '2024-06-20T10:00:00Z',
      contactPerson: `Contact ${i + 2}`,
      description: `Description for event ${i + 2}`
    }))
  ];
  const total = dummyBookingRequests.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = pageSize === 'all' ? dummyBookingRequests : dummyBookingRequests.slice(start, end);
  return { success: true, data: paginated, total };
};

export const respondToBookingRequest = async (bookingId, response) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  // Simulate updating booking status
  const dummyBookingRequests = [
    {
      id: 1,
      venueName: 'Club Infinity',
      date: '2024-06-22',
      time: '22:00-04:00',
      price: 30000,
      status: 'pending',
      location: 'Bandra, Mumbai',
      eventType: 'Saturday Night Party',
      venueId: 1,
      createdAt: '2024-06-18T10:00:00Z',
      contactPerson: 'Ravi Sharma',
      description: 'High-energy night club event expecting 200+ guests'
    },
    {
      id: 2,
      venueName: 'Skybar Lounge',
      date: '2024-06-25',
      time: '20:00-02:00',
      price: 25000,
      status: 'pending',
      location: 'Juhu, Mumbai',
      eventType: 'Weekend Special',
      venueId: 2,
      createdAt: '2024-06-19T14:30:00Z',
      contactPerson: 'Priya Patel',
      description: 'Rooftop party with sunset vibes and city views'
    },
    {
      id: 3,
      venueName: 'Underground Club',
      date: '2024-06-30',
      time: '23:00-05:00',
      price: 35000,
      status: 'accepted',
      location: 'Andheri, Mumbai',
      eventType: 'Techno Night',
      venueId: 5,
      createdAt: '2024-06-15T09:00:00Z',
      contactPerson: 'Amit Kumar',
      description: 'Underground techno event for serious music lovers'
    },
    {
      id: 4,
      venueName: 'EventPro Management',
      date: '2024-07-05',
      time: '19:00-01:00',
      price: 45000,
      status: 'pending',
      location: 'Powai, Mumbai',
      eventType: 'Corporate Gala',
      eventManagementId: 1,
      createdAt: '2024-06-20T16:00:00Z',
      contactPerson: 'Sarah Johnson',
      description: 'Premium corporate event with international guests'
    }
  ];
  const idx = dummyBookingRequests.findIndex(b => b.id === bookingId);
  if (idx !== -1) {
    dummyBookingRequests[idx] = {
      ...dummyBookingRequests[idx],
      status: response
    };
    return { success: true, data: { ...dummyBookingRequests[idx] } };
  } else {
    return { success: false, error: 'Booking not found' };
  }
};

export const getDJReviews = async (djId) => {
  await new Promise(resolve => setTimeout(resolve, 350));
  const dummyReviews = [
    {
      id: 1,
      venue: 'Club Revolution',
      venueId: 3,
      rating: 5,
      comment: 'Amazing performance! The crowd loved every minute. Alex really knows how to read the room and keep the energy up all night.',
      date: '2024-06-10',
      eventDate: '2024-06-08',
      reviewerName: 'Club Manager - Rohit Singh'
    },
    {
      id: 2,
      venue: 'Rooftop Bar',
      venueId: 4,
      rating: 4,
      comment: 'Great music selection and professional setup. Would definitely book again for future events.',
      date: '2024-06-05',
      eventDate: '2024-06-03',
      reviewerName: 'Event Coordinator - Meera Joshi'
    },
    {
      id: 3,
      venue: 'Underground Club',
      venueId: 5,
      rating: 5,
      comment: 'Incredible techno set! The energy was through the roof. Best DJ we\'ve had in months.',
      date: '2024-05-28',
      eventDate: '2024-05-25',
      reviewerName: 'Venue Owner - Vikram Malhotra'
    },
    {
      id: 4,
      venue: 'Skyline Lounge',
      venueId: 1,
      rating: 4,
      comment: 'Professional and punctual. Great communication throughout the event planning process.',
      date: '2024-05-20',
      eventDate: '2024-05-18',
      reviewerName: 'Event Manager - Kavya Reddy'
    },
    {
      id: 5,
      venue: 'Beach Club',
      venueId: 2,
      rating: 5,
      comment: 'Outstanding performance! Alex created the perfect atmosphere for our beachside event.',
      date: '2024-05-15',
      eventDate: '2024-05-12',
      reviewerName: 'Club Manager - Arjun Nair'
    }
  ];
  return { success: true, data: [...dummyReviews] };
};

export const getDJStats = async (djId, month = 'thisMonth') => {
  await new Promise(resolve => setTimeout(resolve, 250));
  let stats;
  if (month === 'thisMonth') {
    stats = {
      onTimePerformance: 95,
      totalEvents: 24,
      clientRetention: 78,
      earnings: 18500,
      totalBookings: 12,
      rating: 4.8,
      totalReviews: 25,
      monthlyEarnings: 18500,
      profileViews: 234,
      weeklyViews: 47,
      acceptanceRate: 85,
      responseTime: '2 hours',
      completedEvents: 28,
      repeatClients: 8,
      averageEventDuration: '4 hours',
      topGenreBookings: {
        'House': 12,
        'Techno': 8,
        'Electronic': 6,
        'Progressive': 2
      }
    };
  } else if (month === 'lastMonth') {
    stats = {
      onTimePerformance: 92,
      totalEvents: 18,
      clientRetention: 74,
      earnings: 14200,
      totalBookings: 10,
      rating: 4.7,
      totalReviews: 22,
      monthlyEarnings: 14200,
      profileViews: 210,
      weeklyViews: 39,
      acceptanceRate: 82,
      responseTime: '2.5 hours',
      completedEvents: 20,
      repeatClients: 6,
      averageEventDuration: '3.8 hours',
      topGenreBookings: {
        'House': 8,
        'Techno': 6,
        'Electronic': 4,
        'Progressive': 1
      }
    };
  } else if (/^\d{4}-\d{2}$/.test(month)) {
    // Custom month in format YYYY-MM
    stats = {
      onTimePerformance: 88,
      totalEvents: 10,
      clientRetention: 65,
      earnings: 9000,
      totalBookings: 5,
      rating: 4.5,
      totalReviews: 12,
      monthlyEarnings: 9000,
      profileViews: 120,
      weeklyViews: 20,
      acceptanceRate: 75,
      responseTime: '3.5 hours',
      completedEvents: 9,
      repeatClients: 2,
      averageEventDuration: '3 hours',
      topGenreBookings: {
        'House': 3,
        'Techno': 2,
        'Electronic': 1,
        'Progressive': 0
      }
    };
  } else {
    stats = {
      onTimePerformance: 90,
      totalEvents: 15,
      clientRetention: 70,
      earnings: 12000,
      totalBookings: 8,
      rating: 4.6,
      totalReviews: 18,
      monthlyEarnings: 12000,
      profileViews: 180,
      weeklyViews: 30,
      acceptanceRate: 80,
      responseTime: '3 hours',
      completedEvents: 15,
      repeatClients: 5,
      averageEventDuration: '3.5 hours',
      topGenreBookings: {
        'House': 6,
        'Techno': 5,
        'Electronic': 3,
        'Progressive': 1
      }
    };
  }
  return { success: true, data: { ...stats } };
};

export const updateDJPricing = async (djId, pricing) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate pricing update
  const dummyPerformanceImages = [
    '/uploads/dj/1/performance1.jpg',
    '/uploads/dj/1/performance2.jpg',
    '/uploads/dj/1/performance3.jpg'
  ];
  const dummyDJProfile = {
    id: djId,
    name: 'DJ Alex Thunder',
    bio: 'Professional DJ with 8+ years of experience in electronic music, house, and techno.',
    genres: ['House', 'Techno', 'Electronic', 'Progressive'],
    topGenre: 'House',
    experience: 8,
    hourlyRate: pricing.hourlyRate,
    eventRate: pricing.eventRate,
    profileImage: '/placeholder.svg',
    performanceImages: dummyPerformanceImages,
    phone: '+91 9876543210',
    email: 'alex.thunder@email.com',
    location: 'Mumbai, India',
    rating: 4.8,
    totalBookings: 12,
    profileViews: 234,
    socialLinks: {
      soundcloud: 'https://soundcloud.com/alexthunder',
      youtube: 'https://youtube.com/@alexthunder',
      instagram: 'https://instagram.com/alexthunder'
    }
  };
  return { success: true, data: dummyDJProfile };
};

export const uploadDJMedia = async (djId, file, type) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate a media upload and return a dummy URL
  const mediaUrl = `/uploads/dj/${djId}/${type}_${Date.now()}.jpg`;
  return { success: true, data: { mediaUrl } };
};

export const updatePubProfile = async (pubId, profileData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    data: {
      ...profileData,
      id: pubId,
      updatedAt: new Date().toISOString(),
    }
  };
};

export const createEvent = async (eventData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    success: true,
    data: {
      ...eventData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }
  };
};

export default api;
