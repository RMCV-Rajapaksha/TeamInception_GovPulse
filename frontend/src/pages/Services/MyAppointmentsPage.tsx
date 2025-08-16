import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  CheckCircle,
  X,
  Star,
} from "@phosphor-icons/react";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

interface Appointment {
  appointment_id: number;
  date: string;
  time_slot: string;
  Authority: {
    authority_id: number;
    name: string;
    location?: string;
  };
  Issue?: {
    issue_id: number;
    title: string;
  };
  official_comment?: string;
}

interface Feedback {
  feedback_id: number;
  appointment_id: number;
  rating: number;
  comment?: string;
}

// Appointment Details Modal Component
interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
}: AppointmentDetailsModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(
    null
  );

  // Check for existing feedback when modal opens
  useEffect(() => {
    if (isOpen && appointment) {
      fetchExistingFeedback();
    }
  }, [isOpen, appointment]);

  const fetchExistingFeedback = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/feedback/appointment/${
          appointment?.appointment_id
        }`
      );
      setExistingFeedback(response.data.feedback);
    } catch (error) {
      // No existing feedback is fine
      setExistingFeedback(null);
    }
  };

  const submitReview = async () => {
    if (!appointment || rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/feedback/create-feedback`,
        {
          appointment_id: appointment.appointment_id,
          rating: rating,
          comment: comment || null,
        }
      );

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      fetchExistingFeedback(); // Refresh feedback
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const StarRating = ({
    rating,
    onRatingChange,
    readonly = false,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
    readonly?: boolean;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange(star)}
            className={`text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${
              readonly
                ? "cursor-default"
                : "hover:text-yellow-400 cursor-pointer"
            }`}
            disabled={readonly}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen || !appointment) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAppointmentStatus = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return {
        status: "completed",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: CheckCircle,
      };
    } else if (appointmentDate.toDateString() === today.toDateString()) {
      return {
        status: "today",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: AlertTriangle,
      };
    } else {
      return {
        status: "upcoming",
        color: "text-yellow-700",
        bgColor: "bg-yellow-200/80",
        icon: Calendar,
      };
    }
  };

  const statusInfo = getAppointmentStatus(appointment);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
          <div className="text-sm text-gray-600">Appointment details</div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${statusInfo.bgColor} mb-4`}
          >
            <StatusIcon size={16} className={statusInfo.color} />
            <span
              className={`text-sm font-medium capitalize ${statusInfo.color}`}
            >
              {statusInfo.status}
            </span>
          </div>

          {/* Authority Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {appointment.Authority.name}
            </h3>
            {appointment.Authority.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} />
                <span>{appointment.Authority.location}</span>
              </div>
            )}
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="font-medium text-gray-700">Date</span>
              </div>
              <p className="text-gray-900">{formatDate(appointment.date)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-500" />
                <span className="font-medium text-gray-700">Time</span>
              </div>
              <p className="text-gray-900">{appointment.time_slot}</p>
            </div>
          </div>

          {/* Related Issue */}
          {appointment.Issue && (
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Related Issue
                  </span>
                </div>
                <p className="text-blue-800">{appointment.Issue.title}</p>
              </div>
            </div>
          )}

          {/* Official Comment */}
          {appointment.official_comment && (
            <div className="mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-yellow-600" />
                  <span className="font-medium text-yellow-900">
                    Official Comment
                  </span>
                </div>
                <p className="text-yellow-800">
                  {appointment.official_comment}
                </p>
              </div>
            </div>
          )}

          {/* Review Section for Completed Appointments */}
          {statusInfo.status === "completed" && (
            <div className="mb-6">
              {existingFeedback ? (
                // Show existing review
                <div className="bg-yellow-200/40 border border-yellow-300/80 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-black" />
                    <span className="font-medium text-black">Your Review</span>
                  </div>
                  <div className="mb-2">
                    <StarRating
                      rating={existingFeedback.rating}
                      onRatingChange={() => {}}
                      readonly={true}
                    />
                  </div>
                  {existingFeedback.comment && (
                    <p className="text-black">{existingFeedback.comment}</p>
                  )}
                </div>
              ) : (
                // Show review form
                <div className="bg-yellow-200/40 border border-yellow-300/80 rounded-lg p-4">
                  <h4 className="font-medium text-black mb-3">
                    Review This Appointment
                  </h4>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-black mb-1">
                      Rating *
                    </label>
                    <StarRating rating={rating} onRatingChange={setRating} />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-black mb-1">
                      Comment (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full p-2 border border-yellow-300/80 rounded-lg focus:ring-1 focus:ring-yellow-300/80 focus:border-transparent bg-white"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={submitReview}
                      disabled={submittingReview}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyAppointmentsPage() {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter(
      (appointment) =>
        appointment.Authority.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (appointment.Issue?.title &&
          appointment.Issue.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
    setFilteredAppointments(filtered);
  }, [searchTerm, appointments]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/appointments/user-appointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      if (error.response?.status === 404) {
        setAppointments([]);
        setFilteredAppointments([]);
      } else {
        setError("Failed to load appointments");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAppointmentStatus = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return {
        status: "completed",
        color: "text-black",
        bgColor: "bg-green-50",
        icon: CheckCircle,
      };
    } else if (appointmentDate.toDateString() === today.toDateString()) {
      return {
        status: "today",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: AlertTriangle,
      };
    } else {
      return {
        status: "upcoming",
        color: "text-black",
        bgColor: "bg-yellow-200/80",
        icon: Calendar,
      };
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  // Loading and error states removed - handled inline

  return (
    <div className="pb-24 md:ml-[14rem] px-10 md:px-0 md:pl-[5rem] md:pr-[15rem]">
      {/* Header */}
      <div className="px-8 mb-4">
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="mt-1 text-gray-600 text-base leading-tight tracking-tight">
          View and manage all your scheduled appointments
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-8 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="mt-6 divide-y divide-gray-200">
        {loading ? (
          <p className="text-gray-500">Loading your appointments...</p>
        ) : error ? (
          <p className="text-gray-500">{error}</p>
        ) : filteredAppointments.length === 0 ? (
          <p className="text-gray-500">
            {searchTerm ? "No appointments found." : "No appointments found."}
          </p>
        ) : (
          filteredAppointments.map((appointment) => {
            const statusInfo = getAppointmentStatus(appointment);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={appointment.appointment_id} className="py-4">
                <article className="w-full">
                  {/* Desktop layout */}
                  <div className="hidden md:flex md:flex-wrap w-full py-6 lg:py-8 gap-6 lg:gap-8">
                    {/* Left content */}
                    <div className="flex-3 flex flex-col gap-3 lg:gap-4">
                      {/* Meta row */}
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="flex-1 flex items-center gap-2 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Calendar size={14} className="h-3.5 w-3.5" />
                            {formatDate(appointment.date)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-gray-400" />
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Clock size={14} className="h-3.5 w-3.5" />
                            {appointment.time_slot}
                          </span>
                          {appointment.Authority.location && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-gray-400" />
                              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                                <MapPin size={14} className="h-3.5 w-3.5" />
                                {appointment.Authority.location}
                              </span>
                            </>
                          )}
                        </div>
                        <div
                          className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-2xl ${statusInfo.bgColor} inline-flex items-center gap-1 text-xs ${statusInfo.color}`}
                        >
                          <StatusIcon size={12} className="h-3.5 w-3.5" />
                          <span className="capitalize">
                            {statusInfo.status}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base lg:text-lg font-bold leading-snug text-gray-900">
                        {appointment.Authority.name}
                      </h3>

                      {/* Description */}
                      <div className="text-gray-600 text-sm lg:text-base leading-tight tracking-tight">
                        {appointment.Issue && (
                          <p>Related to: {appointment.Issue.title}</p>
                        )}
                        {appointment.official_comment && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r mt-2">
                            <p className="text-xs font-medium text-blue-800 mb-1">
                              Official Comment:
                            </p>
                            <p className="text-sm text-blue-700">
                              {appointment.official_comment}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="flex items-center gap-2 h-10 lg:h-11 px-3 lg:px-4 rounded-2xl ring-1 ring-gray-300 bg-gray-50 text-gray-900 font-bold"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile layout */}
                  <div className="md:hidden w-full pb-2">
                    <div className="px-4 pt-2 flex flex-col gap-2">
                      {/* Meta row */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 text-xs text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={14} className="h-3.5 w-3.5" />
                            {formatDate(appointment.date)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-gray-400" />
                          <span className="inline-flex items-center gap-1">
                            <Clock size={14} className="h-3.5 w-3.5" />
                            {appointment.time_slot}
                          </span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-2xl ${statusInfo.bgColor} inline-flex items-center gap-1 text-xs ${statusInfo.color}`}
                        >
                          <StatusIcon size={12} className="h-3.5 w-3.5" />
                          <span className="capitalize">
                            {statusInfo.status}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <div className="flex items-center gap-2">
                        <h3 className="flex-1 text-base lg:text-lg font-bold leading-snug text-gray-900">
                          {appointment.Authority.name}
                        </h3>
                      </div>

                      {/* Description */}
                      <div className="text-gray-600 text-sm lg:text-base leading-tight tracking-tight">
                        {appointment.Issue && (
                          <p>Related to: {appointment.Issue.title}</p>
                        )}
                        {appointment.Authority.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={14} className="h-3.5 w-3.5" />
                            <span className="text-xs">
                              {appointment.Authority.location}
                            </span>
                          </div>
                        )}
                        {appointment.official_comment && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r mt-2">
                            <p className="text-xs font-medium text-blue-800 mb-1">
                              Official Comment:
                            </p>
                            <p className="text-sm text-blue-700">
                              {appointment.official_comment}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="py-2">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="flex items-center gap-2 h-10 lg:h-11 px-4 rounded-2xl ring-1 ring-gray-300 bg-gray-50 text-gray-900 font-bold w-full justify-center"
                        >
                          View Details
                        </button>
                      </div>
                    </div>

                    <div className="px-4">
                      <div className="h-px bg-gray-200" />
                    </div>
                  </div>
                </article>
              </div>
            );
          })
        )}
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
