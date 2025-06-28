import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DJProfileTab = ({
  profileData,
  setProfileData,
  performanceImages,
  performancePreviews,
  handleProfileImageChange,
  handlePerformanceImageChange,
  handleRemovePerformanceImage,
  handleProfileUpdate,
  newGenre,
  setNewGenre,
  handleAddGenre,
  handleRemoveGenre
}) => {
  if (!profileData) {
    return <div className="w-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground bg-card border border-border rounded-lg shadow">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Enrollment Required Card */}
      <div className="bg-card border border-yellow-200 rounded-xl p-6 shadow">
        <div className="flex items-center mb-4">
          <span className="text-yellow-500 mr-2 text-xl">★</span>
          <span className="font-semibold text-lg text-foreground">DJ Enrollment Required</span>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex-1 flex flex-col md:flex-row gap-6">
            <div>
              <div className="font-semibold mb-1 text-foreground">Free Plan (Current)</div>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>1 Free booking only</li>
                <li>Limited profile visibility</li>
                <li>Basic support</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-1 text-yellow-700">Enrolled Plan</div>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>4 Complimentary bookings (1 free + 3 enrollment)</li>
                <li>Unlimited wallet-based bookings after</li>
                <li>Enhanced profile visibility</li>
                <li>3 Months access</li>
                <li>Priority support</li>
                <li>Wallet top-up capability</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded mb-2 text-sm">Enrollment Fee<br /><span className="font-bold text-lg">₹500</span></div>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded">Enroll Now</Button>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Basic Information</div>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            {/* Avatar and Change Photo */}
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-primary">
              {profileData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <label htmlFor="profile-upload" className="flex items-center cursor-pointer">
                <span className="mr-2">📷</span>
                Change Photo
              </label>
            </Button>
            <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block mb-1">DJ Name</Label>
              <Input className="w-full" value={profileData.name} onChange={e => setProfileData(prev => ({...prev, name: e.target.value}))} />
            </div>
            <div>
              <Label className="block mb-1">Email</Label>
              <Input className="w-full" value={profileData.email} disabled />
            </div>
          </div>
        </div>
      </div>

      {/* Location & Contact */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Location & Contact</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="block mb-1">Country</Label>
            <Input className="w-full" value={profileData.country || 'India'} onChange={e => setProfileData(prev => ({...prev, country: e.target.value}))} />
          </div>
          <div>
            <Label className="block mb-1">State/Region</Label>
            <Input className="w-full" value={profileData.state || ''} onChange={e => setProfileData(prev => ({...prev, state: e.target.value}))} placeholder="Select state" />
          </div>
          <div>
            <Label className="block mb-1">City</Label>
            <Input className="w-full" value={profileData.city || ''} onChange={e => setProfileData(prev => ({...prev, city: e.target.value}))} placeholder="Select city" />
          </div>
          <div>
            <Label className="block mb-1">Pincode/Postal Code</Label>
            <Input className="w-full" value={profileData.pincode || ''} onChange={e => setProfileData(prev => ({...prev, pincode: e.target.value}))} placeholder="Enter pincode" />
          </div>
          <div>
            <Label className="block mb-1">Phone Number</Label>
            <Input className="w-full" value={profileData.phone} onChange={e => setProfileData(prev => ({...prev, phone: e.target.value}))} />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Images</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex flex-col items-center border-2 border-dashed border-border rounded-lg p-4 min-h-[140px] relative group bg-background">
              {performancePreviews[i] ? (
                <>
                  <img src={performancePreviews[i]} alt={`Performance ${i + 1}`} className="w-full h-32 object-cover rounded mb-2" />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 rounded-full p-1 shadow"
                    onClick={() => handleRemovePerformanceImage(i)}
                  >
                    ×
                  </Button>
                </>
              ) : (
                <>
                  <span className="w-8 h-8 text-muted-foreground mb-2">+</span>
                  <div className="text-sm text-muted-foreground mb-2">Upload Image {i + 1}<br /><span className="text-xs">Max 200KB</span></div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`performance-image-${i}`}
                    onChange={e => handlePerformanceImageChange(i, e.target.files[0])}
                  />
                  <Label htmlFor={`performance-image-${i}`} className="px-3 py-1 bg-muted rounded cursor-pointer text-xs border border-border hover:bg-accent">Choose File</Label>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preferred Music Genres */}
      <div className="bg-card border border-border rounded-xl p-6 shadow">
        <div className="font-semibold text-lg mb-4 text-foreground">Preferred Music Genres</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {["House","Techno","Hip Hop","R&B","Pop","Rock","Electronic","Bollywood","Punjabi","Commercial","Jazz","Blues","Reggae","Country","Classical","Trance","Dubstep","Ambient","Folk","Latin"].map(genre => (
            <label key={genre} className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input
                type="checkbox"
                checked={profileData.genres?.includes(genre)}
                onChange={e => {
                  if (e.target.checked) setProfileData(prev => ({...prev, genres: [...(prev.genres || []), genre]}));
                  else setProfileData(prev => ({...prev, genres: prev.genres.filter(g => g !== genre)}));
                }}
                className="accent-primary w-4 h-4 rounded"
              />
              {genre}
            </label>
          ))}
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleProfileUpdate} className="bg-primary text-white">Save Changes</Button>
      </div>
    </div>
  );
};

export default DJProfileTab; 