import { useNavigate } from 'react-router-dom';

export default function DrivingLicensePage() {
  const navigate = useNavigate();

  const handleBookLightVehicle = () => {
    navigate('/services/driving-license/book');
  };

  const handleBookHeavyVehicle = () => {
    navigate('/services/driving-license/book');
  };

  return (
    <div className="relative w-full min-h-full overflow-x-hidden">
      <div className="w-full pb-24 md:ml-[14rem] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col min-h-full">
        <div className="w-full max-w-none md:max-w-[calc(100vw-14rem-4rem)] lg:max-w-[1200px] flex flex-col gap-2 pb-2 pt-0 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col gap-6 px-4 py-0 w-full">
            <div className="flex flex-col gap-2 p-0 w-full">
              {/* Title */}
              <div className="flex flex-col gap-2 p-0 w-full">
                <h1 
                  className="font-bold text-[#000000] text-[32px] text-left w-full leading-normal"
                  style={{ fontFamily: 'var(--font-family-title)' }}
                >
                  Driving License
                </h1>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="w-full box-border flex flex-row gap-2 items-center justify-start overflow-hidden px-0 py-1 relative">
            <div className="flex-1 bg-[#d7d7d7] h-px min-h-px" />
          </div>

          {/* Question */}
          <div className="flex flex-row gap-2 items-start justify-start px-4 py-0 w-full">
            <div className="py-3 flex-1 font-bold text-[#4b4b4b] text-[16px] text-left leading-normal" style={{ fontFamily: 'var(--font-family-body)' }}>
              Which license are you applying for?
            </div>
          </div>

          {/* License Cards Container */}
          <div className="flex flex-wrap gap-8 items-start justify-start px-4 py-0 w-full">
            {/* Light Vehicles Card */}
            <div className="flex-1 min-w-[300px] max-w-[468px] bg-white border border-[#d7d7d7] rounded-2xl p-6 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] flex flex-col gap-8">
              <h2 
                className="font-bold text-[#000000] text-[18px] text-left leading-[22px] w-full"
                style={{ fontFamily: 'var(--font-family-body)' }}
              >
                Light Vehicles (B/B1)
              </h2>
              
              <div 
                className="text-[#000000] text-[16px] text-left leading-[20px] w-full"
                style={{ fontFamily: 'var(--font-family-body)' }}
              >
                <ul className="list-disc ml-6 space-y-2">
                  <li>Must be 17+ to register for written test</li>
                  <li>Learner's permit valid up to 18 months</li>
                  <li>Must be 18+ and hold permit for 3+ months to take practical test</li>
                  <li>Aptitude medical certificate (issued within last 6 months) required</li>
                </ul>
              </div>

              <button
                onClick={handleBookLightVehicle}
                className="w-full border border-[#a7a7a2] rounded-lg h-11 flex items-center justify-center px-4 py-2 hover:opacity-90 transition-all active:opacity-80"
                style={{ backgroundColor: '#FFFF80' }}
              >
                <span 
                  className="font-bold text-[#000000] text-[18px] leading-[22px]"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  Book
                </span>
              </button>
            </div>

            {/* Heavy Vehicles Card */}
            <div className="flex-1 min-w-[300px] max-w-[468px] bg-white border border-[#d7d7d7] rounded-2xl p-6 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] flex flex-col gap-8">
              <h2 
                className="font-bold text-[#000000] text-[18px] text-left leading-[22px] w-full"
                style={{ fontFamily: 'var(--font-family-body)' }}
              >
                Heavy Vehicles
              </h2>
              
              <div 
                className="text-[#000000] text-[16px] text-left leading-[20px] w-full"
                style={{ fontFamily: 'var(--font-family-body)' }}
              >
                <ul className="list-disc ml-6 space-y-2">
                  <li>Must hold light vehicle license for 2+ years</li>
                  <li>Minimum height: 4'10" (light bus/lorry), 5' (motor bus/lorry)</li>
                  <li>Must be 20+ for written test, 21+ for practical test</li>
                  <li>Same learner's permit and medical certificate rules apply</li>
                </ul>
              </div>

              <button
                onClick={handleBookHeavyVehicle}
                className="w-full border border-[#a7a7a2] rounded-2xl h-11 flex items-center justify-center px-4 py-2 hover:opacity-90 transition-all active:opacity-80"
                style={{ backgroundColor: '#FFFF80' }}
              >
                <span 
                  className="font-bold text-[#000000] text-[18px] leading-[22px]"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                >
                  Book
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
