import { useState, useEffect } from 'react';
import { postBooking, getAllServices, getAllTimeSlots, getTherapistSchedules, createPayment } from '../api/testApi';
import { useAuth } from '../page/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingPage = () => {
    // Get authentication context including role
    const { isLoggedIn, userId, token, role } = useAuth();

    // State for form inputs
    const [formData, setFormData] = useState({
        userId: '',
        therapistId: '',
        timeSlotId: '',
        appointmentDate: '',
        useWallet: false,
        note: '',
        serviceId: '',
    });

    // State for API data
    const [services, setServices] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [therapists, setTherapists] = useState([]);
    const [selectedTherapist, setSelectedTherapist] = useState('');

    // State for API response
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    // Set userId from auth context when component mounts
    useEffect(() => {
        if (userId) {
            setFormData((prev) => ({
                ...prev,
                userId: userId,
            }));
        }
    }, [userId]);

    // Fetch necessary data when token is available
    useEffect(() => {
        if (token) {
            fetchServices();
            fetchTimeSlots();

            // Only fetch therapists if the user is not a therapist themselves
            fetchTherapists();
        }
    }, [token, role]);

    const fetchServices = async () => {
        try {
            const response = await getAllServices(token);
            setServices(response.data);
        } catch (err) {
            console.error('Error fetching services:', err);
            toast.error('Failed to load services. Please try again later.');
        }
    };

    const fetchTimeSlots = async () => {
        try {
            const response = await getAllTimeSlots(token);
            setTimeSlots(response.data);
        } catch (err) {
            console.error('Error fetching time slots:', err);
            toast.error('Failed to load time slots. Please try again later.');
        }
    };

    const fetchTherapists = async () => {
        try {
            const response = await getTherapistSchedules(token);
            // Filter users to only include therapists
            setTherapists(response.data);
        } catch (err) {
            console.error('Error fetching therapists:', err);
            toast.error('Failed to load therapists. Please try again later.');
        }
    };

    // Process payment after booking is created
    const processPayment = async (bookingId) => {
        try {
            setPaymentProcessing(true);
            const paymentResponse = await createPayment(bookingId, token);

            // If the payment API returns a URL, redirect to it
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

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle date change separately to format it properly
    const handleDateChange = (e) => {
        const date = new Date(e.target.value);
        setFormData({
            ...formData,
            appointmentDate: date.toISOString(),
        });
    };

    const handleRandomTherapist = (e) => {
        e.preventDefault(); // Prevent form submission

        // Kiểm tra nếu có therapist nào thì mới random
        if (therapists && therapists.length > 0) {
            // Log danh sách therapist để kiểm tra
            console.log('Available therapists:', therapists);

            // Không lọc theo status để đảm bảo luôn có therapist
            const randomIndex = Math.floor(Math.random() * therapists.length);
            const randomTherapist = therapists[randomIndex];

            console.log('Selected random therapist:', randomTherapist);

            // Update cả hai state
            setSelectedTherapist(randomTherapist.therapistId);
            setFormData((prev) => ({
                ...prev,
                therapistId: randomTherapist.therapistId,
            }));

            // Hiển thị thông báo thành công
            toast.success(`Đã chọn ngẫu nhiên: ${randomTherapist.therapistName}`);
        } else {
            console.error('No therapists available');
            toast.error('Không có bác sĩ trị liệu nào để chọn');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Prepare JSON data instead of FormData
            const bookingData = {
                userId: formData.userId,
                timeSlotId: formData.timeSlotId,
                appointmentDate: formData.appointmentDate,
                useWallet: formData.useWallet,
                note: formData.note,
                serviceId: formData.serviceId,
            };

            // Add therapistId if it was selected (even if user is not a therapist)
            if (formData.therapistId) {
                bookingData.therapistId = formData.therapistId;
            }

            // For debugging - log the data that's being sent
            console.log('Submitting booking data:', bookingData);

            // Make the API call using the imported function
            const res = await postBooking(bookingData, token);
            setResponse(res.data);

            // Show success toast
            toast.success('Booking confirmed! Your appointment has been scheduled successfully.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Initiate payment if booking was successful and not using wallet
            if (res.data && res.data.bookingId && !formData.useWallet) {
                // Start payment process
                await processPayment(res.data.bookingId);
            }

            setLoading(false);

            // Reset form after successful submission (keep userId from auth)
            setFormData({
                userId: userId || '',
                therapistId: '',
                timeSlotId: '',
                appointmentDate: '',
                useWallet: false,
                note: '',
                serviceId: '',
            });
        } catch (err) {
            setError(err.response ? err.response.data : 'Something went wrong');
            setLoading(false);

            // Show error toast
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
                        {/* Therapist selection - now with required removed */}
                        <div className='space-y-1'>
                            <label className='text-sm font-medium text-gray-700'>Therapist (Optional)</label>
                            <select
                                name='therapistId'
                                value={formData.therapistId}
                                onChange={(e) => {
                                    setSelectedTherapist(e.target.value);
                                    handleChange(e);
                                }}
                                className='w-full p-3 text-gray-700 transition border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            >
                                <option value=''>Select a therapist</option>
                                {therapists.map((therapist) => (
                                    <option key={therapist.therapistId} value={therapist.therapistId}>
                                        {therapist.therapistName}
                                    </option>
                                ))}
                            </select>
                            <button
                                type='button'
                                onClick={handleRandomTherapist}
                                className='px-3 py-1 mt-2 text-sm font-medium text-blue-700 bg-white border border-blue-500 rounded-md hover:bg-blue-50'
                            >
                                Random Therapist
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
                            >
                                <option value=''>Select a time slot</option>
                                {timeSlots.map((slot) => (
                                    <option key={slot.timeSlotId} value={slot.timeSlotId}>
                                        {slot.startTime} - {slot.endTime}
                                    </option>
                                ))}
                            </select>
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

                        <div className='space-y-1'>
                            <label className='text-sm font-medium text-gray-700'>Appointment Date</label>
                            <input
                                type='datetime-local'
                                name='appointmentDate'
                                onChange={handleDateChange}
                                className='w-full p-3 text-gray-700 transition border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                required
                            />
                        </div>

                        {/* <div className='flex items-center mt-6 space-x-3'>
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
                        </div> */}
                    </div>

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
                                        Checking &quot;Use Wallet for Payment&quot; will deduct the amount from your
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
