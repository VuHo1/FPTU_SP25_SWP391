import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HomePage = ({ darkMode }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility

  const containerStyles = {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: darkMode ? "#1c2526" : "#fafafa",
    color: darkMode ? "#ffffff" : "#1d1d1f",
    overflowX: "hidden",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
    position: "relative",
  };

  const sectionStyles = {
    width: "100%",
    padding: "60px 20px",
    textAlign: "center",
    boxSizing: "border-box",
  };

  const headingStyles = {
    fontSize: "48px",
    fontWeight: "700",
    letterSpacing: "-1px",
    marginBottom: "20px",
    color: darkMode ? "#ffffff" : "#1d1d1f",
  };

  const paragraphStyles = {
    fontSize: "18px",
    lineHeight: "1.6",
    maxWidth: "800px",
    margin: "0 auto 30px",
    color: darkMode ? "#a1a1a6" : "#6e6e73",
  };

  const buttonStyles = {
    display: "inline-block",
    padding: "14px 32px",
    backgroundColor: darkMode ? "#34c759" : "#e67e22",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "600",
    borderRadius: "12px",
    textDecoration: "none",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  };

  const contactIconStyles = {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    width: "60px",
    height: "60px",
    backgroundColor: darkMode ? "#34c759" : "#e67e22",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
    cursor: "pointer",
    transition: "transform 0.3s ease, background-color 0.3s ease",
  };

  const popupStyles = {
    position: "fixed",
    bottom: "100px",
    right: "30px",
    backgroundColor: darkMode ? "#2c2c2e" : "#ffffff",
    color: darkMode ? "#ffffff" : "#1d1d1f",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: darkMode
      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
      : "0 4px 12px rgba(0, 0, 0, 0.2)",
    zIndex: 1001,
    textAlign: "center",
    maxWidth: "300px",
  };

  const popupButtonStyles = {
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: darkMode ? "#34c759" : "#e67e22",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  };

  return (
    <div style={containerStyles}>
      {/* Hero Section */}
      <section
        style={{
          ...sectionStyles,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: darkMode
            ? "linear-gradient(135deg, #1c2526 0%, #2c3e50 100%)"
            : "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)",
        }}
      >
        <h1>
          {Array.from("Beautishop").map((letter, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                fontSize: "80px",
                opacity: 0,
                transform: "translateY(20px)",
                animation: `fadeUp 0.8s ease-out forwards`,
                animationDelay: `${index * 0.1}s`,
                color: darkMode ? "#ffffff" : "#1d1d1f",
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <p style={{ ...paragraphStyles, fontSize: "24px", marginTop: "20px" }}>
          Nơi mang đến vẻ đẹp tự nhiên và sự tự tin với các giải pháp chăm sóc
          da chuyên sâu.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Link
            to="/service"
            style={buttonStyles}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = darkMode
                ? "#2ea74d"
                : "#d2691e")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = darkMode
                ? "#34c759"
                : "#e67e22")
            }
          >
            Khám Phá Ngay
          </Link>
        </motion.div>
      </section>

      {/* Services Overview */}
      <section style={sectionStyles}>
        <h2 style={headingStyles}>Dịch Vụ Của Chúng Tôi</h2>
        <p style={paragraphStyles}>
          Beautishop cung cấp các dịch vụ chăm sóc da đa dạng, từ tư vấn cá nhân
          hóa đến các liệu trình công nghệ cao, giúp bạn sở hữu làn da khỏe đẹp.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {[
            {
              title: "Tư Vấn Da Chuyên Sâu",
              desc: "Phân tích da bằng công nghệ AI để đưa ra giải pháp phù hợp nhất.",
            },
            {
              title: "Liệu Trình Trị Liệu",
              desc: "Các phương pháp không xâm lấn giúp tái tạo và phục hồi làn da.",
            },
            {
              title: "Sản Phẩm Cao Cấp",
              desc: "Dòng sản phẩm chăm sóc da tự nhiên, an toàn và hiệu quả.",
            },
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: false }}
              style={{
                width: "300px",
                padding: "20px",
                backgroundColor: darkMode ? "#2c2c2e" : "#ffffff",
                borderRadius: "12px",
                boxShadow: darkMode
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.06)",
                textAlign: "left",
              }}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: darkMode ? "#ffffff" : "#1d1d1f",
                  marginBottom: "10px",
                }}
              >
                {service.title}
              </h3>
              <p style={{ ...paragraphStyles, margin: 0 }}>{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        style={{
          ...sectionStyles,
          backgroundColor: darkMode ? "#213547" : "#f5f5f5",
        }}
      >
        <h2 style={headingStyles}>Tại Sao Chọn Beautishop?</h2>
        <p style={paragraphStyles}>
          Chúng tôi tự hào mang đến sự khác biệt với đội ngũ chuyên gia hàng
          đầu, công nghệ tiên tiến, và cam kết chất lượng vượt trội.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "40px",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {[
            {
              title: "Chuyên Gia Kinh Nghiệm",
              desc: "Hơn 10 năm trong ngành chăm sóc da.",
            },
            {
              title: "Công Nghệ Hiện Đại",
              desc: "Ứng dụng AI và thiết bị tiên tiến.",
            },
            {
              title: "Sản Phẩm An Toàn",
              desc: "Được chứng nhận quốc tế, không hóa chất độc hại.",
            },
            {
              title: "Hỗ Trợ 24/7",
              desc: "Đội ngũ luôn sẵn sàng giải đáp mọi thắc mắc.",
            },
          ].map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: false }}
              style={{
                width: "220px",
                padding: "20px",
                backgroundColor: darkMode ? "#2c2c2e" : "#ffffff",
                borderRadius: "12px",
                boxShadow: darkMode
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.06)",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  color: darkMode ? "#34c759" : "#e67e22",
                  marginBottom: "10px",
                }}
              >
                {reason.title}
              </h3>
              <p style={{ ...paragraphStyles, margin: 0 }}>{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={sectionStyles}>
        <h2 style={headingStyles}>Khách Hàng Nói Gì?</h2>
        <p style={paragraphStyles}>
          Nghe từ chính những khách hàng đã trải nghiệm dịch vụ tại Beautishop.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {[
            {
              name: "Nguyễn Thị Lan",
              quote:
                "Làn da của tôi đã cải thiện rõ rệt sau liệu trình tại Beautishop. Dịch vụ tuyệt vời!",
            },
            {
              name: "Trần Văn Hùng",
              quote:
                "Sản phẩm rất an toàn và hiệu quả. Tôi hoàn toàn tin tưởng Beautishop.",
            },
            {
              name: "Lê Minh Anh",
              quote:
                "Đội ngũ chuyên gia rất nhiệt tình, tư vấn chi tiết và tận tâm.",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: false }}
              style={{
                width: "350px",
                padding: "25px",
                backgroundColor: darkMode ? "#2c2c2e" : "#ffffff",
                borderRadius: "12px",
                boxShadow: darkMode
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 4px 12px rgba(0, 0, 0, 0.06)",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontStyle: "italic",
                  color: darkMode ? "#bdc3c7" : "#555",
                  marginBottom: "15px",
                }}
              >
                "{testimonial.quote}"
              </p>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: darkMode ? "#ffffff" : "#1d1d1f",
                }}
              >
                {testimonial.name}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section
        style={{
          ...sectionStyles,
          background: darkMode
            ? "linear-gradient(135deg, #34c759 0%, #2c3e50 100%)"
            : "linear-gradient(135deg, #e67e22 0%, #f9fafb 100%)",
          color: "#ffffff",
        }}
      >
        <h2 style={{ ...headingStyles, color: "#ffffff" }}>
          Bắt Đầu Hành Trình Làm Đẹp
        </h2>
        <p
          style={{
            ...paragraphStyles,
            color: "#ffffff",
            fontSize: "20px",
            marginBottom: "40px",
          }}
        >
          Đặt lịch ngay hôm nay để trải nghiệm dịch vụ chăm sóc da đẳng cấp tại
          Beautishop. Chúng tôi sẵn sàng đồng hành cùng bạn trên con đường chạm
          đến làn da mơ ước!
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
        >
          <Link
            to="/booking_page"
            style={{
              ...buttonStyles,
              backgroundColor: "#ffffff",
              color: darkMode ? "#1c2526" : "#e67e22",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#e0e0e0")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ffffff")
            }
          >
            Liên Hệ Ngay
          </Link>
        </motion.div>
      </section>

      {/* Contact Icon */}
      <div
        style={contactIconStyles}
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.backgroundColor = darkMode
            ? "#2ea74d"
            : "#d2691e";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = darkMode
            ? "#34c759"
            : "#e67e22";
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          style={popupStyles}
        >
          <p style={{ fontSize: "18px", margin: "0 0 10px" }}>
            Hãy liên hệ với chúng tôi!
          </p>
          <Link to="/contact">
            <button
              style={popupButtonStyles}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = darkMode
                  ? "#2ea74d"
                  : "#d2691e")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = darkMode
                  ? "#34c759"
                  : "#e67e22")
              }
            >
              Đi đến trang liên hệ
            </button>
          </Link>
        </motion.div>
      )}

      {/* Inline Keyframes */}
      <style>
        {`
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
