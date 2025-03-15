// import React, { useEffect, useState } from 'react'
// import '../styles/BookingPage.css'
// import DatePicker from 'react-datepicker'
// import "react-datepicker/dist/react-datepicker.css"
// import { addDays, isWeekend } from 'date-fns'

// export default function BookingPage() {

//     const [therapist, setTherapist] = useState([]); // Khai báo state để lưu danh sách bác sĩ
//     const [filterTherapist, setFilterTherapist] = useState([]);
//     const [selectedTherapist, setSelectedTherapist] = useState(null);
//     const [service, setService] = useState([]);
//     const [filterService, setFilterService] = useState(''); //filter
//     const [note, setNote] = useState('');
//     const [isPending, setIsPending] = useState(false);
//     const [error, setError] = useState(false);

//     const [therapistSchedules, setTherapistSchedules] = useState([]);
//     const [therapistTimeSlots, setTherapistTimeSlots] = useState([]);
//     //tao ra cac state da filter tu DB schedule va time slot
//     const [filterDocDay, setFilterDocDay] = useState({});
//     const [filterDocSlot, setFilterDocSlot] = useState({});
//     //state booking de check slot trong hay da ban
//     const [booking, setBooking] = useState([]);
//     //input cua nguoi dung ve slot
//     const [selectedSlot, setSelectedSlot] = useState([]);
//     //handle min max time
//     const [minMaxTime, setMinMaxTime] = useState({ min: null, max: null });



//     //lấy data bác sĩ và dịch vụ 
//     useEffect(() => {
//         fetch('https://jsonplaceholder.typicode.com/todos')
//             .then((response) => response.json())
//             .then((data) => setService(data))
//             .catch((error) => console.error("Lỗi khi lấy dữ liệu: ", error));
//     }, [])
//     useEffect(() => {
//         fetch('https://jsonplaceholder.typicode.com/todos')
//             .then((response) => response.json())
//             .then((data) => setTherapist(data))
//             .catch((error) => console.error("Lỗi khi lấy dữ liệu: ", error));
//     }, [service])
//     const handleService = (e) => {
//         const serviceInput = e.target.value;
//         console.log("Selected Service:", serviceInput); // check input service
//         console.log("All Therapists:", therapist); // check therapist
//         console.log("First Therapist:", therapist[0]);

//         const filtered = therapist.filter(person => person.id == serviceInput);
//         console.log("Filtered therapists: ", filtered);

//         setFilterService(serviceInput);
//         setFilterTherapist(filtered);
//     };
//     const handleTherapist = (e) => {
//         const therapistInput = e.target.value;
//         console.log(therapistInput); //check lay dung gtri chua
//         setSelectedTherapist(therapistInput);
//         const therapistObject = therapist.filter(t => t.id == therapistInput);
//         setFilterTherapist(therapistObject);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault(); // Ngăn chặn reload trang
//         console.log("Booking data:", {
//             filterService,
//             filterTherapist,
//             note
//         });
//     }
//     const handleReset = () => {
//         setFilterService('');
//         setFilterTherapist([]);
//         setNote('');
//     }

//     //    lay start time, end time trong object therapistTimeSlots để disable mấy time khác

//     useEffect(() => {
//         fetch("https://678762dfc4a42c9161067a9a.mockapi.io/therapistTimeSlots")
//             .then((response) => response.json())
//             .then((data) => {
//                 setTherapistTimeSlots(data);

//                 // Lấy startTime của object đầu tiên và endTime của object cuối cùng
//                 const firstSlot = data[0]?.StartTime || "08:00";
//                 const lastSlot = data[data.length - 1]?.EndTime || "17:00";

//                 // Chuyển startTime và endTime sang Date để xử lý
//                 const minTime = new Date();
//                 const maxTime = new Date();

//                 const [startHour, startMinute] = firstSlot.split(":");
//                 const [endHour, endMinute] = lastSlot.split(":");

//                 minTime.setHours(parseInt(startHour), parseInt(startMinute), 0);
//                 maxTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

//                 // Lưu vào state
//                 setMinMaxTime({ min: minTime, max: maxTime });
//             })
//             .catch((error) => console.error("Lỗi khi lấy dữ liệu: ", error));
//     }, []);

