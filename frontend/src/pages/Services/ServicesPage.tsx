import { useState } from "react";
import { FiSearch, FiChevronRight } from "react-icons/fi";
import { 
  Plant, 
  CurrencyDollar, 
  ClipboardText, 
  WifiHigh, 
  GraduationCap, 
  Briefcase, 
  Tree, 
  Hospital, 
  House, 
  Scales, 
  Factory, 
  Airplane 
} from "@phosphor-icons/react";

// Phosphor Icon Component Map
const PhosphorIcons = {
  Plant,
  CurrencyDollar,
  ClipboardText,
  WifiHigh,
  GraduationCap,
  Briefcase,
  Tree,
  Hospital,
  House,
  Scales,
  Factory,
  Airplane
} as const;

// Service categories data with Phosphor icons
const serviceCategories = [
  {
    id: "agriculture",
    title: "Agriculture & Fisheries",
    description: "Grow, farm, and fishery-related services",
    icon: "Plant" as keyof typeof PhosphorIcons
  },
  {
    id: "finance",
    title: "Finance & Taxes",
    description: "Banking, tax, insurance, and money services",
    icon: "CurrencyDollar" as keyof typeof PhosphorIcons
  },
  {
    id: "registrations",
    title: "Registrations & Licenses",
    description: "Birth, marriage, driving license, visas",
    icon: "ClipboardText" as keyof typeof PhosphorIcons
  },
  {
    id: "communication",
    title: "Communication & Media",
    description: "Media, telecom, and culture",
    icon: "WifiHigh" as keyof typeof PhosphorIcons
  },
  {
    id: "education",
    title: "Education & Training",
    description: "Primary, secondary, vocational education",
    icon: "GraduationCap" as keyof typeof PhosphorIcons
  },
  {
    id: "employment",
    title: "Employment & Skills",
    description: "EPF, ETF, pensions, skills",
    icon: "Briefcase" as keyof typeof PhosphorIcons
  },
  {
    id: "environment",
    title: "Environment",
    description: "Environmental services and permits",
    icon: "Tree" as keyof typeof PhosphorIcons
  },
  {
    id: "health",
    title: "Health & Social Services",
    description: "Healthcare, welfare, and NGOs",
    icon: "Hospital" as keyof typeof PhosphorIcons
  },
  {
    id: "housing",
    title: "Housing & Utilities",
    description: "Property, land, housing, water, electricity",
    icon: "House" as keyof typeof PhosphorIcons
  },
  {
    id: "law",
    title: "Law & Public Safety",
    description: "Justice, security, and rights",
    icon: "Scales" as keyof typeof PhosphorIcons
  },
  {
    id: "business",
    title: "Business & Industry",
    description: "Trade, industry, economic statistics",
    icon: "Factory" as keyof typeof PhosphorIcons
  },
  {
    id: "travel",
    title: "Travel & Leisure",
    description: "Tourism, transport, leisure services",
    icon: "Airplane" as keyof typeof PhosphorIcons
  }
];

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = serviceCategories.filter(
    service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleServiceClick = (serviceId: string) => {
    // Navigate to specific service category
    console.log(`Navigate to service: ${serviceId}`);
  };

  return (
    <div className="relative w-full min-h-full overflow-x-hidden">
      <div className="w-full pb-24 md:ml-[14rem] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 box-border flex flex-col items-start justify-start min-h-full">
        <div className="w-full max-w-none md:max-w-[calc(100vw-14rem-4rem)] lg:max-w-[800px] box-border flex flex-col gap-4 sm:gap-6 items-start justify-start pb-2 pt-0 relative z-10">{" "}
          
          {/* Header */}
          <div className="w-full box-border flex flex-col gap-4 sm:gap-6 items-start justify-start pb-0 pt-2 px-0 relative">
            <div className="w-full box-border flex flex-col gap-2 items-start justify-start p-0 relative">
              <div className="w-full box-border flex flex-col gap-2 items-start justify-start leading-[0] p-0 relative text-left">
                <h1 className="font-bold relative w-full text-[#000000] text-[24px] sm:text-[28px] md:text-[32px]" style={{ fontFamily: 'var(--font-family-title)' }}>
                  Government services
                </h1>
                <p className="relative w-full text-[#4b4b4b] text-[14px] sm:text-[16px] tracking-[0.16px] leading-[18px] sm:leading-[20px]" style={{ fontFamily: 'var(--font-family-body)' }}>
                  Find and schedule an appointment for the service you need — without the queues.
                </p>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="w-full box-border flex flex-row gap-2 items-center justify-start overflow-hidden px-0 py-1 relative">
            <div className="flex-1 bg-[#d7d7d7] h-px min-h-px" />
          </div>

          {/* Search Input */}
          <div className="w-full box-border flex flex-col gap-4 items-start justify-start px-0 py-0 relative">
            <div className="w-full box-border flex flex-row items-start justify-start p-0 relative">
              <div className="w-full box-border flex flex-row gap-3 sm:gap-4 items-center justify-start min-h-10 sm:min-h-11 p-[6px] sm:p-[8px] relative rounded-xl sm:rounded-2xl border border-[#a7a7a2]">
                <FiSearch className="w-5 h-5 sm:w-6 sm:h-6 text-[#4b4b4b] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for a Service"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent outline-none text-[#4b4b4b] text-[14px] sm:text-[16px] tracking-[0.16px] leading-[18px] sm:leading-[20px]"
                  style={{ fontFamily: 'var(--font-family-body)' }}
                />
              </div>
            </div>
          </div>

          {/* Service Categories List */}
          <div className="w-full box-border flex flex-col gap-1 items-start justify-start px-0 py-1 relative">
            {filteredServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="w-full bg-[#ffffff] box-border flex flex-row gap-3 sm:gap-4 items-center justify-start px-0 py-3 sm:py-2 relative hover:bg-gray-50 transition-colors active:bg-gray-100"
              >
                {/* Icon Container */}
                <div className="bg-[#ebebeb] box-border flex flex-row gap-2 items-center justify-center p-[6px] sm:p-[8px] relative rounded-lg flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
                  {(() => {
                    const IconComponent = PhosphorIcons[service.icon];
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

            {filteredServices.length === 0 && searchTerm && (
              <div className="w-full text-center py-8 text-[#4b4b4b] text-[14px] sm:text-[16px]">
                No services found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
