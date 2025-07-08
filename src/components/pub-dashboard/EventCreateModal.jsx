import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const EventCreateModal = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState({
    title: '',
    type: '',
    date: '',
    time: '',
    venue: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onCreate(form);
    setLoading(false);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="title" placeholder="Event Name" value={form.title} onChange={handleChange} required />
          <Input name="type" placeholder="Event Type" value={form.type} onChange={handleChange} required />
          <Input name="date" type="date" value={form.date} onChange={handleChange} required />
          <Input name="time" type="time" value={form.time} onChange={handleChange} required />
          <Input name="venue" placeholder="Venue" value={form.venue} onChange={handleChange} required />
          <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <Button className="w-full bg-black text-white" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</Button>
        </form>
      </div>
    </div>
  );
};

export default EventCreateModal; 