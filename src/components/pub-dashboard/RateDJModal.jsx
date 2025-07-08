import React, { useState } from 'react';
import { Button } from '../ui/button';

const RateDJModal = ({ open, onClose, event, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open || !event) return null;
  const dj = event.dj || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ rating, review });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-1">Rate Your DJ Experience</h2>
        <div className="text-muted-foreground mb-4">How was your experience with {dj.name} at {event.title}?</div>
        <div className="bg-gray-50 rounded flex items-center gap-4 p-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">{dj.avatar || '🎵'}</div>
          <div>
            <div className="font-semibold">{dj.name}</div>
            <div className="text-xs text-muted-foreground">{dj.genre}</div>
            <div className="text-xs text-muted-foreground">{event.venue} • {event.date}</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="mb-1 font-medium">Your Rating</div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                <button type="button" key={star} onClick={() => setRating(star)} className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="mb-1 font-medium">Your Review (Optional)</div>
            <textarea className="w-full border rounded p-2 text-sm" rows={3} placeholder="Tell other pub owners about your experience with this DJ..." value={review} onChange={e => setReview(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button className="bg-black text-white" type="submit" disabled={loading || rating === 0}>{loading ? 'Submitting...' : 'Submit Rating'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateDJModal; 