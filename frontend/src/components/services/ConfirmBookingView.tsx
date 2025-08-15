import { useState, useEffect } from 'react';
import { MapPin, Calendar } from '@phosphor-icons/react';

interface ConfirmBookingViewProps {
  onChangeDateTime: () => void;
  onConfirm: () => void;
  onTimeExpired: () => void;
  serviceLabel: string;
  locationLabel: string;
  dateTimeLabel: string;
}

export default function ConfirmBookingView({
  onChangeDateTime,
  onConfirm,
  onTimeExpired,
  serviceLabel,
  locationLabel,
  dateTimeLabel,
}: ConfirmBookingViewProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  
  // TODO: Get user details from backend/auth context
  // For now using mock data, will be replaced with actual user data from authentication
  const userDetails = {
    name: 'John Doe', // Will come from user account
    phone: '+94 77 123 4567', // Will come from user account  
    email: 'john.doe@email.com', // Will come from user account
  };

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeExpired]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    // User details are already available from their account
    // No need to validate as they're pre-filled from user profile
    onConfirm();
  };

  return (
    <div className="box-border flex flex-col gap-4 w-full">
      {/* Header with Countdown */}
      <div className="flex flex-col gap-6 px-4 pt-2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1
              className="font-bold text-[#000000] text-[32px] leading-normal"
              style={{ fontFamily: 'var(--font-family-title, "Plus Jakarta Sans")' }}
            >
              Review & Confirm
            </h1>
            <div className={`px-3 py-1 rounded-lg ${timeLeft <= 120 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-orange-600'}`}>
              <span className="text-sm font-semibold">Time left: {formatTime(timeLeft)}</span>
            </div>
          </div>
          {timeLeft <= 120 && (
            <div className="text-red-600 text-sm">
              ⚠️ Your time slot will be released soon! Please confirm your booking.
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div className="px-0 py-1">
        <div className="bg-[#d7d7d7] h-px w-full" />
      </div>

      {/* Card */}
      <div className="bg-[#ffffff] flex flex-col gap-2 max-w-[600px] w-full px-4 rounded-2xl">
        {/* Service row */}
        <div className="flex flex-row gap-2 items-start text-[16px]">
          <div className="text-[#4b4b4b] font-bold" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
            Service:
          </div>
          <div className="text-[#000000] tracking-[0.16px]" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
            {serviceLabel}
          </div>
        </div>

        {/* Location pill */}
        <div className="flex flex-row gap-2 items-center p-1">
          <MapPin size={16} className="text-[#007aff]" />
          <div
            className="text-[#007aff] text-[16px] tracking-[0.16px] text-center"
            style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
          >
            {locationLabel}
          </div>
        </div>

        {/* Date & time highlight */}
        <div className="bg-[#ffffa5] rounded-[8px] p-2 flex flex-row gap-4 items-center">
          <div className="rounded-3xl p-2 bg-gradient-to-b from-[#ffff7f] to-[#ffff00] relative shadow-[0_4px_4px_rgba(255,255,0,0.1),0_4px_12px_rgba(255,255,0,0.25)]">
            <div className="absolute inset-[-2px] rounded-[26px] border-2 border-[#ffffa5]" aria-hidden="true" />
            <Calendar size={24} className="text-[#000000]" />
          </div>
          <div className="flex flex-col gap-2" style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}>
            <div className="text-[#4b4b4b] text-[12px]">DATE & TIME</div>
            <div className="text-[#000000] text-[16px] tracking-[0.16px] leading-5">{dateTimeLabel}</div>
          </div>
        </div>

        {/* Your Details from Account */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-row items-center">
            <div
              className="font-bold text-[#4b4b4b] text-[16px] flex-1"
              style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
            >
              Your Details:
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              From your account
            </span>
          </div>
          
          <div className="bg-gray-50 rounded-[8px] p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Full Name:</span>
              <span className="text-sm text-gray-900">{userDetails.name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Contact Number:</span>
              <span className="text-sm text-gray-900">{userDetails.phone}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Email Address:</span>
              <span className="text-sm text-gray-900">{userDetails.email}</span>
            </div>
            
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
              💡 Tip: Update your profile information in account settings to modify these details
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-4 mb-4">
          <button
            className="w-full h-11 rounded-lg border border-[#a7a7a2]"
            style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
            onClick={onChangeDateTime}
          >
            <span className="text-[#000000] text-[18px] leading-[22px] font-bold">Change date & time</span>
          </button>
          <button
            className="w-full h-11 rounded-lg bg-gradient-to-b from-[#1e1e1d] to-[#000000] shadow-[0px_4px_4px_rgba(0,0,0,0.1),0px_4px_12px_rgba(0,0,0,0.25)]"
            style={{ fontFamily: 'var(--font-family-body, Satoshi)' }}
            onClick={handleConfirm}
          >
            <span className="text-white text-[18px] leading-[22px] font-bold">Confirm Booking</span>
          </button>
        </div>
      </div>
    </div>
  );
}
