import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
} from "react-icons/fi";
import { useAuth } from "@clerk/clerk-react";

interface Authority {
  authority_id: number;
  name: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
}

const AppointmentBookingPage = () => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    authority_id: "",
    time_slot: "",
    date: "",
    issue_id: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [selectedAuthority, setSelectedAuthority] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  // Dropdown states
  const [showAuthorityDropdown, setShowAuthorityDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  // Refs for dropdowns
  const authorityDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Services mapping for each authority
  const authorityServices: { [key: string]: Service[] } = {
    "Road Development Authority": [
      {
        id: "road-permits",
        name: "Road Construction Permits",
        description: "Apply for road construction and maintenance permits",
      },
      {
        id: "traffic-management",
        name: "Traffic Management Consultation",
        description: "Traffic flow and management planning",
      },
      {
        id: "road-repairs",
        name: "Road Repair Requests",
        description: "Report and request road repairs",
      },
      {
        id: "bridge-inspection",
        name: "Bridge Inspection Services",
        description: "Request bridge safety inspections",
      },
      {
        id: "road-marking",
        name: "Road Marking Services",
        description: "Request road marking and signage installation",
      },
    ],
    "National Water Supply & Drainage Board": [
      {
        id: "water-connection",
        name: "New Water Connection",
        description: "Apply for new water supply connection",
      },
      {
        id: "drainage-issues",
        name: "Drainage System Issues",
        description: "Report drainage and sewerage problems",
      },
      {
        id: "water-quality",
        name: "Water Quality Testing",
        description: "Request water quality assessment",
      },
      {
        id: "bill-disputes",
        name: "Billing Disputes",
        description: "Resolve water bill disputes and queries",
      },
      {
        id: "meter-installation",
        name: "Water Meter Services",
        description: "Installation and maintenance of water meters",
      },
    ],
    "Department of Education": [
      {
        id: "school-admission",
        name: "School Admission Queries",
        description: "Assistance with school admission processes",
      },
      {
        id: "curriculum-consultation",
        name: "Curriculum Consultation",
        description: "Educational curriculum and standards guidance",
      },
      {
        id: "teacher-certification",
        name: "Teacher Certification",
        description: "Teacher qualification and certification services",
      },
      {
        id: "school-infrastructure",
        name: "School Infrastructure",
        description: "School building and facility development",
      },
      {
        id: "educational-programs",
        name: "Educational Programs",
        description: "Special educational programs and initiatives",
      },
    ],
    "National Solid Waste Management Center": [
      {
        id: "waste-collection",
        name: "Waste Collection Services",
        description: "Schedule waste collection and pickup",
      },
      {
        id: "recycling-programs",
        name: "Recycling Programs",
        description: "Community recycling initiatives",
      },
      {
        id: "hazardous-waste",
        name: "Hazardous Waste Disposal",
        description: "Safe disposal of hazardous materials",
      },
      {
        id: "composting",
        name: "Composting Services",
        description: "Organic waste composting programs",
      },
      {
        id: "waste-management-consultation",
        name: "Waste Management Consultation",
        description: "Business waste management solutions",
      },
    ],
    "Sri Lanka Police": [
      {
        id: "crime-reporting",
        name: "Crime Reporting",
        description: "Report crimes and incidents",
      },
      {
        id: "police-clearance",
        name: "Police Clearance Certificate",
        description: "Obtain police clearance certificates",
      },
      {
        id: "traffic-violations",
        name: "Traffic Violations",
        description: "Traffic violation inquiries and payments",
      },
      {
        id: "community-safety",
        name: "Community Safety Programs",
        description: "Community policing and safety initiatives",
      },
      {
        id: "lost-found",
        name: "Lost & Found Items",
        description: "Report or claim lost and found items",
      },
    ],
    "Ministry of Health": [
      {
        id: "health-services",
        name: "Public Health Services",
        description: "General public health service inquiries",
      },
      {
        id: "vaccination",
        name: "Vaccination Programs",
        description: "Public vaccination schedules and information",
      },
      {
        id: "health-inspection",
        name: "Health Inspection Services",
        description: "Food and establishment health inspections",
      },
      {
        id: "medical-licensing",
        name: "Medical Licensing",
        description: "Medical practitioner licensing and registration",
      },
      {
        id: "health-education",
        name: "Health Education Programs",
        description: "Community health education initiatives",
      },
    ],
    "Ministry of Agriculture": [
      {
        id: "farming-subsidies",
        name: "Farming Subsidies",
        description: "Agricultural subsidy applications and guidance",
      },
      {
        id: "crop-consultation",
        name: "Crop Consultation",
        description: "Crop selection and farming technique guidance",
      },
      {
        id: "pesticide-registration",
        name: "Pesticide Registration",
        description: "Register and approve agricultural pesticides",
      },
      {
        id: "land-development",
        name: "Agricultural Land Development",
        description: "Land development for agricultural purposes",
      },
      {
        id: "farmer-training",
        name: "Farmer Training Programs",
        description: "Educational programs for farmers",
      },
    ],
  };

  // Common time slots (this would normally come from your backend)
  const commonTimeSlots: TimeSlot[] = [
    { id: "09:00-10:00", time: "09:00 - 10:00", available: true },
    { id: "10:00-11:00", time: "10:00 - 11:00", available: true },
    { id: "11:00-12:00", time: "11:00 - 12:00", available: false },
    { id: "13:00-14:00", time: "13:00 - 14:00", available: true },
    { id: "14:00-15:00", time: "14:00 - 15:00", available: true },
    { id: "15:00-16:00", time: "15:00 - 16:00", available: false },
    { id: "16:00-17:00", time: "16:00 - 17:00", available: true },
  ];

  // Fetch authorities on component mount
  useEffect(() => {
    const fetchAuthorities = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/authorities/get-authorities-by-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAuthorities(response.data);
      } catch (error) {
        console.error("Error fetching authorities:", error);
        setMessage("Failed to load authorities");
      }
    };

    fetchAuthorities();
  }, [getToken]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authorityDropdownRef.current &&
        !authorityDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAuthorityDropdown(false);
      }
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setShowServiceDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // ...existing code...

  const handleDateSelect = async (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const dateString = date.toISOString().split("T")[0];
    setSelectedDate(dateString);
    setFormData({ ...formData, date: dateString });

    // Reset time slot when date changes
    setSelectedTimeSlot("");
    setFormData((prev) => ({ ...prev, time_slot: "" }));

    // Fetch available time slots from backend instead of using hardcoded ones
    if (formData.authority_id) {
      await fetchAvailableTimeSlots(formData.authority_id, dateString);
    } else {
      setAvailableTimeSlots([]);
    }
  };

  const handleAuthoritySelect = (authority: Authority) => {
    setSelectedAuthority(authority.name);
    setFormData({
      ...formData,
      authority_id: authority.authority_id.toString(),
    });
    setShowAuthorityDropdown(false);

    // Set available services for the selected authority
    const services = authorityServices[authority.name] || [];
    setAvailableServices(services);

    // Reset all dependent fields when authority changes
    setSelectedService("");
    setSelectedDate("");
    setSelectedTimeSlot("");
    setFormData((prev) => ({ ...prev, date: "", time_slot: "" }));
    setAvailableTimeSlots([]);
  };

  // Add new function to fetch available time slots
  const fetchAvailableTimeSlots = async (authorityId: string, date: string) => {
    try {
      const token = await getToken();
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/time-slots/get-free-time-slots/${authorityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter time slots for the selected date
      const timeSlotsForDate = response.data.find(
        (record: any) =>
          new Date(record.date).toISOString().split("T")[0] === date
      );

      if (timeSlotsForDate && timeSlotsForDate.time_slots) {
        // Convert backend format to frontend format
        const formattedTimeSlots: TimeSlot[] = timeSlotsForDate.time_slots.map(
          (slot: string, index: number) => ({
            id: slot, // Use the actual time slot string as ID
            time: slot, // Display the same format
            available: true,
          })
        );
        setAvailableTimeSlots(formattedTimeSlots);
      } else {
        setAvailableTimeSlots([]);
        setMessage("No available time slots for the selected date");
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setAvailableTimeSlots([]);
      setMessage("Failed to load available time slots");
    }
  };


  const handleServiceSelect = (service: Service) => {
    setSelectedService(service.name);
    setShowServiceDropdown(false);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (timeSlot.available) {
      setSelectedTimeSlot(timeSlot.id);
      setFormData({ ...formData, time_slot: timeSlot.id });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.authority_id ||
      !formData.date ||
      !formData.time_slot ||
      !selectedService
    ) {
      setMessage(
        "Please fill in all required fields including service selection"
      );
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();

      // Prepare the request data, only include issue_id if it has a value
      const requestData: any = {
        authority_id: parseInt(formData.authority_id),
        time_slot: formData.time_slot,
        date: formData.date,
      };

      // Only add issue_id if it's not empty
      if (formData.issue_id && formData.issue_id.trim() !== "") {
        requestData.issue_id = parseInt(formData.issue_id);
      }

      console.log("Submitting appointment data:", requestData);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/appointments/book-appointment`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Appointment response:", response.data);
      setMessage("Appointment booked successfully!");

      // Reset form
      setFormData({
        authority_id: "",
        time_slot: "",
        date: "",
        issue_id: "",
      });
      setSelectedAuthority("");
      setSelectedService("");
      setSelectedDate("");
      setSelectedTimeSlot("");
      setAvailableTimeSlots([]);
      setAvailableServices([]);
    } catch (error: unknown) {
      console.error("Error booking appointment:", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        setMessage(
          error.response?.data?.error ||
            "Failed to book appointment. Try again."
        );
      } else {
        setMessage("Failed to book appointment. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 md:ml-72 px-10 md:px-0 md:pl-20 md:pr-60">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book an Appointment
          </h1>
          <p className="text-gray-600">
            Schedule a service with government authorities
          </p>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gray-200 mb-8" />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Authority Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Authority
            </h3>
            <div ref={authorityDropdownRef} className="relative">
              <div className="flex w-full gap-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded-l-lg p-3 flex-1 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-yellow-400/80"
                  value={selectedAuthority}
                  placeholder="Choose an authority"
                  readOnly
                  tabIndex={-1}
                />
                <button
                  type="button"
                  className="border-t border-b border-r border-gray-300 rounded-r-lg px-3 flex items-center bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400/80"
                  onClick={() =>
                    setShowAuthorityDropdown(!showAuthorityDropdown)
                  }
                >
                  <FiChevronDown
                    className={`text-gray-400 transition-transform ${
                      showAuthorityDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {showAuthorityDropdown && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-auto">
                  {authorities.length > 0 ? (
                    authorities.map((authority) => (
                      <li
                        key={authority.authority_id}
                        className={`px-4 py-3 cursor-pointer hover:bg-yellow-50/80 text-black ${
                          authority.name === selectedAuthority
                            ? "bg-yellow-100/80 font-semibold"
                            : ""
                        }`}
                        onClick={() => handleAuthoritySelect(authority)}
                      >
                        {authority.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-gray-500">
                      No authorities found
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Service
            </h3>
            <div ref={serviceDropdownRef} className="relative">
              <button
                type="button"
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-yellow-400/80"
                onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                disabled={!selectedAuthority}
              >
                <span
                  className={selectedService ? "text-black" : "text-gray-400"}
                >
                  {selectedService || "Choose a service"}
                </span>
                <FiSettings className="text-gray-400" />
              </button>

              {showServiceDropdown && availableServices.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
                  {availableServices.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleServiceSelect(service)}
                      className={`w-full px-4 py-3 text-left transition-colors hover:bg-yellow-50/80 cursor-pointer ${
                        service.name === selectedService
                          ? "bg-yellow-100/80 font-semibold"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-black font-medium">
                          {service.name}
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          {service.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Date Selection - Inline Calendar */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Date
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-sm mx-auto">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.setMonth(currentMonth.getMonth() - 1)
                      )
                    )
                  }
                  className="p-2 hover:bg-yellow-50/80 rounded-lg transition-colors"
                  disabled={!selectedService}
                >
                  <FiChevronLeft className="text-gray-600" size={16} />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.setMonth(currentMonth.getMonth() + 1)
                      )
                    )
                  }
                  className="p-2 hover:bg-yellow-50/80 rounded-lg transition-colors"
                  disabled={!selectedService}
                >
                  <FiChevronRight className="text-gray-600" size={16} />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day && (
                      <button
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        disabled={isDateDisabled(day) || !selectedService}
                        className={`w-full h-full flex items-center justify-center text-xs rounded font-medium transition-all
                          ${
                            isDateDisabled(day) || !selectedService
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-700 hover:bg-yellow-100/80 cursor-pointer"
                          }
                          ${
                            selectedDate ===
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth(),
                              day
                            )
                              .toISOString()
                              .split("T")[0]
                              ? "bg-yellow-200/80 text-black hover:bg-yellow-300/80"
                              : ""
                          }`}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Selected date display */}
              {selectedDate && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    Selected: {formatDate(new Date(selectedDate))}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Time Slot Selection - Button Grid */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Select Time Slot
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              {selectedDate ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTimeSlots.map((timeSlot) => (
                    <button
                      key={timeSlot.id}
                      type="button"
                      onClick={() => handleTimeSlotSelect(timeSlot)}
                      disabled={!timeSlot.available}
                      className={`p-3 rounded-lg border font-medium text-sm transition-all
                        ${
                          !timeSlot.available
                            ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                            : selectedTimeSlot === timeSlot.id
                            ? "bg-yellow-200/80 text-black border-yellow-200 hover:bg-yellow-300"
                            : "bg-white border-gray-300 text-gray-700 hover:border-yellow-400/80 hover:bg-yellow-50/80 cursor-pointer"
                        }
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <span>{timeSlot.time}</span>
                        {!timeSlot.available && (
                          <span className="text-xs text-red-400 mt-1">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    Please select a date to see available time slots
                  </p>
                </div>
              )}

              {/* Selected time display */}
              {selectedTimeSlot && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Selected time:{" "}
                    {
                      availableTimeSlots.find(
                        (slot) => slot.id === selectedTimeSlot
                      )?.time
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Issue ID (Optional) */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Related Issue (Optional)
            </h3>
            <input
              type="text"
              placeholder="Enter issue ID if this appointment is related to a specific issue"
              value={formData.issue_id}
              onChange={(e) =>
                setFormData({ ...formData, issue_id: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/80"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              !formData.authority_id ||
              !selectedService ||
              !formData.date ||
              !formData.time_slot
            }
            className="w-full py-3 rounded-full bg-yellow-200 text-black text-lg font-semibold shadow-md hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-4 rounded-lg text-center ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
