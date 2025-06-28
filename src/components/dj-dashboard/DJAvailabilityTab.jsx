import React from 'react';
import { Calendar } from '@/components/ui/calendar.jsx';
import Modal from '@/components/ui/Modal.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

const DJAvailabilityTab = ({
  selectedDate,
  setSelectedDate,
  availability,
  setAvailability,
  selectedDayStatus,
  setSelectedDayStatus,
  bulkModalOpen,
  setBulkModalOpen,
  bulkRange,
  setBulkRange,
  bulkStatus,
  setBulkStatus,
  bulkError,
  setBulkError,
  handleBulkApply,
  manageModalOpen,
  setManageModalOpen,
  manageDate,
  setManageDate,
  manageStatus,
  setManageStatus,
  openManageModal,
  handleManageSave,
  handleCalendarSelect,
  CustomDayContent,
  getCurrentWeek,
  handleSetDayAvailability,
  X
}) => {
  if (!availability) {
    return <div className="w-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground bg-card border border-border rounded-lg shadow">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0">
      {/* Bulk Set Availability Modal */}
      <Modal open={bulkModalOpen} onClose={() => setBulkModalOpen(false)} title="Bulk Set Availability">
        <p className="text-sm text-muted-foreground mb-4">Select a date range and set all days as Available or Not Available. This will overwrite existing availability for those days.</p>
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">Start Date</Label>
            <Input type="date" className="w-full" value={bulkRange.start} onChange={e => setBulkRange(r => ({ ...r, start: e.target.value, end: r.end && r.end < e.target.value ? '' : r.end }))} max={bulkRange.end || undefined} />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">End Date</Label>
            <Input type="date" className="w-full" value={bulkRange.end} onChange={e => setBulkRange(r => ({ ...r, end: e.target.value }))} min={bulkRange.start ? bulkRange.start : undefined} />
          </div>
          {bulkError && <div className="text-red-600 text-sm mb-2">{bulkError}</div>}
          <div>
            <Label className="block text-sm font-medium mb-1">Set as</Label>
            <div className="flex gap-4">
              <Button
                variant={bulkStatus === 'available' ? 'default' : 'outline'}
                className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 ${bulkStatus === 'available' ? 'border-green-500 bg-green-50' : ''}`}
                onClick={() => setBulkStatus('available')}
                type="button"
              >
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block mr-2"></span>
                Available
              </Button>
              <Button
                variant={bulkStatus === 'not_available' ? 'destructive' : 'outline'}
                className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 ${bulkStatus === 'not_available' ? 'border-red-400 bg-red-50' : ''}`}
                onClick={() => setBulkStatus('not_available')}
                type="button"
              >
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-2"></span>
                Not Available
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setBulkModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-white" onClick={handleBulkApply}>Apply</Button>
          </div>
        </div>
      </Modal>
      {/* Manage Day Modal */}
      <Modal open={manageModalOpen} onClose={() => setManageModalOpen(false)} title="Manage Availability">
        <p className="text-sm text-muted-foreground mb-4">Set your availability for this day. This will update your schedule for {manageDate ? manageDate.toLocaleDateString() : ''}.</p>
        <div className="space-y-4">
          <div className="font-semibold text-lg mb-2">{manageDate ? manageDate.toLocaleDateString() : ''}</div>
          <div className="flex flex-col gap-2">
            <Button
              variant={manageStatus === 'available' ? 'default' : 'outline'}
              className={`flex items-center gap-2 px-4 py-2 text-left ${manageStatus === 'available' ? 'border-green-500 bg-green-50' : ''}`}
              onClick={() => setManageStatus('available')}
              type="button"
            >
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span className="font-medium">Entire Day Available</span>
              <span className="text-xs text-muted-foreground ml-2">Available from 12:00 AM to 11:59 PM</span>
            </Button>
            <Button
              variant={manageStatus !== 'available' ? 'destructive' : 'outline'}
              className={`flex items-center gap-2 px-4 py-2 text-left ${manageStatus !== 'available' ? 'border-red-400 bg-red-50' : ''}`}
              onClick={() => setManageStatus('not_available')}
              type="button"
            >
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="font-medium">Entire Day Not Available</span>
            </Button>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setManageModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-white" onClick={handleManageSave}>Save</Button>
          </div>
        </div>
      </Modal>
      {/* END: All Modals at top level */}
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
        {/* Left: Calendar */}
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 w-full md:w-1/2 shadow-sm hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-xl font-bold text-foreground">Availability & Pricing</h2>
            <Button
              size="sm"
              className="bg-primary font-semibold shadow hover:bg-primary/90 transition"
              onClick={() => setBulkModalOpen(true)}
            >
              Bulk Set Availability
            </Button>
          </div>
          <div className="mb-2 md:mb-4">
            <div className="font-semibold mb-1 text-foreground">Manage Your Schedule & Pricing</div>
            <div className="text-sm text-muted-foreground">Set your availability and pricing for each date. Available period: 12:00 AM - 11:59 PM (Full Day)</div>
          </div>
          <div className="mb-2 md:mb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              // className=""
              components={{ DayContent: CustomDayContent }}
            />
          </div>
        </div>

        {/* Right: Selected Date & Set Availability */}
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 w-full md:w-1/2 shadow-sm hover:shadow-lg transition-all duration-200">
          <div>
            <div className="font-semibold text-lg mb-2 text-foreground text-center md:text-left">{selectedDate instanceof Date && !isNaN(selectedDate) ? selectedDate.toLocaleDateString() : ''}</div>
            <div className="flex flex-col gap-2 mb-2">
              {/* Available Button */}
              <Button
                variant="ghost"
                size="lg"
                className={`flex items-center justify-between gap-3 px-4 py-4 w-full text-left rounded-xl border-2 transition-all duration-200
                  ${selectedDayStatus === 'available'
                    ? 'border-green-500 bg-green-50 text-green-900 shadow-md'
                    : 'border-border bg-background text-foreground hover:border-green-400 hover:bg-green-50/60'}
                `}
                style={{ boxShadow: selectedDayStatus === 'available' ? '0 2px 12px 0 rgba(34,197,94,0.10)' : undefined }}
                onClick={() => handleSetDayAvailability('available')}
                aria-pressed={selectedDayStatus === 'available'}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${selectedDayStatus === 'available' ? 'bg-green-500 border-green-600' : 'bg-muted border-border'}`}>
                    {selectedDayStatus === 'available' && <CheckCircle className="w-4 h-4 text-white" />}
                  </span>
                  <span className="text-base font-semibold">Entire Day Available</span>
                </div>
                <span className="text-xs text-muted-foreground ml-2">12:00 AM - 11:59 PM</span>
              </Button>
              {/* Not Available Button */}
              <Button
                variant="ghost"
                size="lg"
                className={`flex items-center justify-between gap-3 px-4 py-4 w-full text-left rounded-xl border-2 transition-all duration-200
                  ${selectedDayStatus !== 'available'
                    ? 'border-red-500 bg-red-50 text-red-900 shadow-md'
                    : 'border-border bg-background text-foreground hover:border-red-400 hover:bg-red-50/60'}
                `}
                style={{ boxShadow: selectedDayStatus !== 'available' ? '0 2px 12px 0 rgba(239,68,68,0.10)' : undefined }}
                onClick={() => handleSetDayAvailability('not_available')}
                aria-pressed={selectedDayStatus !== 'available'}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${selectedDayStatus !== 'available' ? 'bg-red-500 border-red-600' : 'bg-muted border-border'}`}>
                    {selectedDayStatus !== 'available' && <XCircle className="w-4 h-4 text-white" />}
                  </span>
                  <span className="text-base font-semibold">Entire Day Not Available</span>
                </div>
              </Button>
            </div>
            {/* Availability Options */}
            <div className="mb-2 mt-2">
              <div className="font-semibold text-sm mb-1 text-foreground">Availability Options</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span className="text-xs text-muted-foreground">Entire Day Available (12:00 AM - 11:59 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="text-xs text-muted-foreground">Entire Day Not Available</span>
              </div>
            </div>
            {/* Booking Duration Options */}
            <div className="mb-1">
              <div className="font-semibold text-sm mb-1 text-foreground">Booking Duration Options</div>
              <ul className="list-disc ml-5 space-y-0.5 text-xs text-muted-foreground">
                <li>1-2 hours: Short events, quick performances</li>
                <li>2-4 hours: Standard events, parties</li>
                <li>4-8 hours: Extended events, celebrations</li>
                <li>8+ hours: Long events, festivals, custom pricing</li>
              </ul>
            </div>
            {selectedDayStatus !== 'available' && (
              <div className="mt-3 p-3 border border-red-200 bg-red-50 rounded text-red-700 flex items-center gap-2">
                <X className="w-4 h-4" />
                <span>You are not available on this date. Select "Entire Day Available" above to start receiving bookings.</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Weekly Overview */}
      <div className="mt-7 md:mt-8">
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-200">
          <div className="font-semibold text-lg mb-3 md:mb-4 text-foreground">Weekly Overview</div>
          <div className="divide-y divide-border">
            {getCurrentWeek().map((date, idx) => {
              const dateStr = date.toISOString().slice(0, 10);
              const slot = availability.find(a => a.date === dateStr);
              const isAvailable = slot && slot.status === 'available';
              return (
                <div key={dateStr} className="flex items-center justify-between py-2 md:py-3">
                  <div>
                    <div className="font-medium text-foreground">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-xs text-muted-foreground">{date.toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'} inline-block`}></span>
                      <span className="text-sm font-medium">{isAvailable ? 'Available' : 'Not Available'}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3 py-1 border border-border rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition"
                      onClick={() => openManageModal(date)}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJAvailabilityTab; 