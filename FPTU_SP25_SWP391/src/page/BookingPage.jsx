import { useState, useEffect } from 'react';
import { postBooking, getAllServices, getTherapistSchedules, createPayment } from '../api/testApi';
import { useAuth } from '../page/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingPage = () => {
    const { isLoggedIn, userId, token, role } = useAuth();

    const [formData, setFormData] = useState({
        userId: '',
        therapistId: '',
        timeSlotId: '',
        useWallet: false,
        note: '',
        serviceId: '',
        scheduleId: '',
    });

    const [services, setServices] = useState([]);
    const [therapists, setTherapists] = useState([]);
    const [therapistTimeSlots, setTherapistTimeSlots] = useState([]);
    const [selectedTherapistData, setSelectedTherapistData] = useState(null);

    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        if (userId) {
            setFormData((prev) => ({
                ...prev,
                userId: userId,
            }));
        }
    }, [userId]);

    useEffect(() => {
        if (token) {
            fetchServices();
            fetchTherapists();
        }
    }, [token, role]);

    useEffect(() => {
        if (formData.scheduleId) {
            updateTherapistTimeSlotsBySchedule(formData.scheduleId);
        } else {
            setTherapistTimeSlots([]);
            setSelectedTherapistData(null);
        }
    }, [formData.scheduleId, therapists]);

    const fetchServices = async () => {
        try {
            const response = await getAllServices(token);
            setServices(response.data);
        } catch (err) {
            console.error('Error fetching services:', err);
            toast.error('Failed to load services. Please try again later.');
        }
    };

    const fetchTherapists = async () => {
        try {
            const response = await getTherapistSchedules(token);
            console.log('Raw therapist data:', response.data);
            setTherapists(response.data);
        } catch (err) {
            console.error('Error fetching therapists:', err);
            toast.error('Failed to load therapists. Please try again later.');
        }
    };

    const updateTherapistTimeSlotsBySchedule = (scheduleId) => {
        const selectedSchedule = therapists.find((t) => t.scheduleId.toString() === scheduleId.toString());
        console.log('Selected schedule:', selectedSchedule);

        if (selectedSchedule) {
            setSelectedTherapistData(selectedSchedule);

            console.log('Raw time slots:', selectedSchedule.timeSlots);
            console.log('Time slots status:', selectedSchedule.timeSlots.map(slot => ({
                id: slot.timeSlotId,
                description: slot.timeSlotDescription,
                status: slot.status
            })));

            setTherapistTimeSlots(selectedSchedule.timeSlots || []);
        } else {
            setTherapistTimeSlots([]);
            setSelectedTherapistData(null);
        }
    };

    const processPayment = async (bookingId) => {
        try {
            setPaymentProcessing(true);
            const paymentResponse = await createPayment(bookingId, token);

            if (paymentResponse && paymentResponse.data && paymentResponse.data.paymentLink) {
                window.location.href = paymentResponse.data.paymentLink;
                return;
            }

            toast.success('Payment processing initiated successfully!');
            setPaymentProcessing(false);
        } catch (err) {
            console.error('Error processing payment:', err);
            toast.error('Payment processing failed. Please try again or contact support.');
            setPaymentProcessing(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();

        if (selectedDate < currentDate) {
            toast.error('Please select a future date and time.');
            return;
        }

        setFormData({
            ...formData,
            appointmentDate: selectedDate.toISOString(),
        });
    };

    const handleRandomTherapist = (e) => {
        e.preventDefault();
        if (therapists && therapists.length > 0) {
            console.log('Available schedules:', therapists);
            const randomIndex = Math.floor(Math.random() * therapists.length);
            const randomSchedule = therapists[randomIndex];
            console.log('Selected random schedule:', randomSchedule);

            setFormData((prev) => ({
                ...prev,
                scheduleId: randomSchedule.scheduleId.toString(),
            }));

            toast.success(
                `Randomly selected: ${randomSchedule.therapistName} (${getDayName(randomSchedule.dayOfWeek)})`
            );
        } else {
            console.error('No therapist schedules available');
            toast.error('No therapist schedules available to choose from');
        }
    };

    const getDayName = (dayNumber) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayNumber % 7] || `Day ${dayNumber}`;
    };

    const getStatusDescription = (status) => {
        switch (status) {
            case 0:
                return '';
            case 1:
                return '(Booked)';
            case 2:
                return '(Unavailable)';
            default:
                return '(Unavailable)';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const bookingData = {
                userId: formData.userId,
                timeSlotId: formData.timeSlotId,
                appointmentDate: formData.appointmentDate,
                useWallet: formData.useWallet,
                note: formData.note,
                serviceId: formData.serviceId,
            };

            if (formData.therapistId) {
                bookingData.therapistId = formData.therapistId;
            }

            console.log('Submitting booking data:', bookingData);
            const res = await postBooking(bookingData, token);
            setResponse(res.data);

            toast.success('Booking confirmed! Your appointment has been scheduled successfully.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            if (res.data && res.data.bookingId && !formData.useWallet) {
                await processPayment(res.data.bookingId);
            }

            setLoading(false);
            setFormData({
                userId: userId || '',
                therapistId: '',
                timeSlotId: '',
                scheduleId: '',
                appointmentDate: '',
                useWallet: false,
                note: '',
                serviceId: '',
            });
        } catch (err) {
            setError(err.response ? err.response.data : 'Something went wrong');
            setLoading(false);
            toast.error(
                err.response ? `Booking failed: ${err.response.data}` : 'Something went wrong. Please try again later.',
                {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );
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

    const therapistScheduleOptions = therapists.map((schedule) => ({
        scheduleId: schedule.scheduleId,
        therapistId: schedule.therapistId,
        displayName: `${schedule.therapistName} (${getDayName(schedule.dayOfWeek)}, ${schedule.startWorkingTime.slice(
            0,
            5
        )} - ${schedule.endWorkingTime.slice(0, 5)})`,
    }));

    console.log('Therapist schedule options:', therapistScheduleOptions);

    return (
        <div className='min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-50 sm:px-6 lg:px-8'>
            <div className='max-w-3xl mx-auto overflow-hidden bg-white shadow-xl rounded-2xl'>
                <div className='px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600'>
                    <h1 className='text-2xl font-bold text-white'>Book Your Appointment</h1>
                    <p className='mt-1 text-blue-100'>
                        {role === 'Therapist'
                            ? 'Schedule your availability for client sessions'
                            : 'Schedule a session with our professional therapists'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='p-8'>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='space-y-1'>
                            <label className='text-sm font-medium text-gray-700'>Therapist Schedule (Optional)</label>
                            <select
                                name='scheduleId'
                                value={formData.scheduleId}
                                onChange={handleChange}
                                className='w-full p-3 text-gray-700 transition border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value=''>Select a therapist schedule</option>
                                {therapistScheduleOptions.map((option) => (
                                    <option key={option.scheduleId} value={option.scheduleId}>
                                        {option.displayName}
                                    </option>
                                ))}
                            </select>
                            <button
                                type='button'
                                onClick={handleRandomTherapist}
                                className='px-3 py-1 mt-2 text-sm font-medium text-blue-700 bg-white border border-blue-500 rounded-md hover:bg-blue-50'
                            >
                                Random Schedule
                            </button>
                        </div>

                        <div className='space-y-1'>
                            <label className='text-sm font-medium text-gray-700'>Time Slot</label>
                            <select
                                name='timeSlotId'
                                value={formData.timeSlotId}
                                onChange={handleChange}
                                className='w-full p-3 text-gray-700 transition border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                                disabled={therapistTimeSlots.filter((slot) => slot.status === 0).length === 0}
                            >
                                <option value=''>Select a time slot</option>
                                {therapistTimeSlots.map((slot, index) => (
                                    <option
                                        key={`${slot.timeSlotId}-${index}`}
                                        value={slot.status === 0 ? slot.timeSlotId : ''}
                                        disabled={slot.status !== 0}
                                        className={slot.status !== 0 ? 'text-gray-500' : 'text-black'}
                                    >
                                        {slot.timeSlotDescription} {getStatusDescription(slot.status)}
                                    </option>
                                ))}
                            </select>
                            {formData.scheduleId &&
                                therapistTimeSlots.filter((slot) => slot.status === 0).length === 0 && (
                                    <p className='mt-1 text-sm text-orange-500'>
                                        No available time slots for this schedule
                                    </p>
                                )}
                        </div>

                        <div className='space-y-1'>
                            <label className='text-sm font-medium text-gray-700'>Service</label>
                            <select
                                name='serviceId'
                                value={formData.serviceId}
                                onChange={handleChange}
                                className='w-full p-3 text-gray-700 transition border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                            >
                                <option value=''>Select a service</option>
                                {services.map((service) => (
                                    <option key={service.serviceId} value={service.serviceId}>
                                        {service.name} (${service.price})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex items-center mt-6 space-x-3'>
                            <div className='relative inline-block w-10 mr-2 align-middle select-none'>
                                <input
                                    type='checkbox'
                                    name='useWallet'
                                    id='useWallet'
                                    checked={formData.useWallet}
                                    onChange={handleChange}
                                    className='absolute block w-6 h-6 transition-all duration-200 bg-white border-4 border-gray-300 rounded-full appearance-none cursor-pointer checked:right-0 checked:border-blue-500 focus:outline-none'
                                />
                                <label
                                    htmlFor='useWallet'
                                    className='block h-6 overflow-hidden bg-gray-300 rounded-full cursor-pointer'
                                ></label>
                            </div>
                            <label htmlFor='useWallet' className='text-sm font-medium text-gray-700'>
                                Use Wallet for Payment
                            </label>
                        </div>
                    </div>

                    {selectedTherapistData && (
                        <div className='p-4 mt-6 rounded-lg bg-blue-50'>
                            <h3 className='font-medium text-blue-800'>Therapist Schedule Info</h3>
                            <p className='mt-1 text-sm text-blue-700'>
                                {selectedTherapistData.therapistName} is available on{' '}
                                {getDayName(selectedTherapistData.dayOfWeek)}
                                from {selectedTherapistData.startWorkingTime} to {selectedTherapistData.endWorkingTime}
                            </p>
                        </div>
                    )}

                    <div className='mt-6 space-y-1'>
                        <label className='text-sm font-medium text-gray-700'>
                            {role === 'Therapist' ? 'Session Notes' : 'Notes for the therapist'}
                        </label>
                        <textarea
                            name='note'
                            value={formData.note}
                            onChange={handleChange}
                            rows='4'
                            className='w-full p-3 text-gray-700 transition border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder={
                                role === 'Therapist'
                                    ? 'Any information about your availability or session details...'
                                    : 'Any special requests or information you want to share...'
                            }
                        ></textarea>
                    </div>

                    <div className='mt-6'>
                        <div className='p-4 mb-4 border-l-4 border-blue-500 bg-blue-50'>
                            <div className='flex'>
                                <div className='flex-shrink-0'>
                                    <svg
                                        className='w-5 h-5 text-blue-400'
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 20 20'
                                        fill='currentColor'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </div>
                                <div className='ml-3'>
                                    <p className='text-sm text-blue-700'>
                                        Checking "Use Wallet for Payment" will deduct the amount from your
                                        wallet balance. Otherwise, you will be redirected to the payment gateway after
                                        booking.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6'>
                        <button
                            type='submit'
                            disabled={loading || paymentProcessing}
                            className='flex items-center justify-center w-full px-4 py-3 font-medium text-white transition duration-300 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
                        >
                            {loading || paymentProcessing ? (
                                <>
                                    <svg
                                        className='w-5 h-5 mr-3 -ml-1 text-white animate-spin'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        ></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                        ></path>
                                    </svg>
                                    {loading
                                        ? role === 'Therapist'
                                            ? 'Scheduling...'
                                            : 'Booking in progress...'
                                        : 'Processing payment...'}
                                </>
                            ) : role === 'Therapist' ? (
                                'Schedule Availability'
                            ) : (
                                'Book Appointment'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingPage;