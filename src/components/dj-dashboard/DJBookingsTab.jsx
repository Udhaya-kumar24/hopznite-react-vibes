import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Info,
  CheckCircle2,
  XCircle,
  Eye,
  Inbox
} from 'lucide-react';

const statusTheme = {
  pending: {
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    icon: <Clock className="w-4 h-4 mr-1" />,
  },
  accepted: {
    bg: 'bg-green-600',
    text: 'text-white',
    icon: <CheckCircle2 className="w-4 h-4 mr-1" />,
  },
  declined: {
    bg: 'bg-red-600',
    text: 'text-white',
    icon: <XCircle className="w-4 h-4 mr-1" />,
  },
};

const DJBookingsTab = ({
  bookingRequests,
  handleBookingResponse,
  selectedBookingDetails,
  setSelectedBookingDetails,
  navigate
}) => {
  if (!bookingRequests || bookingRequests.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <Inbox className="w-12 h-12 mb-4 text-muted-foreground/60" />
        <div className="text-lg font-semibold mb-1">No booking requests found</div>
        <div className="text-sm">You have no booking requests at the moment.</div>
      </div>
    );
  }
  return (
    <div className="w-full grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {bookingRequests.map((request) => {
        const theme = statusTheme[request.status] || statusTheme['pending'];
        return (
          <Card
            key={request.id}
            className="relative flex flex-col justify-between bg-gradient-to-br from-primary/5 via-card to-background/80 border border-border shadow-xl hover:shadow-2xl transition-all duration-200 rounded-2xl group overflow-hidden hover:scale-[1.025] focus-within:scale-[1.025]"
          >
            {/* Left vertical accent bar */}
            <span className="absolute left-0 top-0 h-full w-1.5 bg-primary rounded-r-lg" />
            {/* Card Header */}
            <CardHeader className="pb-2 pt-5 px-6">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-bold text-primary leading-tight">{request.venueName}</CardTitle>
              </div>
              <span className="text-sm text-muted-foreground font-medium">{request.eventType}</span>
            </CardHeader>
            {/* Status Badge (below header, not overlaying) */}
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full font-semibold text-xs shadow z-10 mb-2 ml-5 w-fit ${theme.bg} ${theme.text}`}
                 style={{marginTop: '-0.5rem'}}>
              {theme.icon} {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </div>
            {/* Divider */}
            <div className="mx-6 border-b border-border/60 mb-2" />
            {/* Card Content */}
            <CardContent className="pt-0 pb-2 px-6">
              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" /> {new Date(request.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primary" /> {request.time}
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" /> {request.location}
                </div>
                <div className="col-span-2 flex items-center gap-1 font-semibold text-foreground">
                  <IndianRupee className="w-4 h-4 text-primary" /> ₹{request.price.toLocaleString()}
                </div>
              </div>
            </CardContent>
            {/* Footer Actions */}
            <CardFooter className="flex flex-col gap-2 mt-auto pt-4 border-t border-border bg-background/80 px-6 pb-6">
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-1 w-full justify-center text-base font-semibold"
                onClick={() => navigate(`/events/${request.id}`)}
              >
                <Eye className="w-4 h-4" /> View Details
              </Button>
              {request.status === 'pending' && (
                <div className="flex gap-2 w-full">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex items-center gap-1 w-1/2 bg-green-600 hover:bg-green-700"
                    onClick={() => handleBookingResponse(request.id, 'accepted')}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1 w-1/2"
                    onClick={() => handleBookingResponse(request.id, 'declined')}
                  >
                    <XCircle className="w-4 h-4" /> Decline
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default DJBookingsTab;
