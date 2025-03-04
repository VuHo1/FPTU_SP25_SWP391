import React, { useEffect, useState } from 'react'
import '../styles/BookingPage.css'
import { p } from 'framer-motion/client';
export default function BookingPage() {

    const [therapist, setTherapist] = useState([]); // Khai báo state để lưu danh sách bác sĩ
    const [selectedTherapist, setSelectedTherapist] = useState([]);
    const [service, setService] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [note, setNote] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(false);

    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
/*Test render lich*/
    // useEffect(() => {
    //     const testTherapistId = 1; // Thay bằng một ID therapist có trong API 
    //     console.log(" test getAvailableSlot bang therapist ID:", testTherapistId);
    
    //     getAvailableSlot(testTherapistId);
    // }, []);

    const getAvailableSlot = async () => {
        setDocSlots([]); 
    
        let today = new Date();
    
        try {
            
            const bookedRes = await fetch(`linkAPI?therapistId=${selectedTherapist.id}`);
            const bookedSlots = await bookedRes.json(); 
    
            for (let i = 0; i < 7; i++) {
                let currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i);
    
                let endTime = new Date();
                endTime.setDate(today.getDate() + i);
                endTime.setHours(21, 0, 0, 0);
    
                if (today.getDate() === currentDate.getDate()) {
                    currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
                    currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
                } else {
                    currentDate.setHours(10);
                    currentDate.setMinutes(0);
                }
    
                let timeSlots = [];
                while (currentDate < endTime) {
                    let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
                    
                    const isBooked = bookedSlots.some(booked => 
                        new Date(booked.datetime).getTime() === currentDate.getTime()
                    );
    
                    if (!isBooked) { 
                        timeSlots.push({
                            datetime: new Date(currentDate),
                            time: formattedTime
                        });
                    }
    
                    currentDate.setMinutes(currentDate.getMinutes() + 30);
                }
    
                setDocSlots(prev => ([...prev, timeSlots]));
            }
        } catch (error) {
            console.error("Lỗi khi lấy lịch đã đặt:", error);
        }
    };
    
    useEffect(() => {
        if (selectedTherapist && Object.keys(selectedTherapist).length > 0) {
            getAvailableSlot();
        } else {
            setDocSlots([]); 
        }
    }, [selectedTherapist]);


    //lấy data bác sĩ và dịch vụ 
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((data) => setService(data))
            .catch((error) => console.error("Lỗi khi lấy dữ liệu: ", error));
    }, [])

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((data) => setTherapist(data))
            .catch((error) => console.error("Lỗi khi lấy dữ liệu: ", error));
    }, [service])

    const handleService = (e) => {
        const serviceInput = e.target.value;
        console.log("Selected Service:", serviceInput); // check input service
        console.log("All Therapists:", therapist); // check therapist
        console.log("First Therapist:", therapist[0]);

        const filtered = therapist.filter(person => person.id == serviceInput);
        console.log("Filtered therapists: ", filtered); 

        setSelectedService(serviceInput);
        setSelectedTherapist(filtered);
    };

    const handleTherapist = (e) => {
        const therapistInput = e.target.value;
        const therapistObject = therapist.find(t => t.id == therapistInput); 
        setSelectedTherapist(therapistObject); 
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!selectedTherapist || !selectedService || !slotTime) {
            setError(true);
            return;
        }
        setError(false);
        setIsPending(true);
    
        const selectedSlot = docSlots[slotIndex].find(slot => slot.time === slotTime);
    
        if (!selectedSlot) {
            alert("Lỗi: Bạn chưa chọn thời gian!");
            setIsPending(false);
            return;
        }
    
        try {
            // check lại xem slot này còn trống không
            const res = await fetch(`LinkAPI?therapistId=${selectedTherapist.id}&datetime=${selectedSlot.datetime.toISOString()}`);
            const { isAvailable } = await res.json();
    
            if (!isAvailable) {
                alert("Lỗi: Khung giờ này đã được đặt bởi khách khác!");
                setIsPending(false);
                return;
            }
    
            // Nếu slot vẫn trống thif đặt lịch
            const bookingData = {
                therapistId: selectedTherapist.id,
                serviceId: selectedService,
                note: note,
                datetime: selectedSlot.datetime.toISOString(),
            };
    
            const response = await fetch('https://your-api.com/book-appointment', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData)
            });
    
            if (response.ok) {
                console.log("Lịch đặt thành công!");
                alert("Đặt lịch thành công!");
                getAvailableSlot(); // Cập nhật lại danh sách lịch trốmg
            } else {
                console.error("Lỗi khi đặt lịch:", await response.text());
                alert("Đặt lịch thất bại!");
            }
        } catch (error) {
            console.error("Lỗi kết nối API:", error);
            alert("Vui lòng thử lại.");
        } finally {
            setIsPending(false);
        }
    };
    

    const handleReset = () => {
        setSelectedService('');
        setSelectedTherapist([])
        setNote('')
        setError(false)
    }

    return (
        <div className="Booking">
            <h2>Booking a service </h2>
            <form onSubmit={handleSubmit} >

                <label >Loại dịch vụ</label>s
                <select
                    value={selectedService}
                    onChange={(e) => handleService(e)}
                >
                    <option value="" disabled>Chọn Dịch vụ</option>
                    {
                        service.map((service) => (
                            <option key={service.id} value={service.id}>{service.title}</option>
                        ))}
                </select>
                {error && selectedService && <p style={{ color: "red" }}>Dịch vụ không được để trống!</p>}


                <label >Chuyên viên da liễu</label>
                <select
                    disabled={selectedTherapist.length === 0}
                    onChange={(e) => handleTherapist(e)}
                >
                    <option value="" disabled>Chọn chuyên viên</option>
                    {selectedTherapist.map((therapist) => (
                        <option key={therapist.id} value={therapist.id}>{therapist.title}</option>
                    ))}
                </select>
                {error && selectedTherapist.length === 0 && <p style={{ color: "red" }}>Chuyên viên không được để trống!</p>}

                <label>Note</label>
                <textarea
                    value={note}
                    placeholder='Ghi chú'
                    onChange={(e) => setNote(e.target.value)}
                >
                </textarea>

                {/*Booking slot*/}
                {selectedTherapist && docSlots.length > 0 && (
                    <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                        <p>Booking slots</p>
                        <div key={slotIndex} className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                            {docSlots.map((item, index) => (
                                <div
                                    onClick={() => setSlotIndex(index)}
                                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                                    key={index}
                                >
                                    <p>{item[0] && item[0].datetime.toDateString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className='flex item-center gap-3 w-full overflow-x-scroll mt-4'>
                            {docSlots[slotIndex].map((item, index) => (
                                <p
                                    onClick={() => setSlotTime(item.time)}
                                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
                                    key={index}
                                >
                                    {item.time}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {!isPending ? <button type='submit'>Submit</button> : <button disabled>Submitting Form</button>}
                <br />
                <button type='button' onClick={handleReset} >Reset</button>


            </form>


        </div>
    )
}

