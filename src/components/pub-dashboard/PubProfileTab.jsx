import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const PubProfileTab = ({
  profile = {},
  setProfile = () => {},
  onSave = () => {},
  onCancel = () => {},
  uploading = false,
  mediaPreviews = [],
  onMediaChange = () => {},
  menus = [],
  onMenuUpload = () => {},
  onMenuRemove = () => {},
  amenities = [],
  setAmenities = () => {},
  genres = [],
  setGenres = () => {},
  operatingHours = [],
  setOperatingHours = () => {},
}) => {
  // Helper for amenities and genres
  const handleTagAdd = (list, setList, value) => {
    if (value && !list.includes(value)) setList([...list, value]);
  };
  const handleTagRemove = (list, setList, value) => {
    setList(list.filter(item => item !== value));
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Basic Information</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <Label className="block mb-1">Pub Name</Label>
            <Input value={profile.name || ''} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <Label className="block mb-1">Capacity</Label>
            <Input type="number" value={profile.capacity || ''} onChange={e => setProfile(p => ({ ...p, capacity: e.target.value }))} />
          </div>
        </div>
        <Label className="block mb-1">Description</Label>
        <Textarea value={profile.description || ''} onChange={e => setProfile(p => ({ ...p, description: e.target.value }))} />
      </div>

      {/* Address & Contact */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Address & Contact</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="block mb-1">Street/Area</Label>
            <Input value={profile.area || ''} onChange={e => setProfile(p => ({ ...p, area: e.target.value }))} />
          </div>
          <div>
            <Label className="block mb-1">City</Label>
            <Input value={profile.city || ''} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} />
          </div>
          <div>
            <Label className="block mb-1">State/Province</Label>
            <Input value={profile.state || ''} onChange={e => setProfile(p => ({ ...p, state: e.target.value }))} />
          </div>
          <div>
            <Label className="block mb-1">Country</Label>
            <Input value={profile.country || ''} onChange={e => setProfile(p => ({ ...p, country: e.target.value }))} />
          </div>
          <div>
            <Label className="block mb-1">ZIP/Postal Code</Label>
            <Input value={profile.zip || ''} onChange={e => setProfile(p => ({ ...p, zip: e.target.value }))} />
          </div>
          <div>
            <Label className="block mb-1">Phone</Label>
            <Input value={profile.phone || ''} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <Label className="block mb-1">Email</Label>
            <Input value={profile.email || ''} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <Label className="block mb-1">Website</Label>
            <Input value={profile.website || ''} onChange={e => setProfile(p => ({ ...p, website: e.target.value }))} />
          </div>
        </div>
        <div className="bg-blue-50 text-blue-800 rounded p-3 text-sm">
          <span className="font-semibold">Location Summary:</span> {profile.locationSummary || '123 Main Street, City, State, Country, ZIP'}
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Operating Hours</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {daysOfWeek.map((day, i) => (
            <div key={day} className="flex items-center gap-2 mb-2">
              <div className="w-24 font-medium">{day}</div>
              <Input type="time" className="w-32" value={operatingHours?.[i]?.open || ''} onChange={e => setOperatingHours(hours => { const copy = [...(hours || Array(7).fill({}))]; copy[i] = { ...copy[i], open: e.target.value }; return copy; })} disabled={operatingHours?.[i]?.closed} />
              <span>to</span>
              <Input type="time" className="w-32" value={operatingHours?.[i]?.close || ''} onChange={e => setOperatingHours(hours => { const copy = [...(hours || Array(7).fill({}))]; copy[i] = { ...copy[i], close: e.target.value }; return copy; })} disabled={operatingHours?.[i]?.closed} />
              <Button size="sm" variant={operatingHours?.[i]?.closed ? 'default' : 'outline'} onClick={() => setOperatingHours(hours => { const copy = [...(hours || Array(7).fill({}))]; copy[i] = { ...copy[i], closed: !copy[i]?.closed }; return copy; })}>{operatingHours?.[i]?.closed ? 'Closed' : 'Open'}</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Pub Images */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Pub Images</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex flex-col items-center border-2 border-dashed border-border rounded-lg p-4 min-h-[140px] relative group bg-background">
              {mediaPreviews[i] ? (
                <>
                  <img src={mediaPreviews[i]} alt={`Pub ${i + 1}`} className="w-full h-32 object-cover rounded mb-2" />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 rounded-full p-1 shadow"
                    onClick={() => onMediaChange(i, null)}
                  >
                    ×
                  </Button>
                </>
              ) : (
                <>
                  <span className="w-8 h-8 text-muted-foreground mb-2">+</span>
                  <div className="text-sm text-muted-foreground mb-2">Upload Image {i + 1}</div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`pub-image-${i}`}
                    onChange={e => onMediaChange(i, e.target.files[0])}
                  />
                  <Label htmlFor={`pub-image-${i}`} className="px-3 py-1 bg-muted rounded cursor-pointer text-xs border border-border hover:bg-accent">Choose File</Label>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-muted-foreground cursor-pointer">
          Drag and drop images here, or click to browse
        </div>
      </div>

      {/* Menus & Catalogs */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Menus & Catalogs</div>
        <div className="mb-4">
          {menus && menus.length > 0 && menus.map((menu, i) => (
            <div key={i} className="flex items-center gap-2 border rounded p-2 mb-2 bg-muted">
              <span className="font-medium">{menu.name}</span>
              <span className="text-xs text-muted-foreground">{menu.type}</span>
              <Button size="icon" variant="destructive" onClick={() => onMenuRemove(i)}>×</Button>
            </div>
          ))}
        </div>
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center mb-2">
          <input type="file" multiple accept="application/pdf,image/*" className="hidden" id="menu-upload" onChange={onMenuUpload} />
          <Label htmlFor="menu-upload" className="px-3 py-1 bg-muted rounded cursor-pointer text-xs border border-border hover:bg-accent">Upload Menus</Label>
        </div>
      </div>

      {/* Amenities & Features */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Amenities & Features</div>
        <div className="mb-2">
          <Label className="block mb-1">Current Amenities</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {amenities.map((a, i) => (
              <span key={i} className="bg-muted px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                {a}
                <button type="button" className="ml-1 text-xs" onClick={() => handleTagRemove(amenities, setAmenities, a)}>×</button>
              </span>
            ))}
            <input
              type="text"
              className="border border-border rounded px-2 py-1 text-sm"
              placeholder="Add amenity"
              onKeyDown={e => { if (e.key === 'Enter') { handleTagAdd(amenities, setAmenities, e.target.value); e.target.value = ''; } }}
            />
          </div>
        </div>
        <div>
          <Label className="block mb-1">Preferred Music Genres</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {genres.map((g, i) => (
              <span key={i} className="bg-muted px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                {g}
                <button type="button" className="ml-1 text-xs" onClick={() => handleTagRemove(genres, setGenres, g)}>×</button>
              </span>
            ))}
            <input
              type="text"
              className="border border-border rounded px-2 py-1 text-sm"
              placeholder="Add genre"
              onKeyDown={e => { if (e.key === 'Enter') { handleTagAdd(genres, setGenres, e.target.value); e.target.value = ''; } }}
            />
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} className="bg-primary text-white" disabled={uploading}>{uploading ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </div>
  );
};

export default PubProfileTab; 