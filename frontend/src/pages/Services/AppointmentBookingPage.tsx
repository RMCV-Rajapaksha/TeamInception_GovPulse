import { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Calendar, TimeSlots, BookingButton, type TimeSlot } from '../../components/services';

export default function AppointmentBookingPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Location data
  const locations = [
    { id: 'colombo', name: 'Colombo', district: 'Colombo', province: 'Western' },
    { id: 'moratuwa', name: 'Moratuwa', district: 'Colombo', province: 'Western' },
    { id: 'gampaha', name: 'Gampaha', district: 'Gampaha', province: 'Western' },
    { id: 'kalutara', name: 'Kalutara', district: 'Kalutara', province: 'Western' },
    { id: 'kandy', name: 'Kandy', district: 'Kandy', province: 'Central' },
    { id: 'matale', name: 'Matale', district: 'Matale', province: 'Central' },
    { id: 'nuwara-eliya', name: 'Nuwara Eliya', district: 'Nuwara Eliya', province: 'Central' },
    { id: 'galle', name: 'Galle', district: 'Galle', province: 'Southern' },
    { id: 'matara', name: 'Matara', district: 'Matara', province: 'Southern' },
    { id: 'hambantota', name: 'Hambantota', district: 'Hambantota', province: 'Southern' },
    { id: 'jaffna', name: 'Jaffna', district: 'Jaffna', province: 'Northern' },
    { id: 'batticaloa', name: 'Batticaloa', district: 'Batticaloa', province: 'Eastern' },
    { id: 'trincomalee', name: 'Trincomalee', district: 'Trincomalee', province: 'Eastern' },
    { id: 'ampara', name: 'Ampara', district: 'Ampara', province: 'Eastern' },
    { id: 'anuradhapura', name: 'Anuradhapura', district: 'Anuradhapura', province: 'North Central' },
    { id: 'polonnaruwa', name: 'Polonnaruwa', district: 'Polonnaruwa', province: 'North Central' },
    { id: 'kurunegala', name: 'Kurunegala', district: 'Kurunegala', province: 'North Western' },
    { id: 'puttalam', name: 'Puttalam', district: 'Puttalam', province: 'North Western' },
    { id: 'ratnapura', name: 'Ratnapura', district: 'Ratnapura', province: 'Sabaragamuwa' },
    { id: 'kegalle', name: 'Kegalle', district: 'Kegalle', province: 'Sabaragamuwa' },
    { id: 'badulla', name: 'Badulla', district: 'Badulla', province: 'Uva' },
    { id: 'monaragala', name: 'Monaragala', district: 'Monaragala', province: 'Uva' }
  ];

  // Filter locations based on search term
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
    location.district.toLowerCase().includes(locationSearchTerm.toLowerCase()) ||
    location.province.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );

  // Mock data: Different time slots for different dates
  const dateTimeSlots: Record<number, TimeSlot[]> = {
    12: [
      { id: '12-08:00-08:30', time: '08:00-08:30', available: false },
      { id: '12-08:30-09:00', time: '08:30-09:00', available: true },
      { id: '12-09:30-10:00', time: '09:30-10:00', available: true },
      { id: '12-11:00-11:30', time: '11:00-11:30', available: true },
      { id: '12-13:00-13:30', time: '13:00-13:30', available: false },
      { id: '12-13:30-14:00', time: '13:30-14:00', available: false },
    ],
    16: [
      { id: '16-08:00-08:30', time: '08:00-08:30', available: true },
      { id: '16-08:30-09:00', time: '08:30-09:00', available: true },
      { id: '16-09:30-10:00', time: '09:30-10:00', available: false },
      { id: '16-11:00-11:30', time: '11:00-11:30', available: true },
      { id: '16-13:00-13:30', time: '13:00-13:30', available: true },
      { id: '16-13:30-14:00', time: '13:30-14:00', available: false },
    ],
    19: [
      { id: '19-08:00-08:30', time: '08:00-08:30', available: false },
      { id: '19-08:30-09:00', time: '08:30-09:00', available: false },
      { id: '19-09:30-10:00', time: '09:30-10:00', available: true },
      { id: '19-11:00-11:30', time: '11:00-11:30', available: true },
      { id: '19-13:00-13:30', time: '13:00-13:30', available: false },
      { id: '19-13:30-14:00', time: '13:30-14:00', available: false },
    ],
    22: [
      { id: '22-08:00-08:30', time: '08:00-08:30', available: true },
      { id: '22-08:30-09:00', time: '08:30-09:00', available: true },
      { id: '22-09:30-10:00', time: '09:30-10:00', available: true },
      { id: '22-11:00-11:30', time: '11:00-11:30', available: true },
      { id: '22-13:00-13:30', time: '13:00-13:30', available: true },
      { id: '22-13:30-14:00', time: '13:30-14:00', available: false },
    ],
    23: [
      { id: '23-08:00-08:30', time: '08:00-08:30', available: true },
      { id: '23-08:30-09:00', time: '08:30-09:00', available: true },
      { id: '23-09:30-10:00', time: '09:30-10:00', available: true },
      { id: '23-11:00-11:30', time: '11:00-11:30', available: true },
      { id: '23-13:00-13:30', time: '13:00-13:30', available: true },
      { id: '23-13:30-14:00', time: '13:30-14:00', available: true },
    ],
    24: [
      { id: '24-08:00-08:30', time: '08:00-08:30', available: false },
      { id: '24-08:30-09:00', time: '08:30-09:00', available: true },
      { id: '24-09:30-10:00', time: '09:30-10:00', available: true },
      { id: '24-11:00-11:30', time: '11:00-11:30', available: true },
      { id: '24-13:00-13:30', time: '13:00-13:30', available: false },
      { id: '24-13:30-14:00', time: '13:30-14:00', available: false },
    ],
    25: [
      { id: '25-08:00-08:30', time: '08:00-08:30', available: false },
      { id: '25-08:30-09:00', time: '08:30-09:00', available: false },
      { id: '25-09:30-10:00', time: '09:30-10:00', available: false },
      { id: '25-11:00-11:30', time: '11:00-11:30', available: true },
      { id: '25-13:00-13:30', time: '13:00-13:30', available: false },
      { id: '25-13:30-14:00', time: '13:30-14:00', available: false },
    ],
    26: [
      { id: '26-08:00-08:30', time: '08:00-08:30', available: true },
      { id: '26-08:30-09:00', time: '08:30-09:00', available: true },
      { id: '26-09:30-10:00', time: '09:30-10:00', available: false },
      { id: '26-11:00-11:30', time: '11:00-11:30', available: true },
      { id: '26-13:00-13:30', time: '13:00-13:30', available: true },
      { id: '26-13:30-14:00', time: '13:30-14:00', available: false },
    ],
    29: [
      { id: '29-08:00-08:30', time: '08:00-08:30', available: false },
      { id: '29-08:30-09:00', time: '08:30-09:00', available: true },
      { id: '29-09:30-10:00', time: '09:30-10:00', available: true },
      { id: '29-11:00-11:30', time: '11:00-11:30', available: false },
      { id: '29-13:00-13:30', time: '13:00-13:30', available: false },
      { id: '29-13:30-14:00', time: '13:30-14:00', available: false },
    ],
    30: [
      { id: '30-08:00-08:30', time: '08:00-08:30', available: true },
      { id: '30-08:30-09:00', time: '08:30-09:00', available: false },
      { id: '30-09:30-10:00', time: '09:30-10:00', available: true },
      { id: '30-11:00-11:30', time: '11:00-11:30', available: true },
      { id: '30-13:00-13:30', time: '13:00-13:30', available: false },
      { id: '30-13:30-14:00', time: '13:30-14:00', available: false },
    ],
  };

  // Get time slots for a specific date
  const getTimeSlotsForDate = (date: number) => {
    return dateTimeSlots[date] || [];
  };

  // Get current time slots based on selected date
  const currentTimeSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : [];

  const handleDateClick = (date: number) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotClick = (slotId: string) => {
    const slot = currentTimeSlots.find(s => s.id === slotId);
    if (slot?.available) {
      setSelectedTimeSlot(slotId);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
    setLocationSearchTerm('');
  };

  const toggleLocationDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedTimeSlot) {
      console.log('Booking appointment:', {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        location: selectedLocation
      });
      // TODO: Add booking logic
    }
  };

  return (
    <div className="relative w-full min-h-full overflow-x-hidden">
      <div className="w-full pb-24 md:ml-[14rem] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col min-h-full">
        <div className="w-full max-w-none md:max-w-[calc(100vw-14rem-4rem)] lg:max-w-[1000px] flex flex-col gap-2 pb-2 pt-0 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col gap-12 px-4 py-4 w-full">
            <div className="flex flex-col gap-4 p-0 w-full">
              <h1 
                className="font-bold text-[#000000] text-[32px] text-left w-full leading-normal"
                style={{ fontFamily: 'var(--font-family-title)' }}
              >
                Appointment booking
              </h1>
            </div>
          </div>

          {/* Separator */}
          <div className="w-full box-border flex flex-row gap-2 items-center justify-start overflow-hidden px-0 py-2 relative">
            <div className="flex-1 bg-[#d7d7d7] h-px min-h-px" />
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-start p-0 w-full">
            {/* Left Panel */}
            <div className="flex-1 flex flex-col gap-8 items-start justify-start max-w-[500px] p-0">
              
              {/* License Info */}
              <div className="flex flex-row gap-2 items-center justify-start px-4 py-0 w-full">
                <div 
                  className="font-bold text-[#4b4b4b] text-[18px] leading-[22px]"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  License type:
                </div>
                <div 
                  className="text-[#000000] text-[16px] leading-[20px] tracking-[0.16px]"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  Light Vehicles (B/B1)
                </div>
              </div>

              {/* Office Location */}
              <div className="flex flex-col items-start justify-start px-4 py-0 w-full">
                <div 
                  className="font-bold text-[#4b4b4b] text-[18px] text-left w-full leading-[22px] mb-8"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  Select office location
                </div>
                
                <div className="flex flex-row gap-2 items-center justify-start w-full">
                  <div ref={dropdownRef} className="flex-1 flex flex-col gap-2 items-start justify-start min-w-0 relative">
                    <div className="flex flex-row gap-2 items-center justify-start px-4 py-0 w-full">
                      <div 
                        className="flex-1 text-[#000000] text-[12px] text-left leading-normal"
                        style={{ fontFamily: 'var(--font-family-body)' }}
                      >
                        Choose a location
                      </div>
                    </div>
                    
                    <div className="bg-[#ebebeb] flex flex-row items-center justify-start min-h-11 p-2 rounded-[16px] w-full relative">
                      <input
                        type="text"
                        placeholder={selectedLocation || "Search for a location..."}
                        value={locationSearchTerm}
                        onChange={(e) => setLocationSearchTerm(e.target.value)}
                        onFocus={() => setIsLocationDropdownOpen(true)}
                        className="flex-1 bg-transparent text-[#000000] text-[16px] tracking-[0.16px] leading-[20px] placeholder-black outline-none"
                        style={{ fontFamily: 'var(--font-family-body)' }}
                      />
                    </div>

                    {/* Dropdown Menu */}
                    {isLocationDropdownOpen && (
                      <div className="absolute top-full left-0 w-full bg-white border border-[#ebebeb] rounded-[16px] shadow-lg z-50 max-h-60 overflow-y-auto">
                        {filteredLocations.length > 0 ? (
                          filteredLocations.map((location) => (
                            <button
                              key={location.id}
                              onClick={() => handleLocationSelect(location.name)}
                              className="w-full px-4 py-3 text-left hover:bg-[#f5f5f5] transition-colors border-b border-[#f0f0f0] last:border-b-0"
                            >
                              <div 
                                className="text-[#000000] text-[14px] leading-normal font-medium"
                                style={{ fontFamily: 'var(--font-family-body)' }}
                              >
                                {location.name}
                              </div>
                              <div 
                                className="text-[#888888] text-[12px] leading-normal"
                                style={{ fontFamily: 'var(--font-family-body)' }}
                              >
                                {location.district} District, {location.province} Province
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-[#bbbbbb] text-[14px]" style={{ fontFamily: 'var(--font-family-body)' }}>
                            No locations found
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex flex-row gap-2 items-center justify-start px-4 py-0 w-full">
                      <div 
                        className="flex-1 text-[#4b4b4b] text-[12px] text-left leading-normal"
                        style={{ fontFamily: 'var(--font-family-body)' }}
                      >
                        Pick the most convenient government office to complete your appointment.
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row items-center self-stretch">
                    <button 
                      onClick={toggleLocationDropdown}
                      className="border border-[#bbbbbb] flex items-center justify-center w-11 h-11 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiChevronDown className={`w-6 h-6 text-[#4b4b4b] transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="flex flex-col gap-2 items-start justify-start px-4 py-0 w-full">
                <div 
                  className="font-bold text-[#4b4b4b] text-[18px] w-full leading-[22px]"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  Common requirements
                </div>
                <div 
                  className="text-[#000000] text-[14px] w-full leading-normal"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  <ul className="list-disc ml-[18px] space-y-0">
                    <li>Applicant should be present in person.</li>
                    <li>Should bring the national identity card or the valid passport with the national identity card number.</li>
                    <li className="whitespace-pre-wrap">In obtaining the service from offices where online method is available producing photographs is not required and the relevant photographs are taken during the computer process. For offices where offline method is used two passport size black and white photographs with white background are required.</li>
                    <li>In obtaining a driving license for the first time, original of the birth certificate should be produced.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Panel - Calendar and Booking */}
            <div className="flex-1 flex flex-col gap-8 items-start justify-start min-w-0 px-0 py-0">
              
              {/* Calendar Container */}
              <div className="flex flex-col items-start justify-start w-full">
                <div className="flex flex-row gap-2 items-center justify-start pb-4 pt-0 w-full">
                  <div 
                    className="flex-1 font-bold text-[#4b4b4b] text-[18px] text-left leading-[22px]"
                    style={{ fontFamily: 'var(--font-family-body)' }}
                  >
                    Select your appointment date & time
                  </div>
                </div>

                {/* Calendar Component */}
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateClick}
                  selectedTab={selectedTab}
                  onTabChange={setSelectedTab}
                />
              </div>

              {/* Time Slots */}
              <div className="flex flex-col gap-8 items-start justify-start self-stretch">
                <TimeSlots
                  timeSlots={currentTimeSlots}
                  selectedTimeSlot={selectedTimeSlot}
                  onTimeSlotSelect={handleTimeSlotClick}
                  selectedDate={selectedDate}
                />

                {/* Book Button */}
                <BookingButton
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTimeSlot}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
