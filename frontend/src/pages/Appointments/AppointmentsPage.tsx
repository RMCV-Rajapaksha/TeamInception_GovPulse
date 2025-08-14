import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppoinmentCard, { type Appointment } from "@/components/appointments/AppointmentCard";
import { useState } from "react";
import { BsCalendar2Week, BsCalendar2Check } from "react-icons/bs";
import AppointmentScheduler from "@/components/appointments/AppointmentSchedular";
import PastAppointmentCard from "@/components/appointments/PastAppointmentCard";
import AppointmentDetailsBottomSheet from "@/components/appointments/AppointmentDetailsBottomSheet";

export default function AppointmentsPage() {
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [open, setOpen] = useState(false);
  const [showDetailsSheet, setShowDetailsSheet] = useState(false);

  const handleSchedule = (appointment: Appointment) => {
    setSelected(appointment);
    setOpen(true);
  };

  const handleDetails = (appointment: Appointment) => {
    setSelected(appointment);
    setShowDetailsSheet(true);
  };

  const handleReschedule = () => {
    setShowDetailsSheet(false);
    // Reset to scheduler view or handle reschedule logic
  };

  const handleCancelAppointment = () => {
    setShowDetailsSheet(false);
    handleClose();
    // Add cancellation logic here
  };

  const handleClose = () => {
    setOpen(false);
    setShowDetailsSheet(false);
  }

  const appointments: Appointment[] = [
    {
      id: "#APT-2025-0001",
      title: "Discussion on repairing main road near hospital",
      person: "Eng. Ruwan Perera",
      position: "Director of Road Maintenance",
      phone: "011-2345678",
      location: "Kalutara Municipal Council, Room 12",
      highlight: true, // show as "New"
    },
    {
      id: "#APT-2025-0002",
      title: "Meeting about upgrading the highway near the community center",
      person: "Engineer Mayantha Dissanayake",
      position: "Head of Infrastructure Development",
      phone: "012-3456789",
      location: "City Planning Office, Suite 5",
      date: "Friday, 15 Aug 2025 · 10:00 AM",
      highlight: false,
    },
    {
      id: "#APT-2025-0003",
      title: "Planning session for new public park in Matugama",
      person: "Ms. Nadeesha Fernando",
      position: "Urban Development Officer",
      phone: "011-4567890",
      location: "Matugama Town Hall, Conference Room A",
      date: "Tuesday, 20 Aug 2025 · 2:30 PM",
      highlight: false,
    },
  ];

  return (
  <div className="pb-24 md:ml-[14rem] px-4 sm:px-6 md:px-0 md:pl-[5rem] md:pr-[15rem]">
    {/* Header */}
    <div className="px-4 sm:px-6 mb-4">
      <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
      <p className="mt-1 text-gray-600 text-base leading-tight tracking-tight">
        Check and manage your upcoming and past appointments with government officials.
      </p>
    </div>

    {/* Main tabs */}
    <div className="px-2 sm:px-4 mb-8">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-gray-100 rounded-lg p-1 flex justify-center h-12 overflow-x-auto">
          <TabsTrigger
            value="upcoming"
            className="flex items-center gap-2 px-4 py-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow h-10"
          >
            <BsCalendar2Week /> Upcoming
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="flex items-center gap-2 px-4 py-3 rounded-md data-[state=active]:bg-white data-[state=active]:shadow h-10"
          >
            <BsCalendar2Check /> Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-3">
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="py-4">
                <AppoinmentCard appointment={appointment} onSchedule={handleSchedule} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="py-4">
                <PastAppointmentCard appointment={appointment} onSchedule={handleDetails} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>

    <AppointmentScheduler appointment={selected} isOpen={open} onClose={handleClose} />
    {selected && (
      <AppointmentDetailsBottomSheet
        appointment={selected}
        isOpen={showDetailsSheet}
        onClose={handleClose}
        onReschedule={handleReschedule}
        onCancel={handleCancelAppointment}
        scheduledDateTime={`${selected.date ?? ""} · ${selected ?? ""}`}
      />
    )}
  </div>
);

}
