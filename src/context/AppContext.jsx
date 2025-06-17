import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { getDJList, getEvents, getVenues } from '../services/api';

// Initial state
const initialState = {
  // User preferences
  selectedCountry: 'India',
  selectedCity: 'Chennai',
  djSearchTerm: '',
  venueSearchTerm: '',
  eventSearchTerm: '',
  selectedGenre: 'all',
  selectedAvailability: 'all',
  eventFilter: 'Upcoming',

  // Data states
  featuredDJs: [],
  upcomingEvents: [],
  topVenues: [],
  loading: false,
  error: null,

  // UI states
  isMenuOpen: false,
  isSearchOpen: false,
  isFilterOpen: false,
  currentPage: 'home',
  theme: 'dark',

  // Pagination
  currentPageNumber: 1,
  itemsPerPage: 10,
  totalPages: 1,

  // Notifications
  notifications: [],
  unreadNotifications: 0,

  // User session
  isAuthenticated: false,
  user: null,
  userRole: null, // 'admin', 'dj', 'venue', 'user'
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_FEATURED_DJS: 'SET_FEATURED_DJS',
  SET_UPCOMING_EVENTS: 'SET_UPCOMING_EVENTS',
  SET_TOP_VENUES: 'SET_TOP_VENUES',
  SET_SELECTED_COUNTRY: 'SET_SELECTED_COUNTRY',
  SET_SELECTED_CITY: 'SET_SELECTED_CITY',
  SET_DJ_SEARCH_TERM: 'SET_DJ_SEARCH_TERM',
  SET_VENUE_SEARCH_TERM: 'SET_VENUE_SEARCH_TERM',
  SET_EVENT_SEARCH_TERM: 'SET_EVENT_SEARCH_TERM',
  SET_SELECTED_GENRE: 'SET_SELECTED_GENRE',
  SET_SELECTED_AVAILABILITY: 'SET_SELECTED_AVAILABILITY',
  SET_EVENT_FILTER: 'SET_EVENT_FILTER',
  SET_MENU_OPEN: 'SET_MENU_OPEN',
  SET_SEARCH_OPEN: 'SET_SEARCH_OPEN',
  SET_FILTER_OPEN: 'SET_FILTER_OPEN',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_THEME: 'SET_THEME',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  SET_AUTH: 'SET_AUTH',
  SET_USER: 'SET_USER',
  SET_USER_ROLE: 'SET_USER_ROLE',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.SET_FEATURED_DJS:
      return { ...state, featuredDJs: action.payload };
    case ActionTypes.SET_UPCOMING_EVENTS:
      return { ...state, upcomingEvents: action.payload };
    case ActionTypes.SET_TOP_VENUES:
      return { ...state, topVenues: action.payload };
    case ActionTypes.SET_SELECTED_COUNTRY:
      return { ...state, selectedCountry: action.payload };
    case ActionTypes.SET_SELECTED_CITY:
      return { ...state, selectedCity: action.payload };
    case ActionTypes.SET_DJ_SEARCH_TERM:
      return { ...state, djSearchTerm: action.payload };
    case ActionTypes.SET_VENUE_SEARCH_TERM:
      return { ...state, venueSearchTerm: action.payload };
    case ActionTypes.SET_EVENT_SEARCH_TERM:
      return { ...state, eventSearchTerm: action.payload };
    case ActionTypes.SET_SELECTED_GENRE:
      return { ...state, selectedGenre: action.payload };
    case ActionTypes.SET_SELECTED_AVAILABILITY:
      return { ...state, selectedAvailability: action.payload };
    case ActionTypes.SET_EVENT_FILTER:
      return { ...state, eventFilter: action.payload };
    case ActionTypes.SET_MENU_OPEN:
      return { ...state, isMenuOpen: action.payload };
    case ActionTypes.SET_SEARCH_OPEN:
      return { ...state, isSearchOpen: action.payload };
    case ActionTypes.SET_FILTER_OPEN:
      return { ...state, isFilterOpen: action.payload };
    case ActionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    case ActionTypes.SET_PAGINATION:
      return { 
        ...state, 
        currentPageNumber: action.payload.page,
        totalPages: action.payload.totalPages 
      };
    case ActionTypes.ADD_NOTIFICATION:
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications],
        unreadNotifications: state.unreadNotifications + 1
      };
    case ActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
        unreadNotifications: Math.max(0, state.unreadNotifications - 1)
      };
    case ActionTypes.SET_AUTH:
      return { ...state, isAuthenticated: action.payload };
    case ActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case ActionTypes.SET_USER_ROLE:
      return { ...state, userRole: action.payload };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    setFeaturedDJs: (djs) => dispatch({ type: ActionTypes.SET_FEATURED_DJS, payload: djs }),
    setUpcomingEvents: (events) => dispatch({ type: ActionTypes.SET_UPCOMING_EVENTS, payload: events }),
    setTopVenues: (venues) => dispatch({ type: ActionTypes.SET_TOP_VENUES, payload: venues }),
    setSelectedCountry: (country) => dispatch({ type: ActionTypes.SET_SELECTED_COUNTRY, payload: country }),
    setSelectedCity: (city) => dispatch({ type: ActionTypes.SET_SELECTED_CITY, payload: city }),
    setDJSearchTerm: (term) => dispatch({ type: ActionTypes.SET_DJ_SEARCH_TERM, payload: term }),
    setVenueSearchTerm: (term) => dispatch({ type: ActionTypes.SET_VENUE_SEARCH_TERM, payload: term }),
    setEventSearchTerm: (term) => dispatch({ type: ActionTypes.SET_EVENT_SEARCH_TERM, payload: term }),
    setSelectedGenre: (genre) => dispatch({ type: ActionTypes.SET_SELECTED_GENRE, payload: genre }),
    setSelectedAvailability: (availability) => dispatch({ type: ActionTypes.SET_SELECTED_AVAILABILITY, payload: availability }),
    setEventFilter: (filter) => dispatch({ type: ActionTypes.SET_EVENT_FILTER, payload: filter }),
    setMenuOpen: (isOpen) => dispatch({ type: ActionTypes.SET_MENU_OPEN, payload: isOpen }),
    setSearchOpen: (isOpen) => dispatch({ type: ActionTypes.SET_SEARCH_OPEN, payload: isOpen }),
    setFilterOpen: (isOpen) => dispatch({ type: ActionTypes.SET_FILTER_OPEN, payload: isOpen }),
    setCurrentPage: (page) => dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: page }),
    setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
    setPagination: (page, totalPages) => dispatch({ 
      type: ActionTypes.SET_PAGINATION, 
      payload: { page, totalPages } 
    }),
    addNotification: (notification) => dispatch({ 
      type: ActionTypes.ADD_NOTIFICATION, 
      payload: notification 
    }),
    markNotificationRead: (id) => dispatch({ 
      type: ActionTypes.MARK_NOTIFICATION_READ, 
      payload: id 
    }),
    setAuth: (isAuthenticated) => dispatch({ 
      type: ActionTypes.SET_AUTH, 
      payload: isAuthenticated 
    }),
    setUser: (user) => dispatch({ type: ActionTypes.SET_USER, payload: user }),
    setUserRole: (role) => dispatch({ type: ActionTypes.SET_USER_ROLE, payload: role }),
  };

  // Fetch featured content
  const fetchFeaturedContent = useCallback(async () => {
    actions.setLoading(true);
    try {
      const [djs, events, venues] = await Promise.all([
        getDJList(),
        getEvents(),
        getVenues()
      ]);
      actions.setFeaturedDJs(djs);
      actions.setUpcomingEvents(events);
      actions.setTopVenues(venues);
    } catch (error) {
      actions.setError(error.message);
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  // Filter functions
  const getFilteredDJs = useCallback(() => {
    return state.featuredDJs.filter(dj => {
      const matchesSearch = dj.name.toLowerCase().includes(state.djSearchTerm.toLowerCase()) &&
                          (state.selectedCity === 'all' || !state.selectedCity || dj.location === state.selectedCity);
      
      if (!matchesSearch) {
        return false;
      }

      if (state.selectedGenre === 'all') {
        return true;
      }

      return dj.genres.includes(state.selectedGenre);
    });
  }, [state.featuredDJs, state.djSearchTerm, state.selectedCity, state.selectedGenre]);

  const getFilteredVenues = useCallback(() => {
    return state.topVenues.filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(state.venueSearchTerm.toLowerCase()) &&
                          (state.selectedCity === 'all' || !state.selectedCity || venue.location === state.selectedCity);
      
      if (!matchesSearch) {
        return false;
      }

      if (state.selectedGenre === 'all') {
        return true;
      }

      return venue.genres.includes(state.selectedGenre);
    });
  }, [state.topVenues, state.venueSearchTerm, state.selectedCity, state.selectedGenre]);

  const getFilteredEvents = useCallback(() => {
    return state.upcomingEvents.filter(event => {
      const matchesSearch = (event.title.toLowerCase().includes(state.eventSearchTerm.toLowerCase()) ||
                            event.venue.toLowerCase().includes(state.eventSearchTerm.toLowerCase())) &&
                            (state.selectedCity === 'all' || !state.selectedCity || event.location === state.selectedCity);
      
      if (!matchesSearch) {
        return false;
      }

      if (state.eventFilter === 'All') {
        return true;
      }

      const eventDate = new Date(event.date);
      if (isNaN(eventDate.getTime())) {
        return false;
      }

      const now = new Date();
      if (state.eventFilter === 'Upcoming') {
        return eventDate > now;
      }
      if (state.eventFilter === 'Past') {
        return eventDate < now;
      }
      return true;
    });
  }, [state.upcomingEvents, state.eventSearchTerm, state.selectedCity, state.eventFilter]);

  const logout = useCallback(() => {
    actions.setAuth(false);
    actions.setUser(null);
    actions.setUserRole(null);
  }, [actions]);

  const value = {
    ...state,
    ...actions,
    fetchFeaturedContent,
    getFilteredDJs,
    getFilteredVenues,
    getFilteredEvents,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 