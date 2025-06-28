import React from 'react';

const DJReviewsTab = ({
  reviews,
  rating = 0,
  totalReviews = 0,
  responseRate = 0,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl shadow p-6">
      <div className="flex items-center text-foreground mb-4">
        <span className="font-bold text-xl mr-2 text-yellow-400">⭐</span>
        <span className="text-xl font-bold">Performance Reviews</span>
      </div>
      {/* Review Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-start shadow-sm">
          <div className="text-lg font-semibold mb-1 text-foreground">Average Rating</div>
          <div className="flex items-center mb-1">
            <span className="text-3xl font-bold mr-2 text-foreground">{rating.toFixed(1)}</span>
            <span className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`w-5 h-5 inline-block ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
              ))}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">Based on {totalReviews} reviews</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-start shadow-sm">
          <div className="text-lg font-semibold mb-1 text-foreground">Total Reviews</div>
          <div className="text-3xl font-bold mb-1 text-foreground">{totalReviews}</div>
          <div className="text-xs text-muted-foreground">From completed events</div>
        </div>
        <div className="bg-background border border-border rounded-lg p-6 flex flex-col items-start shadow-sm">
          <div className="text-lg font-semibold mb-1 text-foreground">Response Rate</div>
          <div className="text-3xl font-bold mb-1 text-foreground">{responseRate}%</div>
          <div className="text-xs text-muted-foreground">Client satisfaction</div>
        </div>
      </div>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground">{review.venue}</h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`w-4 h-4 inline-block ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                ))}
              </div>
            </div>
            <p className="text-muted-foreground mb-2">{review.comment}</p>
            <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DJReviewsTab; 