//     /* lấy ngày
//      filter therapistSchedules tìm ra những ngày có therapist id ứng với selected therapist (giá trị là selected therapist id) */
//     useEffect(() => {
//         // lấy danh sách các ngày làm việc trong DB
//         // lấy day of week trong object therapistSchedules
//         fetch("https://678762dfc4a42c9161067a9a.mockapi.io/therapistSchedules")
//             .then((response) => response.json())
//             .then((data) => setTherapistSchedules(data))
//             .catch((error) => console.error("Lỗi khi lấy dữ liệu: ", error));
//     }, []);
//     // tiếp tục xử lý lấy ngày
//     useEffect(() => {
//         if (selectedTherapist && therapistSchedules.length > 0) {
//             setTherapistSchedules(data);
//             filterDocDay = therapistSchedules.filter(day => day.TherapistId == selectedTherapist); //setSelectedTherapist gtri la 1 id
//             const workingDays = filterDocDay.map(day => day.DayOfWeek); // Lấy ra các dayOfWeek
//             setFilterDocDay(workingDays); // Lưu lại các ngày làm việc của therapist
//         }
//     }, [selectedTherapist, therapistSchedules]);

//     /*->Xử lý chọn giờ */
//     handleSlot = async (date, e) => {
//         //xóa data booking cũ nếu đã lấy ra 
//         setBooking([]);
//         const slotInput = e.target.value;
//         const timeStart = slotInput.split(";")[1].trim();
//         console.log(timeStart); // check Kết quả: "08:00"
//         // Lấy ra đối tượng time slot có start time trùng với user chọn
//         filterDocSlot = therapistTimeSlots.filter(therap => therap.StartTime === timeStart)
//         // lấy booking
//         try {
//             const response = await fetch('https://jsonplaceholder.typicode.com/todos');
//             const data = await response.json();
//             setBooking(data);
//             //check xem đã có booking nào chứa "time slot id" này chưa
//             const filterBooking = booking.filter(booking => booking.TimeSlotId === filterDocSlot.TimeSlotId)
//             if (filterBooking.length > 0) {
//                 alert("lịch đã có người đặt")
//                 return;
//             }
//             //chưa ai book slot thì hiển thị trên ô input
//             setSelectedDate(date);
//         } catch (error) {
//             console.error("Lỗi khi lấy dữ liệu booking:", error);
//         }
//     }
//     //bat dau lich
//     const [selectedDate, setSelectedDate] = useState(null);
//     return (
//         <div className="Booking">
//             <h2>Booking a service </h2>
//             <form onSubmit={handleSubmit} >

//                 <label >Loại dịch vụ</label>
//                 <select
//                     value={filterService}

//                     onChange={(e) => handleService(e)}
//                 >
//                     <option value="" disabled>Chọn Dịch vụ</option>
//                     {
//                         service.map((service) => (
//                             <option key={service.id} value={service.id}>{service.title}</option>
//                         ))}
//                 </select>
//                 {error && filterService && <p style={{ color: "red" }}>Dịch vụ không được để trống!</p>}


//                 <label >Chuyên viên da liễu</label>
//                 <select
//                     disabled={filterTherapist.length === 0}
//                     onChange={(e) => handleTherapist(e)}
//                 >
//                     <option value="" disabled>Chọn chuyên viên</option>
//                     {filterTherapist.map((therapist) => (
//                         <option key={therapist.id} value={therapist.id}>{therapist.title}</option>
//                     ))}
//                 </select>
//                 {error && filterTherapist.length === 0 && <p style={{ color: "red" }}>Chuyên viên không được để trống!</p>}

//                 {/*Booking slot*/}
//                 <div>
//                     <h3>Date Picker</h3>
//                     <DatePicker
//                         disabled={filterTherapist.length === 0}
//                         selected={selectedDate}
//                         onChange={(date, e) => handleSlot(date, e)}
//                         dateFormat="dd/MM/yyyy; hh:mm"
//                         // filterDate={handleDay}
//                         filterDate={(date) => {
//                             const dayOfWeek = date.getDay(); // Lấy ra dayOfWeek (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
//                             return filterDocDay.includes(dayOfWeek); // Chỉ hiển thị những ngày therapist làm việc
//                         }}
//                         showTimeSelect
//                         timeIntervals={60}
//                         timeFormat="HH:mm"
//                         // minTime={new Date().setHours(8, 0, 0)}
//                         // maxTime={new Date().setHours(17, 0, 0)}
//                         minTime={minMaxTime.min}
//                         maxTime={minMaxTime.max}
//                     />
//                 </div>
//                 {/*Note*/}
//                 <label>Note</label>
//                 <textarea
//                     value={note}
//                     placeholder='Ghi chú'
//                     onChange={(e) => setNote(e.target.value)}
//                 >
//                 </textarea>


//                 {!isPending ? <button type='submit'>Submit</button> : <button disabled>Submitting Form</button>}
//                 <br />
//                 <button type='button' onClick={handleReset} >Reset</button>


//             </form>


//         </div>
//     )

// }