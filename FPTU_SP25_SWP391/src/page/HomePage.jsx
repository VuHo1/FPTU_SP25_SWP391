import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../page/AuthContext";
import { getAllServices, getImageService } from "../api/testApi";

const HomePage = ({ darkMode }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isLoggedIn, username } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      const token = localStorage.getItem("token");
      try {
        const servicesResponse = await getAllServices(token || null);
        const allServices = servicesResponse.data || [];
        const shuffledServices = shuffleArray(allServices).slice(0, 3);

        const servicesWithImages = await Promise.all(
          shuffledServices.map(async (service) => {
            try {
              const imageResponse = await getImageService(service.serviceId, token || null);
              const images = imageResponse.data || [];
              const mainImage = images.find((img) => img.isMain) || images[0];
              return {
                ...service,
                image: mainImage ? mainImage.imageURL : null,
              };
            } catch (imageErr) {
              console.warn(`No images found for service ${service.serviceId}`);
              return { ...service, image: null };
            }
          })
        );

        setServices(servicesWithImages);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (isLoggedIn && username) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, username]);

  // Base Styles
  const containerStyles = {
    width: "100vw",
    minHeight: "100vh",
    backgroundColor: darkMode ? "#1c2526" : "#fafafa",
    color: darkMode ? "#ffffff" : "#1d1d1f",
    overflowX: "hidden",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
  };

  // Updated Welcome Styles
  const welcomeStyles = {
    position: "absolute",
    top: "120px", // Adjusted to sit below navbar or header
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "600px",
    background: darkMode
      ? "linear-gradient(135deg, rgba(44, 62, 80, 0.95), rgba(52, 199, 89, 0.15))"
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(230, 126, 34, 0.15))",
    borderRadius: "16px",
    border: darkMode ? "1px solid #5a758c" : "1px solid #e0e0e0",
    boxShadow: darkMode
      ? "0 12px 32px rgba(0, 0, 0, 0.5)"
      : "0 12px 32px rgba(0, 0, 0, 0.1)",
    padding: "20px 30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  };

  const welcomeTextStyles = {
    fontSize: "22px",
    fontWeight: "600",
    color: darkMode ? "#ecf0f1" : "#2c3e50",
    letterSpacing: "0.2px",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const dismissButtonStyles = {
    background: "transparent",
    border: "none",
    color: darkMode ? "#bdc3c7" : "#7f8c8d",
    fontSize: "16px",
    cursor: "pointer",
    padding: "5px 10px",
    transition: "color 0.3s ease",
  };

  const sectionStyles = {
    width: "100%",
    padding: "60px 20px",
    textAlign: "center",
    boxSizing: "border-box",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  };

  const overlayStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  };

  const contentStyles = {
    position: "relative",
    zIndex: 2,
  };

  const headingStyles = {
    fontSize: "48px",
    fontWeight: "700",
    letterSpacing: "-1px",
    marginBottom: "20px",
    color: "#ffffff",
    fontFamily: "'Poppins', sans-serif",
  };

  const paragraphStyles = {
    fontSize: "18px",
    lineHeight: "1.6",
    maxWidth: "800px",
    margin: "0 auto 30px",
    color: "#ffffff",
    fontFamily: "'Poppins', sans-serif",
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
    fontFamily: "'Poppins', sans-serif",
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
    fontFamily: "'Poppins', sans-serif",
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
    fontFamily: "'Poppins', sans-serif",
  };

  const serviceCardStyles = {
    width: "300px",
    padding: "20px",
    backgroundColor: darkMode
      ? "rgba(44, 44, 46, 0.9)"
      : "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    boxShadow: darkMode
      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
      : "0 4px 12px rgba(0, 0, 0, 0.06)",
    textAlign: "left",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const facilityCardStyles = {
    width: "350px",
    padding: "20px",
    backgroundColor: darkMode
      ? "rgba(44, 44, 46, 0.9)"
      : "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    boxShadow: darkMode
      ? "0 4px 12px rgba(0, 0, 0, 0.3)"
      : "0 4px 12px rgba(0, 0, 0, 0.06)",
    textAlign: "center",
  };

  const welcomeVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } },
  };

  return (
    <div style={containerStyles}>
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            variants={welcomeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={welcomeStyles}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateX(-50%) scale(1.02)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateX(-50%) scale(1)")
            }
          >
            <div style={welcomeTextStyles}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={darkMode ? "#34c759" : "#e67e22"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>Welcome back, {username}!</span>
            </div>
            <button
              style={dismissButtonStyles}
              onClick={() => setShowWelcome(false)}
              onMouseEnter={(e) => (e.currentTarget.style.color = darkMode ? "#34c759" : "#e67e22")}
              onMouseLeave={(e) => (e.currentTarget.style.color = darkMode ? "#bdc3c7" : "#7f8c8d")}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        style={{
          ...sectionStyles,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage:
            "url('https://www.dermalogica.com.au/cdn/shop/articles/better-skin-see-a-therapist.jpg?v=1600386693')",
          paddingTop: isLoggedIn && username ? "180px" : "60px", // Adjusted for welcome message
        }}
      >
        <div style={overlayStyles}></div>
        <div style={contentStyles}>
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
                  color: "#ffffff",
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p
            style={{ ...paragraphStyles, fontSize: "24px", marginTop: "20px" }}
          >
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
        </div>
      </section>

      {/* Services Overview */}
      <section
        style={{
          ...sectionStyles,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556228578-567ba5e7e57c')",
        }}
      >
        <div style={overlayStyles}></div>
        <div style={contentStyles}>
          <h2 style={headingStyles}>Dịch Vụ Nổi Bật</h2>
          <p style={paragraphStyles}>
            Khám phá một số dịch vụ chăm sóc da được yêu thích nhất tại
            Beautishop.
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
            {loadingServices ? (
              <p style={{ ...paragraphStyles, color: "#ffffff" }}>
                Đang tải dịch vụ...
              </p>
            ) : services.length === 0 ? (
              <p style={{ ...paragraphStyles, color: "#ffffff" }}>
                Không có dịch vụ nào để hiển thị.
              </p>
            ) : (
              services.map((service, index) => (
                <Link
                  key={service.serviceId}
                  to={`/service/${service.serviceId}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: false }}
                    style={serviceCardStyles}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = darkMode
                        ? "0 8px 24px rgba(0, 0, 0, 0.5)"
                        : "0 8px 24px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = darkMode
                        ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                        : "0 4px 12px rgba(0, 0, 0, 0.06)";
                    }}
                  >
                    <img
                      src={
                        service.image || "https://via.placeholder.com/300x200"
                      }
                      alt={service.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: darkMode ? "#ffffff" : "#1d1d1f",
                        marginBottom: "10px",
                      }}
                    >
                      {service.name}
                    </h3>
                    <p
                      style={{
                        ...paragraphStyles,
                        margin: 0,
                        color: darkMode ? "#bdc3c7" : "#555",
                      }}
                    >
                      ${service.price || "N/A"}
                    </p>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            style={{ marginTop: "40px" }}
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
              Xem Tất Cả Dịch Vụ
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Facility Section */}
      <section
        style={{
          ...sectionStyles,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517649763962-0c623066013b')",
        }}
      >
        <div style={overlayStyles}></div>
        <div style={contentStyles}>
          <h2 style={headingStyles}>Cơ Sở Vật Chất</h2>
          <p style={paragraphStyles}>
            Beautishop tự hào sở hữu cơ sở vật chất hiện đại, mang đến trải
            nghiệm thư giãn và thoải mái tối ưu cho khách hàng.
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
                title: "Phòng Trị Liệu Cao Cấp",
                desc: "Không gian yên tĩnh với thiết bị công nghệ cao.",
                image:
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
              },
              {
                title: "Khu Vực Tư Vấn",
                desc: "Thiết kế thân thiện, hỗ trợ phân tích da chuyên sâu.",
                image:
                  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881",
              },
              {
                title: "Sảnh Đón Tiếp",
                desc: "Không gian sang trọng, ấm cúng chào đón bạn.",
                image:
                  "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c",
              },
            ].map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: false }}
                style={facilityCardStyles}
              >
                <img
                  src={facility.image}
                  alt={facility.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "15px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: darkMode ? "#ffffff" : "#1d1d1f",
                    marginBottom: "10px",
                  }}
                >
                  {facility.title}
                </h3>
                <p
                  style={{
                    ...paragraphStyles,
                    margin: 0,
                    color: darkMode ? "#bdc3c7" : "#555",
                  }}
                >
                  {facility.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        style={{
          ...sectionStyles,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
        }}
      >
        <div style={overlayStyles}></div>
        <div style={contentStyles}>
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
                  backgroundColor: darkMode
                    ? "rgba(44, 44, 46, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
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
                <p
                  style={{
                    ...paragraphStyles,
                    margin: 0,
                    color: darkMode ? "#bdc3c7" : "#555",
                  }}
                >
                  {reason.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        style={{
          ...sectionStyles,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512290923902-8a9f81dc236c')",
        }}
      >
        <div style={overlayStyles}></div>
        <div style={contentStyles}>
          <h2 style={headingStyles}>Khách Hàng Nói Gì?</h2>
          <p style={paragraphStyles}>
            Nghe từ chính những khách hàng đã trải nghiệm dịch vụ tại
            Beautishop.
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
                rating: 5,
                image:
                  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
              },
              {
                name: "Trần Văn Hùng",
                quote:
                  "Sản phẩm rất an toàn và hiệu quả. Tôi hoàn toàn tin tưởng Beautishop.",
                rating: 5,
                image:
                  "https://images.unsplash.com/photo-1506794778202-cadffbf6435e",
              },
              {
                name: "Lê Minh Anh",
                quote:
                  "Đội ngũ chuyên gia rất nhiệt tình, tư vấn chi tiết và tận tâm.",
                rating: 5,
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
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
                  backgroundColor: darkMode
                    ? "rgba(44, 44, 46, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
                  borderRadius: "12px",
                  boxShadow: darkMode
                    ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                    : "0 4px 12px rgba(0, 0, 0, 0.06)",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: "16px",
                      fontStyle: "italic",
                      color: darkMode ? "#bdc3c7" : "#555",
                      marginBottom: "10px",
                    }}
                  >
                    "{testimonial.quote}"
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: darkMode ? "#ffffff" : "#1d1d1f",
                      marginBottom: "5px",
                    }}
                  >
                    {testimonial.name}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      color: "#f1c40f",
                    }}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        style={{
          ...sectionStyles,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881')",
        }}
      >
        <div style={overlayStyles}></div>
        <div style={contentStyles}>
          <h2 style={headingStyles}>Bắt Đầu Hành Trình Làm Đẹp</h2>
          <p
            style={{
              ...paragraphStyles,
              fontSize: "20px",
              marginBottom: "40px",
            }}
          >
            Đặt lịch ngay hôm nay để trải nghiệm dịch vụ chăm sóc da đẳng cấp
            tại Beautishop.
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
              Đặt Lịch Ngay
            </Link>
          </motion.div>
        </div>
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
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;