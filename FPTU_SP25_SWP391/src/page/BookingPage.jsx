import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { postBooking, getServicesByTherapistId, getTherapistSchedules, createPayment, getAllServices } from '../api/testApi';
import { useAuth } from '../page/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const BookingPage = ({ darkMode }) => {
    const { isLoggedIn, userId, token, role } = useAuth();
    const location = useLocation();

    const [formData, setFormData] = useState({
        userId: '',
        therapistId: '',
        timeSlotId: '',
        note: '',
        serviceId: '',
        appointmentDate: '',
    });

    const [allServices, setAllServices] = useState([]);
    const [therapists, setTherapists] = useState([]);
    const [uniqueTherapists, setUniqueTherapists] = useState([]);
    const [filteredTherapists, setFilteredTherapists] = useState([]);
    const [therapistServicesMap, setTherapistServicesMap] = useState({});
    const [therapistTimeSlots, setTherapistTimeSlots] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [noTherapistMessage, setNoTherapistMessage] = useState('');

    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);


    useEffect(() => {
        const selectedServiceId = location.state?.selectedServiceId;
        if (selectedServiceId) {
            setFormData((prev) => ({
                ...prev,
                serviceId: selectedServiceId.toString(),
            }));
        }
    }, [location.state]);

    useEffect(() => {
        if (userId) {
            setFormData((prev) => ({ ...prev, userId: userId }));
        }
    }, [userId]);


    useEffect(() => {
        if (token) {
            const fetchServices = async () => {
                try {
                    const response = await getAllServices(token);
                    setAllServices(response.data || []);
                } catch (err) {
                    console.error('Error fetching all services:', err);
                    toast.error('Failed to load services. Please try again later.');
                }
            };
            fetchServices();
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchTherapists();
        }
    }, [token, role]);

    useEffect(() => {
        if (!formData.serviceId || !uniqueTherapists.length) {
            setFilteredTherapists([]);
            return;
        }

        const compatibleTherapists = uniqueTherapists.filter((therapist) => {
            const services = therapistServicesMap[therapist.therapistId] || [];
            return services.some((service) => service.serviceId.toString() === formData.serviceId);
        });

        setFilteredTherapists(compatibleTherapists);
        if (compatibleTherapists.length === 0) {
            setNoTherapistMessage('No therapists available for this service.');
            setFormData((prev) => ({
                ...prev,
                therapistId: '',
                appointmentDate: '',
                timeSlotId: '',
            }));
        } else {
            setNoTherapistMessage('');
        }
    }, [formData.serviceId, uniqueTherapists, therapistServicesMap]);


    useEffect(() => {
        if (formData.therapistId && token) {
            updateAvailableDates(formData.therapistId);
        } else {
            setAvailableDates([]);
            setTherapistTimeSlots([]);
            setFormData((prev) => ({ ...prev, timeSlotId: '', appointmentDate: '' }));
        }
    }, [formData.therapistId, token]);

    useEffect(() => {
        if (formData.therapistId && formData.appointmentDate) {
            updateTherapistTimeSlots(formData.therapistId, formData.appointmentDate);
        } else {
            setTherapistTimeSlots([]);
            setFormData((prev) => ({ ...prev, timeSlotId: '' }));
        }
    }, [formData.therapistId, formData.appointmentDate, therapists]);

    const fetchTherapists = useCallback(async () => {
        try {
            const response = await getTherapistSchedules(token);
            const therapistData = response.data;

            setTherapists(therapistData);

            const unique = therapistData.reduce((acc, current) => {
                const existing = acc.find((item) => item.therapistId === current.therapistId);
                if (!existing) {
                    acc.push({
                        therapistId: current.therapistId,
                        therapistName: current.therapistName,
                    });
                }
                return acc;
            }, []);
            setUniqueTherapists(unique);


            const servicesMap = {};
            for (const therapist of unique) {
                try {
                    const servicesResponse = await getServicesByTherapistId(therapist.therapistId, token);
                    servicesMap[therapist.therapistId] = servicesResponse.data || [];
                } catch (err) {
                    console.error(`Error fetching services for therapist ${therapist.therapistId}:`, err);
                    servicesMap[therapist.therapistId] = [];
                }
            }
            setTherapistServicesMap(servicesMap);
        } catch (err) {
            console.error('Error fetching therapists:', err);
            toast.error('Failed to load therapists. Please try again later.');
        }
    }, [token]);

    const updateAvailableDates = useCallback((therapistId) => {
        const selectedTherapistSchedules = therapists.filter((t) => t.therapistId.toString() === therapistId);
        const availableDaysOfWeek = selectedTherapistSchedules
            .filter((schedule) => (schedule.timeSlots || []).some((slot) => slot.status === 0))
            .map((schedule) => schedule.dayOfWeek);

        const dates = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dayOfWeek = date.getDay();
            if (availableDaysOfWeek.includes(dayOfWeek)) {
                dates.push(new Date(date));
            }
        }
        setAvailableDates(dates);
    }, [therapists]);

    const updateTherapistTimeSlots = useCallback((therapistId, appointmentDate) => {
        const selectedDate = new Date(appointmentDate);
        const selectedDayOfWeek = selectedDate.getDay();

        const selectedSchedule = therapists.find(
            (t) => t.therapistId.toString() === therapistId && t.dayOfWeek === selectedDayOfWeek
        );

        if (selectedSchedule) {
            const timeSlots = selectedSchedule.timeSlots || [];
            console.log('Time Slots for therapistId:', therapistId, 'on dayOfWeek:', selectedDayOfWeek, timeSlots);
            timeSlots.forEach((slot, index) => {
                console.log(`Time Slot ${index + 1}:`, slot.timeSlotDescription, 'Status:', slot.status);
            });
            setTherapistTimeSlots(timeSlots);
        } else {
            console.log('No schedule found for therapistId:', therapistId, 'on dayOfWeek:', selectedDayOfWeek);
            setTherapistTimeSlots([]);
        }
    }, [therapists]);

    const getStatusDescription = (status) => {
        switch (status) {
            case 0: return '';
            case 1: return '(Booked)';
            case 2: return '(Unavailable)';
            default: return '(Unavailable)';
        }
    };

    const processPayment = async (bookingId) => {
        try {
            setPaymentProcessing(true);
            const paymentResponse = await createPayment(bookingId, token);
            if (paymentResponse && paymentResponse.data && paymentResponse.data.paymentLink) {
                localStorage.setItem('pendingBookingId', bookingId);
                console.log('Payment Link:', paymentResponse.data.paymentLink);
                window.location.href = paymentResponse.data.paymentLink;
            } else {
                toast.error('Invalid payment link received.');
            }
        } catch (err) {
            console.error('Error processing payment:', err);
            toast.error('Payment processing failed. Please try again or contact support.');
        } finally {
            setPaymentProcessing(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'serviceId' ? { therapistId: '', appointmentDate: '', timeSlotId: '' } : {}),
            ...(name === 'therapistId' ? { appointmentDate: '', timeSlotId: '' } : {}),
        }));
        if (name === 'serviceId') {
            setNoTherapistMessage('');
        }
    };

    const handleDateChange = (date) => {
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const localDateString = `${year}-${month}-${day}T00:00:00.000Z`;

            setFormData({
                ...formData,
                appointmentDate: localDateString,
                timeSlotId: '',
            });
        } else {
            setFormData({
                ...formData,
                appointmentDate: '',
                timeSlotId: '',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.userId || !formData.timeSlotId || !formData.serviceId || !formData.appointmentDate || !formData.therapistId) {
            toast.error('Please fill in all required fields: Service, Therapist, Appointment Date, and Time Slot');
            setLoading(false);
            return;
        }

        const selectedTimeSlot = therapistTimeSlots.find(
            (slot) => slot.timeSlotId.toString() === formData.timeSlotId
        );
        if (selectedTimeSlot && selectedTimeSlot.status !== 0) {
            toast.error('The selected time slot is not available. Please choose another slot.');
            setLoading(false);
            return;
        }

        if (!token) {
            toast.error('Authentication token is missing. Please log in again.');
            setLoading(false);
            return;
        }

        try {
            const bookingData = {
                userId: parseInt(formData.userId, 10),
                therapistId: parseInt(formData.therapistId, 10),
                timeSlotId: parseInt(formData.timeSlotId, 10),
                note: formData.note || '',
                serviceId: parseInt(formData.serviceId, 10),
                appointmentDate: formData.appointmentDate,
            };

            console.log('Form Data:', formData);
            console.log('Booking Data gửi đi:', bookingData);

            const res = await postBooking(bookingData, token);
            setResponse(res.data);

            toast.success('Booking confirmed! Your appointment has been scheduled successfully.');
            if (res.data && res.data.bookingId) {
                await processPayment(res.data.bookingId);
            }

            setLoading(false);
            setFormData({
                userId: userId || '',
                therapistId: '',
                timeSlotId: '',
                note: '',
                serviceId: '',
                appointmentDate: '',
            });
        } catch (err) {
            setError(err.response ? err.response.data : 'Something went wrong');
            setLoading(false);
            toast.error(err.response ? `Booking failed: ${err.response.data}` : 'Something went wrong. Please try again later.');
        }
    };

    if (!isLoggedIn || !token) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gray-50'>
                <div className='p-8 bg-white shadow-lg rounded-xl'>
                    <div className='flex flex-col items-center'>
                        <div className='p-3 bg-red-100 rounded-full'>
                            <svg
                                className='w-8 h-8 text-red-500'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                ></path>
                            </svg>
                        </div>
                        <h2 className='mt-3 text-xl font-semibold text-gray-800'>Authentication Required</h2>
                        <p className='mt-2 text-gray-600'>Please log in to book an appointment.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .booking-page {
          min-height: 100vh;
          padding: 3rem 2rem;
          background: ${darkMode ? "#1c2526" : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"};
          font-family: 'Poppins', sans-serif;
          color: ${darkMode ? "#ecf0f1" : "#2c3e50"};
          display: flex;
          justify-content: center;
          align-items: center;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .booking-container {
          background: ${darkMode ? "#2c3e50" : "#ffffff"};
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.06"});
          width: 100%;
          max-width: 800px;
        }
        .booking-header {
          padding: 1rem 2rem;
          background: ${darkMode ? "#34495e" : "#3b82f6"};
          border-radius: 12px 12px 0 0;
          margin: -2rem -2rem 2rem -2rem;
        }
        .booking-title {
          font-size: 2rem;
          font-weight: 600;
          color: ${darkMode ? "#1abc9c" : "#ffffff"};
          margin-bottom: 0.5rem;
        }
        .booking-description {
          font-size: 1.1rem;
          color: ${darkMode ? "#bdc3c7" : "#e9ecef"};
        }
        .booking-form {
          display: grid;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          font-size: 1.1rem;
          font-weight: 500;
          color: ${darkMode ? "#f9fafb" : "#1f2937"};
          margin-bottom: 0.5rem;
        }
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid ${darkMode ? "#4b5563" : "#d1d5db"};
          border-radius: 8px;
          font-size: 1rem;
          color: ${darkMode ? "#f9fafb" : "#1f2937"};
          background: ${darkMode ? "#34495e" : "#fff"};
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-group select:focus,
        .form-group textarea:focus,
        .form-group .react-datepicker-wrapper:focus-within {
          border-color: ${darkMode ? "#1abc9c" : "#3b82f6"};
          box-shadow: 0 0 8px rgba(${darkMode ? "26, 188, 156" : "59, 130, 246"}, 0.2);
        }
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        .form-group select:disabled {
          background: ${darkMode ? "#2d3748" : "#e5e7eb"};
          color: ${darkMode ? "#9ca3af" : "#6b7280"};
          cursor: not-allowed;
        }
        .form-group select option:disabled {
          color: ${darkMode ? "#9ca3af" : "#6b7280"};
        }
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container input {
          width: 100%;
          padding: 1rem;
          border: 1px solid ${darkMode ? "#4b5563" : "#d1d5db"};
          border-radius: 8px;
          font-size: 1rem;
          color: ${darkMode ? "#f9fafb" : "#1f2937"};
          background: ${darkMode ? "#34495e" : "#fff"};
          outline: none;
        }
        .submit-button {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          background: ${darkMode ? "#1abc9c" : "#3b82f6"};
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease, transform 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .submit-button:hover:not(:disabled) {
          background: ${darkMode ? "#16a085" : "#2563eb"};
          transform: translateY(-2px);
        }
        .submit-button:disabled {
          background: ${darkMode ? "#4b5563" : "#e5e7eb"};
          cursor: not-allowed;
          transform: none;
        }
        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .warning-text {
          font-size: 0.9rem;
          color: ${darkMode ? "#f59e0b" : "#f59e0b"};
          margin-top: 0.5rem;
        }
        .auth-required {
          background: ${darkMode ? "#2c3e50" : "#ffffff"};
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.06"});
          text-align: center;
        }
        .auth-required h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: ${darkMode ? "#ff8787" : "#dc3545"};
          margin-bottom: 1rem;
        }
        .auth-required p {
          font-size: 1.1rem;
          color: ${darkMode ? "#bdc3c7" : "#6b7280"};
        }
        .booking-page::-webkit-scrollbar {
          width: 8px;
        }
        .booking-page::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#6b7280" : "#6b7280"};
          border-radius: 4px;
        }
        .booking-page::-webkit-scrollbar-track {
          background: ${darkMode ? "#1c2526" : "#f8f9fa"};
        }
        @media (max-width: 768px) {
          .booking-page {
            padding: 2rem 1rem;
          }
          .booking-container {
            padding: 1.5rem;
          }
          .booking-title {
            font-size: 1.75rem;
          }
          .booking-description {
            font-size: 1rem;
          }
          .booking-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

            <div className="booking-page">
                <div className="booking-container">
                    <div className="booking-header">
                        <h1 className="booking-title">Book Your Appointment</h1>
                        <p className="booking-description">
                            {role === 'Therapist'
                                ? 'Schedule your availability for client sessions'
                                : 'Schedule a session with our professional therapists'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="booking-form">
                        <div className="form-group">
                            <label>Service</label>
                            <select
                                name="serviceId"
                                value={formData.serviceId}
                                onChange={handleChange}
                                required
                                disabled={allServices.length === 0}
                            >
                                <option value="">Select a service</option>
                                {allServices.map((service) => (
                                    <option key={service.serviceId} value={service.serviceId}>
                                        {service.name} ({service.price}VND)
                                    </option>
                                ))}
                            </select>
                            {allServices.length === 0 && (
                                <p className="warning-text">No services available</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Therapist</label>
                            <select
                                name="therapistId"
                                value={formData.therapistId}
                                onChange={handleChange}
                                required
                                disabled={!formData.serviceId || filteredTherapists.length === 0}
                            >
                                <option value="">Select a therapist</option>
                                {filteredTherapists.map((therapist) => (
                                    <option key={therapist.therapistId} value={therapist.therapistId}>
                                        {therapist.therapistName}
                                    </option>
                                ))}
                            </select>
                            {formData.serviceId && filteredTherapists.length === 0 && (
                                <p className="warning-text">{noTherapistMessage}</p>
                            )}
                            {!formData.serviceId && (
                                <p className="warning-text">Please select a service first</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Appointment Date</label>
                            <DatePicker
                                selected={formData.appointmentDate ? new Date(formData.appointmentDate) : null}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select date"
                                minDate={new Date()}
                                includeDates={availableDates}
                                required
                                disabled={!formData.therapistId}
                            />
                            {!formData.therapistId && (
                                <p className="warning-text">Please select a therapist first</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Time Slot</label>
                            <select
                                name="timeSlotId"
                                value={formData.timeSlotId}
                                onChange={handleChange}
                                required
                                disabled={therapistTimeSlots.length === 0}
                            >
                                <option value="">Select a time slot</option>
                                {therapistTimeSlots.map((slot) => (
                                    <option
                                        key={slot.timeSlotId}
                                        value={slot.timeSlotId}
                                        disabled={slot.status !== 0}
                                        style={{
                                            color: slot.status !== 0 ? (darkMode ? '#9ca3af' : '#6b7280') : (darkMode ? '#f9fafb' : '#1f2937'),
                                        }}
                                    >
                                        {slot.timeSlotDescription} {getStatusDescription(slot.status)}
                                    </option>
                                ))}
                            </select>
                            {formData.therapistId && formData.appointmentDate && therapistTimeSlots.length === 0 && (
                                <p className="warning-text">No available time slots for this date</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>{role === 'Therapist' ? 'Session Notes' : 'Notes for the Therapist'}</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder={
                                    role === 'Therapist'
                                        ? 'Any information about your availability or session details...'
                                        : 'Any special requests or information you want to share...'
                                }
                            />
                        </div>

                        <button type="submit" className="submit-button" disabled={loading || paymentProcessing}>
                            {(loading || paymentProcessing) && <span className="spinner"></span>}
                            {loading
                                ? role === 'Therapist' ? 'Scheduling...' : 'Booking in progress...'
                                : paymentProcessing
                                    ? 'Processing payment...'
                                    : role === 'Therapist' ? 'Schedule Availability' : 'Book Appointment'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BookingPage;