
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Calendar as CalendarIcon, Heart, Ticket, MapPin, Users, Star, Image as ImageIcon, Info } from 'lucide-react';
import { getEvents, getDJList, getBookings, getReviews, getVenues, getVenueById } from '@/services/api';
import Modal from '@/components/ui/Modal';

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [djs, setDjs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueDetails, setVenueDetails] = useState(null);
  const [venueLoading, setVenueLoading] = useState(false);
  const EVENTS_PER_PAGE = 6;
  const DJS_PER_PAGE = 6;
  const REVIEWS_PER_PAGE = 4;
  const [eventPage, setEventPage] = useState(1);
  const [djPage, setDjPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [selectedDJ, setSelectedDJ] = useState(null);
  const [djDetails, setDJDetails] = useState(null);
  const [djLoading, setDJLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'events') getEvents().then(res => setEvents(res.data || []));
    if (activeTab === 'overview' || activeTab === 'djs') getDJList().then(res => setDjs(res.data || []));
    if (activeTab === 'overview' || activeTab === 'bookings') getBookings(1).then(res => setBookings(res || []));
    if (activeTab === 'overview' || activeTab === 'reviews') getReviews(1).then(res => setReviews(res || []));
    if (activeTab === 'overview' || activeTab === 'venues') getVenues().then(res => setVenues(res.data || []));
  }, [activeTab]);

  // Fetch venue details when selectedVenue changes
  useEffect(() => {
    if (selectedVenue) {
      setVenueLoading(true);
      getVenueById(selectedVenue.id).then(res => {
        setVenueDetails(res.data);
        setVenueLoading(false);
      });
    } else {
      setVenueDetails(null);
    }
  }, [selectedVenue]);

  // Fetch DJ details when selectedDJ changes
  useEffect(() => {
    if (selectedDJ) {
      setDJLoading(true);
      import('@/services/api').then(api => {
        api.getDJById(selectedDJ.id).then(res => {
          setDJDetails(res.data);
          setDJLoading(false);
        });
      });
    } else {
      setDJDetails(null);
    }
  }, [selectedDJ]);
  // Fetch Event details when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      setEventLoading(true);
      import('@/services/api').then(api => {
        api.getEventsById(selectedEvent.id).then(res => {
          setEventDetails(res.data);
          setEventLoading(false);
        });
      });
    } else {
      setEventDetails(null);
    }
  }, [selectedEvent]);

  const paginatedEvents = events.slice((eventPage - 1) * EVENTS_PER_PAGE, eventPage * EVENTS_PER_PAGE);
  const totalEventPages = Math.max(1, Math.ceil(events.length / EVENTS_PER_PAGE));
  const paginatedDjs = djs.slice((djPage - 1) * DJS_PER_PAGE, djPage * DJS_PER_PAGE);
  const totalDjPages = Math.max(1, Math.ceil(djs.length / DJS_PER_PAGE));
  const paginatedReviews = reviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE);
  const totalReviewPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Ticket },
    { id: 'events', label: 'Event Discovery', icon: CalendarIcon },
    { id: 'djs', label: 'DJs', icon: Users },
    { id: 'bookings', label: 'My Bookings', icon: Ticket },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'venues', label: 'Venues', icon: MapPin },
  ];

  const renderBookingModal = () => (
    <Modal
      open={!!selectedBooking}
      onClose={() => setSelectedBooking(null)}
      title="Booking Details"
      maxWidth="max-w-lg"
    >
      {selectedBooking ? (
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-4">
            <Ticket className="h-8 w-8 text-primary" />
            <div>
              <div className="font-semibold text-lg">{selectedBooking.djName}</div>
              <div className="text-sm text-muted-foreground">{selectedBooking.venue}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Date</div>
              <div className="font-medium">{selectedBooking.date}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="font-medium capitalize">{selectedBooking.status}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Amount</div>
              <div className="font-medium">₹{selectedBooking.amount}</div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );

  const renderVenueModal = () => (
    <Modal
      open={!!selectedVenue}
      onClose={() => setSelectedVenue(null)}
      title={venueDetails ? venueDetails.name : 'Venue Details'}
      maxWidth="max-w-2xl"
    >
      {venueLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading venue details...</div>
      ) : venueDetails ? (
        <div className="space-y-4 text-left">
          <div className="flex gap-6 items-center">
            <img src={venueDetails.image} alt={venueDetails.name} className="w-32 h-32 object-cover rounded-lg border" />
            <div>
              <div className="font-semibold text-xl mb-1">{venueDetails.name}</div>
              <div className="text-muted-foreground mb-1">{venueDetails.location}</div>
              <div className="text-sm">{venueDetails.type} &bull; Capacity: {venueDetails.capacity}</div>
              <div className="text-yellow-500 font-bold">★ {venueDetails.rating}</div>
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">Description</div>
            <div className="text-sm text-muted-foreground">{venueDetails.description}</div>
          </div>
          <div>
            <div className="font-medium mb-1">Amenities</div>
            <div className="flex flex-wrap gap-2">
              {venueDetails.amenities?.map((a, i) => (
                <span key={i} className="bg-muted px-2 py-1 rounded-full text-xs border">{a}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-medium mb-1">Contact</div>
              <div className="text-sm">{venueDetails.contact?.manager}</div>
              <div className="text-xs text-muted-foreground">{venueDetails.contact?.phone}</div>
              <div className="text-xs text-muted-foreground">{venueDetails.contact?.email}</div>
            </div>
            <div>
              <div className="font-medium mb-1">Hours</div>
              <div className="text-xs">Weekdays: {venueDetails.hours?.weekdays}</div>
              <div className="text-xs">Weekends: {venueDetails.hours?.weekends}</div>
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">Upcoming Events</div>
            <ul className="list-disc pl-5 text-sm">
              {venueDetails.upcomingEvents?.map(ev => (
                <li key={ev.id}>{ev.name} - {ev.date} ({ev.dj})</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </Modal>
  );

  const renderDJModal = () => (
    <Modal
      open={!!selectedDJ}
      onClose={() => setSelectedDJ(null)}
      title={djDetails ? djDetails.name : 'DJ Details'}
      maxWidth="max-w-lg"
    >
      {djLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading DJ details...</div>
      ) : djDetails ? (
        <div className="space-y-4 text-left">
          <div className="flex gap-4 items-center">
            {djDetails.profileImage ? (
              <img src={djDetails.profileImage} alt={djDetails.name} className="w-20 h-20 object-cover rounded-full border" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <div>
              <div className="font-semibold text-xl mb-1">{djDetails.name}</div>
              <div className="text-muted-foreground mb-1">{djDetails.location}</div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(Math.round(djDetails.rating || 0))].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{djDetails.rating}</span>
              </div>
              <div className="text-xs text-muted-foreground">{djDetails.genres?.join(', ')}</div>
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">Bio</div>
            <div className="text-sm text-muted-foreground">{djDetails.bio}</div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
  const renderEventModal = () => (
    <Modal
      open={!!selectedEvent}
      onClose={() => setSelectedEvent(null)}
      title={eventDetails ? eventDetails.title : 'Event Details'}
      maxWidth="max-w-lg"
    >
      {eventLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading event details...</div>
      ) : eventDetails ? (
        <div className="space-y-4 text-left">
          <div className="flex gap-4 items-center">
            {eventDetails.image ? (
              <img src={eventDetails.image} alt={eventDetails.title} className="w-20 h-20 object-cover rounded-lg border" />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                <Info className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <div>
              <div className="font-semibold text-xl mb-1">{eventDetails.title}</div>
              <div className="text-muted-foreground mb-1">{eventDetails.date} • {eventDetails.venue}</div>
              <div className="text-xs text-muted-foreground">{eventDetails.genre} • {eventDetails.dj}</div>
              <div className="text-xs text-muted-foreground">Price: ₹{eventDetails.ticketPrice}</div>
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">Description</div>
            <div className="text-sm text-muted-foreground">{eventDetails.description}</div>
          </div>
        </div>
      ) : null}
    </Modal>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {paginatedEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-card border border-border rounded-xl p-3 flex flex-col gap-2 shadow-md relative transition-all duration-200 hover:scale-[1.03] hover:shadow-xl group cursor-pointer min-h-[220px]"
                >
                  <div className="relative flex justify-center items-center mb-2">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-20 h-20 object-cover rounded-full border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted flex items-center justify-center rounded-full border-4 border-background shadow-lg">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="font-semibold text-base mb-0.5 truncate text-center">{event.title}</div>
                  <div className="text-xs text-muted-foreground mb-0.5 truncate text-center">{event.date} • {event.venue}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 justify-center">
                    <span>{event.genre}</span>
                    <span>•</span>
                    <span>{event.dj}</span>
                  </div>
                  <div className="flex-1" />
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-primary text-white hover:bg-primary/90 transition-all"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button size="sm" variant="outline" disabled={eventPage === 1} onClick={() => setEventPage(p => Math.max(1, p - 1))}>Prev</Button>
              <span className="text-sm">Page {eventPage} of {totalEventPages}</span>
              <Button size="sm" variant="outline" disabled={eventPage === totalEventPages} onClick={() => setEventPage(p => Math.min(totalEventPages, p + 1))}>Next</Button>
            </div>
            {renderEventModal()}
          </div>
        );
      case 'djs':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">DJs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {paginatedDjs.map(dj => (
                <div
                  key={dj.id}
                  className="bg-card border border-border rounded-xl p-3 flex flex-col gap-2 shadow-md relative transition-all duration-200 hover:scale-[1.03] hover:shadow-xl group cursor-pointer min-h-[200px]"
                >
                  <div className="relative flex justify-center items-center mb-2">
                    {dj.image ? (
                      <img
                        src={dj.image}
                        alt={dj.name}
                        className="w-20 h-20 object-cover rounded-full border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted flex items-center justify-center rounded-full border-4 border-background shadow-lg">
                        <Users className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="font-semibold text-base mb-0.5 truncate text-center">{dj.name}</div>
                  <div className="text-xs text-muted-foreground mb-0.5 truncate text-center">{dj.genre}</div>
                  <div className="flex items-center gap-1 mb-1 justify-center">
                    {[...Array(Math.round(dj.rating || 0))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">{dj.rating}</span>
                  </div>
                  <div className="flex-1" />
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-primary text-white hover:bg-primary/90 transition-all"
                    onClick={() => setSelectedDJ(dj)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button size="sm" variant="outline" disabled={djPage === 1} onClick={() => setDjPage(p => Math.max(1, p - 1))}>Prev</Button>
              <span className="text-sm">Page {djPage} of {totalDjPages}</span>
              <Button size="sm" variant="outline" disabled={djPage === totalDjPages} onClick={() => setDjPage(p => Math.min(totalDjPages, p + 1))}>Next</Button>
            </div>
            {renderDJModal()}
          </div>
        );
      case 'bookings':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">My Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map(b => (
                <div key={b.id} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                  <div className="font-semibold text-lg mb-1">{b.djName}</div>
                  <div className="text-muted-foreground text-sm mb-1">{b.venue}</div>
                  <div className="text-xs text-muted-foreground mb-2">{b.date}</div>
                  <div className="flex-1" />
                  <Button size="sm" className="w-full" onClick={() => setSelectedBooking(b)}>View Details</Button>
                </div>
              ))}
            </div>
            {renderBookingModal()}
          </div>
        );
      case 'reviews':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">My Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedReviews.map(r => (
                <div
                  key={r.id}
                  className="bg-white border border-border rounded-xl p-4 flex flex-col gap-2 shadow group transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-base font-bold border text-primary">
                      {r.customerName ? r.customerName[0] : <Users className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{r.customerName}</div>
                      <div className="text-xs text-muted-foreground">{r.date}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      {[...Array(r.rating || 0)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1 line-clamp-3">{r.comment}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button size="sm" variant="outline" disabled={reviewPage === 1} onClick={() => setReviewPage(p => Math.max(1, p - 1))}>Prev</Button>
              <span className="text-sm">Page {reviewPage} of {totalReviewPages}</span>
              <Button size="sm" variant="outline" disabled={reviewPage === totalReviewPages} onClick={() => setReviewPage(p => Math.min(totalReviewPages, p + 1))}>Next</Button>
            </div>
          </div>
        );
      case 'venues':
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Venues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venues.map(v => (
                <div key={v.id} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                  <div className="font-semibold text-lg mb-1">{v.name}</div>
                  <div className="text-muted-foreground text-sm mb-1">{v.location}</div>
                  <div className="text-xs text-muted-foreground mb-2">{v.type} &bull; Capacity: {v.capacity}</div>
                  <div className="flex-1" />
                  <Button size="sm" className="w-full" onClick={() => setSelectedVenue(v)}>View Details</Button>
                </div>
              ))}
            </div>
            {renderVenueModal()}
          </div>
        );
      case 'overview':
      default:
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Upcoming Events</span><CalendarIcon className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{events.length}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Favorite DJs</span><Heart className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{djs.length}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">My Bookings</span><Ticket className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{bookings.length}</div>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium">Venues Visited</span><MapPin className="h-4 w-4 text-muted-foreground" /></div>
                <div className="text-2xl font-bold">{venues.length}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="font-semibold text-lg mb-4">Upcoming Events</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map(event => (
                    <div key={event.id} className="bg-muted border border-border rounded-lg p-4 flex flex-col gap-2 shadow-sm">
                      <div className="font-semibold text-base mb-1">{event.title}</div>
                      <div className="text-muted-foreground text-sm mb-1">{event.date} &bull; {event.venue}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{event.genre}</span>
                        <span>•</span>
                        <span>{event.dj}</span>
                      </div>
                      <div className="flex-1" />
                      <Button size="sm" variant="outline" className="w-full" disabled>Booking Closed</Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="font-semibold text-lg mb-4">Quick Actions</div>
                <Button className="w-full mb-2">Browse Events</Button>
                <Button className="w-full mb-2" variant="outline">Favorite DJs</Button>
                <Button className="w-full mb-2" variant="outline">Discover Venues</Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h2 className="text-xl font-bold text-foreground">Customer Dashboard</h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-4 w-4" />
                  {sidebarOpen && <span className="ml-2">{item.label}</span>}
                </Button>
              ))}
            </div>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
