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
                "service_btehzea",  // Thay bằng Service ID của bạn
                "template_47k9ey5", // Thay bằng Template ID của bạn
                formData,
                "JuVWhcf8DMNpj82Sa"   // Thay bằng Public Key của bạn
            );
            setStatus({ type: "success", message: "Gửi thành công! Chúng tôi sẽ liên hệ sớm nhất." });
            setFormData({ name: "", email: "", message: "" });
        } catch (error) {
            setStatus({ type: "error", message: "Lỗi khi gửi email. Vui lòng thử lại!" });
            console.error("EmailJS Error:", error);
        }
        setIsSending(false);
    };

    return (
        <div className="contact-container">
            <h1 className="contact-title">Liên Hệ Với Chúng Tôi</h1>
            <p className="contact-description">Nếu bạn có bất kỳ câu hỏi nào, hãy để lại thông tin, chúng tôi sẽ liên hệ sớm nhất có thể.</p>

            <div className="contact-form">
                <form onSubmit={handleSubmit}>
                    <label>Họ và Tên</label>
                    <input type="text" name="name" placeholder="Nhập họ và tên" value={formData.name} onChange={handleChange} required />

                    <label>Email</label>
                    <input type="email" name="email" placeholder="Nhập email" value={formData.email} onChange={handleChange} required />

                    <label>Nội dung</label>
                    <textarea name="message" placeholder="Nhập nội dung liên hệ..." rows="5" value={formData.message} onChange={handleChange} required></textarea>

                    <button type="submit" disabled={isSending}>{isSending ? "Đang gửi..." : "Gửi liên hệ"}</button>
                </form>
                {status && <p className={status.type === "success" ? "success-msg" : "error-msg"}>{status.message}</p>}
            </div>
        </div>
    );
};

export default Contact;
