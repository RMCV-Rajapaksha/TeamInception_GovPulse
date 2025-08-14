import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Calendar, TimeSlots, BookingButton } from '../../components/services';

export default function AppointmentBookingPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(16);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [selectedLocation] = useState('Moratuwa');

  const timeSlots = [
    { id: '08:00-08:30', time: '08:00-08:30', available: false },
    { id: '08:30-09:00', time: '08:30-09:00', available: true },
    { id: '09:30-10:00', time: '09:30-10:00', available: true },
    { id: '11:00-11:30', time: '11:00-11:30', available: true },
    { id: '13:00-13:30', time: '13:00-13:30', available: false },
    { id: '13:30-14:00', time: '13:30-14:00', available: false },
  ];

  const handleDateClick = (date: number) => {
    setSelectedDate(date);
  };

  const handleTimeSlotClick = (slotId: string) => {
    const slot = timeSlots.find(s => s.id === slotId);
    if (slot?.available) {
      setSelectedTimeSlot(slotId);
    }
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
                  <div className="flex-1 flex flex-col gap-2 items-start justify-start min-w-0">
                    <div className="flex flex-row gap-2 items-center justify-start px-4 py-0 w-full">
                      <div 
                        className="flex-1 text-[#000000] text-[12px] text-left leading-normal"
                        style={{ fontFamily: 'var(--font-family-body)' }}
                      >
                        Choose a location
                      </div>
                    </div>
                    
                    <div className="bg-[#ebebeb] flex flex-row items-center justify-start min-h-11 p-2 rounded-lg w-full">
                      <div 
                        className="text-[#bbbbbb] text-[16px] text-left tracking-[0.16px] leading-[20px]"
                        style={{ fontFamily: 'var(--font-family-body)' }}
                      >
                        {selectedLocation}
                      </div>
                    </div>
                    
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
                    <button className="border border-[#bbbbbb] flex items-center justify-center w-11 h-11 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <FiChevronDown className="w-6 h-6 text-[#4b4b4b]" />
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
                  timeSlots={timeSlots}
                  selectedTimeSlot={selectedTimeSlot}
                  onTimeSlotSelect={handleTimeSlotClick}
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
