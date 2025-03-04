import React, { useEffect, useState } from 'react'
import '../styles/BookingPage.css'
import { p } from 'framer-motion/client';
export default function BookingPage() {

    const [therapist, setTherapist] = useState([]); // Khai báo state để lưu danh sách bác sĩ
    const [selectedTherapist, setSelectedTherapist] = useState([]);

    const [service, setService] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [note, setNote] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(false);
    
    //lấy data bác sĩ và dịch vụ 
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((data) => setService(data))
            .catch((error) => console.error("Lỗi khi lấy dữ liệu: ", error));
    },[])

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((data) => setTherapist(data))
            .catch((error) => console.error("Lỗi khi lấy dữ liệu: ", error));
    },[service])
    
    const handleService = (e) => {
         const serviceInput = e.target.value;
        setSelectedService(serviceInput)

        const filtered = therapist.filter(person => person.title === serviceInput);
        setFilteredTherapists(filtered);
    }


    const handleSubmit = (e) => {/*sua lai*/
        e.preventDefault();

        if (!therapist || !service) {         //thieu date
            setError(true)
            return;
        }
        setError(false)
        const blog = { therapist, service, note }         //thieu date

        setIsPending(true);

        fetch('https://pokeapi.co/api/v2/pokemon?limit=10', {
            method: 'Post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog)
        }).then(() => {
            console.log(blog)
            console.log('new blog added');
            setIsPending(false);
        })
    }

    const handleReset = () => {
        setSelectedService("");
        setSelectedTherapist([])
        // setDate('')
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
                {error && !selectedService && <p style={{ color: "red" }}>Dịch vụ không được để trống!</p>}


                <label >Chuyên viên da liễu</label>
                <select
                    disabled={selectedTherapist.length === 0}
                    onChange={(e) =>console.log("Therapist selected:", e.target.value)}
                >
                    <option value="" disabled>Chọn chuyên viên</option>
                    {selectedTherapist.map((therapist) => (
                        <option key={therapist.id} value={therapist.id}>{therapist.title}</option>
                    ))}
                </select>
                {error && !selectedTherapist && <p style={{ color: "red" }}>Chuyên viên không được để trống!</p>}

                <label>Note</label>
                <textarea
                    value={note}
                    placeholder='Ghi chú'
                    onChange={(e) => setNote(e.target.value)}
                >
                </textarea>
									{/*------booking slot -------*/}
                {!isPending ? <button type='submit'>Submit</button> : <button disabled>Submitting Form</button>}
                <br />
                <button type='button' onClick={handleReset} >Reset</button>


            </form>
            
        </div>
    )
}

