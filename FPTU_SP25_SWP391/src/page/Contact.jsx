import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "../styles/Contact.css";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setStatus(null);

        try {
            await emailjs.send(
                "service_btehzea",  // Replace with your Service ID
                "template_47k9ey5", // Replace with your Template ID
                formData,
                "JuVWhcf8DMNpj82Sa"   // Replace with your Public Key
            );
            setStatus({ type: "success", message: "Sent successfully! We will contact you soon." });
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            setStatus({ type: "error", message: "Error sending email. Please try again!" });
            console.error("EmailJS Error:", error);
        }
        setIsSending(false);
    };

    return (
        <div className="contact-container">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-description">If you have any questions, please leave your information, and we will get back to you as soon as possible.</p>

            <div className="contact-form">
                <form onSubmit={handleSubmit}>
                    <label>Full Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Enter your full name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />

                    <label>Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />

                    <label>Message</label>
                    <textarea 
                        name="message" 
                        placeholder="Enter your message..." 
                        rows="5" 
                        value={formData.message} 
                        onChange={handleChange} 
                        required
                    ></textarea>

                    <button type="submit" disabled={isSending}>
                        {isSending ? "Sending..." : "Send Contact"}
                    </button>
                </form>
                {status && <p className={status.type === "success" ? "success-msg" : "error-msg"}>{status.message}</p>}
            </div>
        </div>
    );
};

export default Contact;