import React, { useState } from 'react';
import { Clock, Music, User, DollarSign } from 'lucide-react';

const DJAnalyticsTab = ({ stats, statsMonth, onChangeMonth }) => {
  const [customYear, setCustomYear] = useState(new Date().getFullYear());
  const [customMonth, setCustomMonth] = useState(new Date().getMonth() + 1);

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    if (value !== 'custom') {
      onChangeMonth(value);
    } else {
      // If switching to custom, keep the current custom values
      onChangeMonth(`custom-${customYear}-${customMonth.toString().padStart(2, '0')}`);
    }
  };

  const handleCustomChange = (type, value) => {
    let year = customYear;
    let month = customMonth;
    if (type === 'year') year = parseInt(value);
    if (type === 'month') month = parseInt(value);
    setCustomYear(year);
    setCustomMonth(month);
    onChangeMonth(`custom-${year}-${month.toString().padStart(2, '0')}`);
  };

  // Parse for dropdown value
  let dropdownValue = statsMonth;
  if (statsMonth && statsMonth.startsWith('custom-')) dropdownValue = 'custom';

  return (
    <div className="bg-card border border-border min-h-[300px] p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-foreground">Performance Reports</h2>
        <div className="flex items-center gap-2">
          <select
            className="border border-border rounded px-3 py-1 text-sm focus:outline-none bg-background text-foreground"
            value={dropdownValue}
            onChange={handleDropdownChange}
          >
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom</option>
          </select>
          {dropdownValue === 'custom' && (
            <>
              <select
                className="border border-border rounded px-2 py-1 text-sm focus:outline-none ml-2 bg-background text-foreground"
                value={customYear}
                onChange={e => handleCustomChange('year', e.target.value)}
              >
                {Array.from({ length: 6 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
              <select
                className="border border-border rounded px-2 py-1 text-sm focus:outline-none ml-2 bg-background text-foreground"
                value={customMonth}
                onChange={e => handleCustomChange('month', e.target.value)}
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>{m}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* On-Time Performance */}
        <div className="bg-background rounded-lg shadow-sm p-6 flex flex-col justify-between min-h-[140px] border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">On-Time Performance</span>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mb-2 text-foreground">{stats.onTimePerformance}%</div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all"
              style={{ width: `${stats.onTimePerformance}%` }}
            ></div>
          </div>
        </div>
        {/* Total Events */}
        <div className="bg-background rounded-lg shadow-sm p-6 flex flex-col justify-between min-h-[140px] border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Total Events</span>
            <Music className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mb-1 text-foreground">{stats.totalEvents}</div>
          <div className="text-xs text-muted-foreground">This month</div>
        </div>
        {/* Client Retention */}
        <div className="bg-background rounded-lg shadow-sm p-6 flex flex-col justify-between min-h-[140px] border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Client Retention</span>
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mb-1 text-foreground">{stats.clientRetention}%</div>
          <div className="text-xs text-muted-foreground">Repeat bookings</div>
        </div>
        {/* Earnings */}
        <div className="bg-background rounded-lg shadow-sm p-6 flex flex-col justify-between min-h-[140px] border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Earnings</span>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mb-1 text-foreground">₹{stats.earnings.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">This month</div>
        </div>
      </div>
    </div>
  );
};

export default DJAnalyticsTab; 