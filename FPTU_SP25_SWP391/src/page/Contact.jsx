import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = ({ darkMode }) => { // Added darkMode prop for consistency
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
                "service_btehzea",
                "template_47k9ey5",
                formData,
                "JuVWhcf8DMNpj82Sa"
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
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .contact-container {
          min-height: 100vh;
          padding: 3rem 2rem;
          background: ${darkMode ? "#1c2526" : "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)"};
          font-family: 'Poppins', sans-serif;
          color: ${darkMode ? "#ecf0f1" : "#2c3e50"};
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .contact-title {
          font-size: 2.5rem;
          font-weight: 600;
          color: ${darkMode ? "#1abc9c" : "#1f2937"};
          margin-bottom: 1rem;
          text-align: center;
        }
        .contact-description {
          font-size: 1.2rem;
          color: ${darkMode ? "#bdc3c7" : "#6b7280"};
          max-width: 800px;
          text-align: center;
          margin-bottom: 3rem;
          line-height: 1.6;
        }
        .contact-form {
          background: ${darkMode ? "#2c3e50" : "#ffffff"};
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, ${darkMode ? "0.3" : "0.06"});
          width: 100%;
          max-width: 600px;
          text-align: left;
        }
        .contact-form label {
          font-size: 1.1rem;
          font-weight: 500;
          color: ${darkMode ? "#f9fafb" : "#1f2937"};
          display: block;
          margin-bottom: 0.5rem;
        }
        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid ${darkMode ? "#4b5563" : "#d1d5db"};
          border-radius: 8px;
          font-size: 1rem;
          color: ${darkMode ? "#f9fafb" : "#1f2937"};
          background: ${darkMode ? "#34495e" : "#fff"};
          outline: none;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: ${darkMode ? "#1abc9c" : "#3b82f6"};
          box-shadow: 0 0 8px rgba(${darkMode ? "26, 188, 156" : "59, 130, 246"}, 0.2);
        }
        .contact-form textarea {
          resize: vertical;
          min-height: 120px;
        }
        .contact-form button {
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
        }
        .contact-form button:hover:not(:disabled) {
          background: ${darkMode ? "#16a085" : "#2563eb"};
          transform: translateY(-2px);
        }
        .contact-form button:disabled {
          background: ${darkMode ? "#4b5563" : "#e5e7eb"};
          cursor: not-allowed;
          transform: none;
        }
        .success-msg {
          margin-top: 1rem;
          text-align: center;
          color: ${darkMode ? "#34c759" : "#28a745"};
          font-weight: 500;
        }
        .error-msg {
          margin-top: 1rem;
          text-align: center;
          color: ${darkMode ? "#ff8787" : "#dc3545"};
          font-weight: 500;
        }

        /* Scrollbar Styles */
        .contact-container::-webkit-scrollbar {
          width: 8px;
        }
        .contact-container::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#6b7280" : "#6b7280"};
          border-radius: 4px;
        }
        .contact-container::-webkit-scrollbar-track {
          background: ${darkMode ? "#1c2526" : "#f8f9fa"};
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .contact-container {
            padding: 2rem 1rem;
          }
          .contact-title {
            font-size: 2rem;
          }
          .contact-description {
            font-size: 1rem;
          }
          .contact-form {
            padding: 1.5rem;
          }
        }
      `}</style>

            <div className="contact-container">
                <h1 className="contact-title">Contact Us</h1>
                <p className="contact-description">
                    If you have any questions, please leave your information, and we will get back to you as soon as possible.
                </p>

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
        </>
    );
};

export default Contact;