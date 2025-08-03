import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isAfter, addDays } from "date-fns";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import CalendarPicker from "@/components/organisms/CalendarPicker";
import TimeSlotPicker from "@/components/molecules/TimeSlotPicker";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";
import appointmentService from "@/services/api/appointmentService";

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    doctorId: "",
    timeSlot: "",
    service: ""
  });
  const [errors, setErrors] = useState({});
  const currentUser = userService.getCurrentUser();

  const services = appointmentService.getServices();

  const loadDoctors = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await userService.getDoctors();
      setDoctors(data);
    } catch (err) {
      setError(err.message || "Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async (date, doctorId) => {
    if (!doctorId || !date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    
    try {
      const dateString = format(date, "yyyy-MM-dd");
      const slots = await appointmentService.getAvailableTimeSlots(dateString, doctorId);
      setAvailableSlots(slots);
    } catch (err) {
      toast.error("Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (formData.doctorId && selectedDate) {
      loadAvailableSlots(selectedDate, formData.doctorId);
      setFormData(prev => ({ ...prev, timeSlot: "" }));
    }
  }, [selectedDate, formData.doctorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, timeSlot: "" }));
  };

  const handleTimeSlotSelect = (slot) => {
    setFormData(prev => ({ ...prev, timeSlot: slot }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.doctorId) {
      newErrors.doctorId = "Please select a doctor";
    }
    if (!formData.timeSlot) {
      newErrors.timeSlot = "Please select a time slot";
    }
    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedDoctor = doctors.find(d => d.Id === parseInt(formData.doctorId));
    
    setSubmitting(true);

    try {
      const appointmentData = {
        patientId: currentUser.Id,
        doctorId: parseInt(formData.doctorId),
        patientName: currentUser.name,
        doctorName: selectedDoctor.name,
        date: format(selectedDate, "yyyy-MM-dd"),
        timeSlot: formData.timeSlot,
        service: formData.service
      };

      await appointmentService.create(appointmentData);
      
      toast.success("Appointment booked successfully! 🎉");
      navigate("/home");
    } catch (err) {
      toast.error(err.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDoctors} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
        <p className="text-gray-600">Schedule your visit with our healthcare professionals</p>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Doctor Selection */}
        <FormField
          label="Select Doctor"
          type="select"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleInputChange}
          error={errors.doctorId}
        >
          <option value="">Choose a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.Id} value={doctor.Id}>
              {doctor.name}
            </option>
          ))}
        </FormField>

        {/* Service Selection */}
        <FormField
          label="Service Type"
          type="select"
          name="service"
          value={formData.service}
          onChange={handleInputChange}
          error={errors.service}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </FormField>

        {/* Date Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Select Date</h3>
          <CalendarPicker
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            minDate={addDays(new Date(), 1)}
            disabled={!formData.doctorId}
          />
        </div>

        {/* Time Slot Selection */}
        {formData.doctorId && (
          <div className="space-y-3">
            {loadingSlots ? (
              <div className="text-center py-8">
                <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-primary-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading available time slots...</p>
              </div>
            ) : (
              <TimeSlotPicker
                availableSlots={availableSlots}
                selectedSlot={formData.timeSlot}
                onSlotSelect={handleTimeSlotSelect}
              />
            )}
            {errors.timeSlot && (
              <p className="text-sm text-red-600">{errors.timeSlot}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting || !formData.doctorId || !formData.timeSlot || !formData.service}
            className="w-full"
          >
            {submitting ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Booking Appointment...
              </>
            ) : (
              <>
                <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                Confirm Appointment
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Information Card */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Info" className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Please arrive 15 minutes before your appointment</li>
              <li>• Bring a valid ID and insurance card</li>
              <li>• You can reschedule up to 24 hours in advance</li>
              <li>• Late arrivals may need to reschedule</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;