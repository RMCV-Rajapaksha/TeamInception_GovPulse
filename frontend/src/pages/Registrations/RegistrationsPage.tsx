import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { 
  Car, 
  Baby, 
  Heart, 
  Globe, 
  X 
} from "@phosphor-icons/react";

// Phosphor Icon Component Map
const PhosphorIcons = {
  Car,
  Baby,
  Heart,
  Globe,
  X
} as const;

// Registration service categories data with Phosphor icons
const registrationCategories = [
  {
    id: "driving-license",
    title: "Driving License",
    description: "Apply for a new license, renew, or upgrade vehicle category.",
    icon: "Car" as keyof typeof PhosphorIcons
  },
  {
    id: "birth-certificate",
    title: "Birth Certificate", 
    description: "Apply for a new certificate or request a duplicate copy.",
    icon: "Baby" as keyof typeof PhosphorIcons
  },
  {
    id: "marriage-certificate",
    title: "Marriage Certificate",
    description: "Register your marriage or get an official copy.",
    icon: "Heart" as keyof typeof PhosphorIcons
  },
  {
    id: "visa-citizenship",
    title: "Visa & Citizenship",
    description: "Apply for visas, permanent residency, or citizenship-related services.",
    icon: "Globe" as keyof typeof PhosphorIcons
  },
  {
    id: "business-license",
    title: "Business License",
    description: "Register a new business or renew your existing license.",
    icon: "X" as keyof typeof PhosphorIcons
  }
];

export default function RegistrationsPage() {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === "driving-license") {
      navigate("/services/driving-license");
    } else {
      console.log(`Navigate to service: ${serviceId}`);
      // TODO: Add navigation to specific service pages
    }
  };

  return (
    <div className="relative w-full min-h-full overflow-x-hidden">
      <div className="w-full pb-24 md:ml-[14rem] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex flex-col min-h-full">
        <div className="w-full max-w-none md:max-w-[calc(100vw-14rem-4rem)] lg:max-w-[800px] flex flex-col gap-2 pb-2 pt-0 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col gap-6 px-4 py-0 w-full">
            <div className="flex flex-col gap-2 p-0 w-full">
              {/* Title */}
              <div className="flex flex-col gap-2 p-0 w-full">
                <h1 
                  className="font-bold text-[#000000] text-[32px] text-left w-full leading-normal"
                  style={{ fontFamily: 'var(--font-family-title)' }}
                >
                  Registrations & Licenses
                </h1>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="w-full box-border flex flex-row gap-2 items-center justify-start overflow-hidden px-0 py-1 relative">
            <div className="flex-1 bg-[#d7d7d7] h-px min-h-px" />
          </div>

          {/* Service Categories List */}
          <div className="w-full box-border flex flex-col gap-1 items-start justify-start px-0 py-1 relative">
            {registrationCategories.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="w-full bg-[#ffffff] box-border flex flex-row gap-3 sm:gap-4 items-center justify-start px-0 py-3 sm:py-2 relative hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                {/* Icon Container */}
                <div className="bg-[#ebebeb] box-border flex flex-row gap-2 items-center justify-center p-[6px] sm:p-[8px] relative rounded-[8px] flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
                  {(() => {
                    const IconComponent = PhosphorIcons[service.icon as keyof typeof PhosphorIcons];
                    return IconComponent ? (
                      <IconComponent 
                        size={20} 
                        weight="regular" 
                        className="text-[#4b4b4b]"
                      />
                    ) : (
                      <span className="text-base sm:text-lg">{service.icon}</span>
                    );
                  })()}
                </div>

                {/* Service Info */}
                <div className="flex-1 min-w-0 box-border flex flex-col items-start justify-start leading-[0] p-0 relative text-left">
                  <div className="w-full relative text-[#000000] text-[14px] sm:text-[16px] tracking-[0.16px] leading-[18px] sm:leading-[20px] font-medium truncate" style={{ fontFamily: 'var(--font-family-body)' }}>
                    {service.title}
                  </div>
                  <div className="w-full relative text-[#4b4b4b] text-[11px] sm:text-[12px] leading-normal mt-0.5" style={{ fontFamily: 'var(--font-family-body)' }}>
                    {service.description}
                  </div>
                </div>

                {/* Arrow Button */}
                <div className="box-border flex flex-row items-center justify-center w-8 h-8 sm:w-9 sm:h-9 p-0 relative flex-shrink-0">
                  <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#4b4b4b]" />
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
