import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { getDJList, getDJById, getDJAvailability, bookDJ } from '../../services/api';
import { format, parseISO, addDays } from 'date-fns';

const getDayLabel = (dateStr) => {
  const date = parseISO(dateStr);
  return format(date, 'EEE d MMM');
};

const getMonthDays = (availability) => {
  // Get all days in the month of the first available date
  if (!availability.length) return [];
  const first = parseISO(availability[0].date);
  const days = [];
  for (let i = 0; i < 31; i++) {
    const d = addDays(first, i);
    days.push(format(d, 'yyyy-MM-dd'));
  }
  return days;
};

const getReferencePricing = async (duration) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    { label: '1-2 Hours', desc: 'Short events, quick performances', price: 209, recommended: true, suitable: duration <= 2 },
    { label: '2-4 Hours', desc: 'Standard events, parties', price: 472, recommended: false, suitable: duration > 1 && duration <= 4 },
    { label: '4-8 Hours', desc: 'Extended events, celebrations', price: 813, recommended: false, suitable: duration > 3 && duration <= 8 },
    { label: '8+ Hours (Custom)', desc: 'Long events, festivals, custom pricing', price: 1500, recommended: false, suitable: duration > 7 },
  ];
};

const PubDJsTab = () => {
  const [djs, setDjs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDJ, setSelectedDJ] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [djDetails, setDjDetails] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({ eventName: '', eventType: '', name: '', phone: '', email: '', requests: '' });
  const [bookingSummary, setBookingSummary] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [referencePricing, setReferencePricing] = useState([]);
  const [selectedPricing, setSelectedPricing] = useState(null);

  useEffect(() => {
    const fetchDJs = async () => {
      setLoading(true);
      const res = await getDJList();
      if (res.success) setDjs(res.data);
      setLoading(false);
    };
    fetchDJs();
  }, []);

  const handleViewDetails = async (dj) => {
    setSelectedDJ(dj);
    setShowDetailsModal(true);
    const res = await getDJById(dj.id);
    if (res.success) setDjDetails(res.data);
  };

  const handleBookNow = async (dj) => {
    setSelectedDJ(dj);
    setShowBookingModal(true);
    const res = await getDJAvailability(dj.id);
    if (res.success) setAvailability(res.data);
  };

  // Booking modal step logic
  const handleDaySelect = (date) => {
    setSelectedDay(date);
    setBookingStep(2);
  };
  const handleSlotSelect = (slot) => {
    setSelectedSlots([slot]);
    setBookingStep(3);
    setBookingSummary({
      plan: '1-2 Hours',
      startTime: slot.start,
      endTime: slot.end,
      duration: `${slot.duration} hours`,
      price: slot.price,
    });
  };
  const handleBookingFormChange = (e) => {
    setBookingForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleBookingSubmit = async () => {
    setBookingLoading(true);
    await bookDJ(selectedDJ.id, { ...bookingForm, ...bookingSummary, date: selectedDay });
    setBookingLoading(false);
    setBookingSuccess(true);
  };

  // Generate calendar and slots from availability
  const days = getMonthDays(availability);
  const dayStatus = (date) => {
    const found = availability.find(a => a.date === date);
    return found ? found.status : 'available';
  };
  const slotsForDay = (date) => {
    // Dummy: 3 slots per available day
    if (dayStatus(date) !== 'available') return [];
    return [
      { start: '20:00', end: '22:00', duration: 2, price: 209 },
      { start: '22:00', end: '00:00', duration: 2, price: 472 },
      { start: '00:00', end: '02:00', duration: 2, price: 813 },
    ];
  };

  const handleTimeSlotClick = (hour) => {
    if (!selectedStart) {
      setSelectedStart(hour);
      setSelectedEnd(null);
    } else if (!selectedEnd && hour > selectedStart) {
      setSelectedEnd(hour);
    } else {
      setSelectedStart(hour);
      setSelectedEnd(null);
    }
  };

  const handleStep2Next = async () => {
    // Calculate duration
    const duration = selectedEnd && selectedStart ? selectedEnd - selectedStart : 1;
    const pricing = await getReferencePricing(duration);
    setReferencePricing(pricing);
    setStep(3);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Browse DJs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {djs.map((dj) => (
          <div key={dj.id} className="bg-white border rounded-xl shadow p-0 overflow-hidden flex flex-col">
            <div className="relative h-40 bg-gray-100 flex items-center justify-center">
              <img src={dj.image} alt={dj.name} className="object-cover w-full h-full" />
              <span className={`absolute top-2 left-2 w-3 h-3 rounded-full ${dj.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">{dj.available ? 'Fully Available' : 'Busy'}</span>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="font-semibold text-lg">{dj.name}</div>
              <div className="text-sm text-muted-foreground mb-2">{dj.genres?.join(', ')}</div>
              <div className="flex flex-col gap-1 text-xs mb-2">
                <div><span className="font-medium">Location:</span> {dj.location || '-'}</div>
                <div><span className="font-medium">Experience:</span> {dj.experience || '5+ years'}</div>
                <div><span className="font-medium">Equipment:</span> {dj.equipment || 'Full Setup Included'}</div>
                <div><span className="font-medium">Next Available:</span> {dj.nextAvailable || 'Dec 15, 2024'}</div>
                <div><span className="font-medium">Price Range:</span> ${dj.price - 300} - ${dj.price + 300}</div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button variant="outline" className="flex-1" onClick={() => handleViewDetails(dj)}>View Details</Button>
                <Button className="flex-1 bg-black text-white" onClick={() => handleBookNow(dj)}>Book Now</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Details Modal */}
      {showDetailsModal && djDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-0 relative flex flex-col md:flex-row overflow-hidden">
            <button className="absolute top-4 right-4 text-2xl z-10" onClick={() => setShowDetailsModal(false)}>×</button>
            {/* Left: Profile Card */}
            <div className="bg-gray-50 p-6 flex flex-col items-center w-full md:w-1/3 border-r border-border">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl mb-2">{djDetails.name[0]}</div>
              <div className="font-bold text-xl mb-1 text-center">{djDetails.name}</div>
              <div className="text-sm text-muted-foreground mb-2 text-center">{djDetails.genres?.join(', ')}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${djDetails.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="text-xs">{djDetails.available ? 'Available' : 'Busy'}</span>
              </div>
              <div className="text-xs mb-1"><span className="font-medium">Location:</span> {djDetails.location}</div>
              <div className="text-xs mb-1"><span className="font-medium">Experience:</span> {djDetails.experience}</div>
              <div className="text-xs mb-1"><span className="font-medium">Equipment:</span> {djDetails.equipment}</div>
              <div className="text-xs mb-1"><span className="font-medium">Price Range:</span> ${djDetails.price - 300} - ${djDetails.price + 300}</div>
              <div className="text-xs mb-1"><span className="font-medium">Rating:</span> {djDetails.rating || 4.8} ⭐</div>
              <div className="text-xs mb-4"><span className="font-medium">Reviews:</span> {djDetails.reviews?.length || 0}</div>
              <Button className="w-full bg-black text-white mt-2" onClick={() => { setShowDetailsModal(false); handleBookNow(djDetails); }}>Book Now</Button>
            </div>
            {/* Right: About, Portfolio, Reviews */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <div className="font-semibold text-lg mb-2">About</div>
                <div className="text-sm text-muted-foreground">{djDetails.bio}</div>
              </div>
              <div className="mb-6">
                <div className="font-semibold text-lg mb-2">Portfolio</div>
                <div className="grid grid-cols-2 gap-2">
                  {/* Portfolio images/videos here if available */}
                  <div className="bg-gray-100 h-24 flex items-center justify-center rounded">No Media</div>
                  <div className="bg-gray-100 h-24 flex items-center justify-center rounded">No Media</div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-lg mb-2">Reviews</div>
                <div className="space-y-2">
                  {(djDetails.reviews || []).map((r, i) => (
                    <div key={i} className="bg-gray-50 rounded p-2 text-xs">
                      <div className="font-medium">{r.venue}</div>
                      <div className="text-yellow-600">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      <div className="mb-1">{r.comment}</div>
                      <div className="text-muted-foreground">{r.reviewerName} • {r.date}</div>
                    </div>
                  ))}
                  {(!djDetails.reviews || djDetails.reviews.length === 0) && <div className="text-muted-foreground">No reviews yet.</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Booking Modal (Step 1/2/3 UI to be implemented) */}
      {showBookingModal && selectedDJ && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-0 relative flex flex-col">
            <button className="absolute top-4 right-4 text-2xl z-10" onClick={() => setShowBookingModal(false)}>×</button>
            {/* Stepper Progress */}
            <div className="flex items-center justify-center gap-2 py-4 border-b">
              {[1,2,3,4].map(s => (
                <div key={s} className={`w-8 h-2 rounded-full ${step >= s ? 'bg-black' : 'bg-gray-200'}`}></div>
              ))}
            </div>
            <div className="p-6 flex-1 overflow-y-auto">
              {step === 1 && (
                <>
                  <div className="mb-4 font-semibold text-lg">Step 1: Select Booking Date</div>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {days.map((date, i) => {
                      const status = dayStatus(date);
                      return (
                        <button key={date} className={`rounded p-2 text-xs flex flex-col items-center border ${status === 'available' ? 'bg-green-50 border-green-300' : status === 'booked' ? 'bg-red-100 border-red-300' : 'bg-gray-100 border-gray-300'} ${selectedDay === date ? 'ring-2 ring-black' : ''}`} disabled={status !== 'available'} onClick={() => { setSelectedDay(date); setStep(2); }}>
                          <span>{getDayLabel(date)}</span>
                          <span className="mt-1">{status === 'available' ? '✔' : status === 'booked' ? '✖' : '-'}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-end"><Button onClick={() => setShowBookingModal(false)} variant="outline">Cancel</Button></div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="mb-4 font-semibold text-lg">Step 2: Select Start & End Time</div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {[...Array(24)].map((_, hour) => {
                      const status = hour % 3 === 0 ? 'booked' : 'available'; // Dummy logic
                      let color = 'bg-green-50 border-green-300';
                      if (status === 'booked') color = 'bg-red-100 border-red-300';
                      if (selectedStart === hour) color = 'bg-yellow-200 border-yellow-400';
                      if (selectedEnd === hour) color = 'bg-orange-200 border-orange-400';
                      if (selectedStart !== null && selectedEnd !== null && hour > selectedStart && hour < selectedEnd) color = 'bg-blue-100 border-blue-400';
                      return (
                        <button key={hour} className={`rounded border px-2 py-1 text-xs ${color}`} disabled={status === 'booked'} onClick={() => handleTimeSlotClick(hour)}>
                          {hour.toString().padStart(2, '0')}:00
                        </button>
                      );
                    })}
                  </div>
                  {selectedStart !== null && selectedEnd !== null && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                      <div className="font-semibold text-green-800">Time Range Selected: {selectedStart}:00 - {selectedEnd}:00 ({selectedEnd - selectedStart} hours)</div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button className="bg-black text-white" onClick={handleStep2Next} disabled={selectedStart === null || selectedEnd === null || selectedEnd <= selectedStart}>Next</Button>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="mb-4 font-semibold text-lg">Step 3: Reference Pricing</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {referencePricing.map((p, i) => (
                      <div key={i} className={`rounded border p-4 flex flex-col items-start ${p.recommended ? 'border-black shadow-lg' : 'border-gray-200'} ${!p.suitable ? 'opacity-50' : ''} ${selectedPricing === p.label ? 'ring-2 ring-black' : ''}`} onClick={() => p.suitable && setSelectedPricing(p.label)} style={{ cursor: p.suitable ? 'pointer' : 'not-allowed' }}>
                        <div className="font-semibold mb-1">{p.label} {p.recommended && <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded">Recommended</span>}</div>
                        <div className="text-xs mb-2 text-muted-foreground">{p.desc}</div>
                        <div className="text-2xl font-bold mb-1">${p.price}</div>
                        {!p.suitable && <div className="text-xs text-red-500">Not suitable for {selectedEnd - selectedStart} hour{selectedEnd - selectedStart > 1 ? 's' : ''}</div>}
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 rounded p-4 mb-4">
                    <div>Plan: {selectedPricing || 'Select a plan'}</div>
                    <div>Start Time: {selectedStart}:00</div>
                    <div>End Time: {selectedEnd}:00</div>
                    <div>Duration: {selectedEnd - selectedStart} hours</div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button className="bg-black text-white" onClick={() => setStep(4)} disabled={!selectedPricing}>Next</Button>
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <div className="mb-4 font-semibold text-lg">Step 4: Booking Details</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input name="eventName" placeholder="Event Name" value={bookingForm.eventName} onChange={handleBookingFormChange} />
                    <Input name="eventType" placeholder="Event Type" value={bookingForm.eventType} onChange={handleBookingFormChange} />
                    <Input name="name" placeholder="Your Name" value={bookingForm.name} onChange={handleBookingFormChange} />
                    <Input name="phone" placeholder="Phone" value={bookingForm.phone} onChange={handleBookingFormChange} />
                    <Input name="email" placeholder="Email" value={bookingForm.email} onChange={handleBookingFormChange} />
                    <Input name="requests" placeholder="Special Requests" value={bookingForm.requests} onChange={handleBookingFormChange} />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                    <Button className="bg-black text-white" onClick={handleBookingSubmit} disabled={bookingLoading}>{bookingLoading ? 'Booking...' : 'Confirm Booking'}</Button>
                  </div>
                </>
              )}
              {bookingSuccess && (
                <div className="text-green-600 text-center py-8 font-bold text-xl">Booking Successful!</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PubDJsTab; 