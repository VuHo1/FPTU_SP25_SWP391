import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductListPage({ darkMode }) {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    "welcome",
    "team",
    "mission",
    "history",
    "commitment",
    "faq",
    "policy",
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      const sectionElements = sections.map((id) => document.getElementById(id));
      const currentSectionIndex = sectionElements.findIndex((el, index) => {
        if (!el) return false;
        const nextEl = sectionElements[index + 1];
        const elTop = el.offsetTop;
        const elBottom = nextEl ? nextEl.offsetTop : elTop + el.offsetHeight;
        return scrollPosition >= elTop && scrollPosition < elBottom;
      });
      const newIndex = currentSectionIndex === -1 ? 0 : currentSectionIndex;
      setActiveSection(newIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const sectionStyles = {
    minHeight: "100vh", // Changed to minHeight to allow growth
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: darkMode ? "#1c2526" : "#fafafa",
    textAlign: "center",
    scrollSnapAlign: "start",
    padding: "20px 0", // Adjusted padding
    boxSizing: "border-box",
  };

  const headingStyles = {
    fontSize: "40px",
    fontWeight: "600",
    color: darkMode ? "#ffffff" : "#1d1d1f",
    letterSpacing: "-0.5px",
    marginBottom: "20px",
  };

  const paragraphStyles = {
    fontSize: "18px",
    color: darkMode ? "#a1a1a6" : "#6e6e73",
    lineHeight: "1.6",
    maxWidth: "700px",
    marginBottom: "20px",
  };

  return (
    <div
      style={{
        width: "100%", // Removed position: absolute
        height: "100%",
        minHeight: "200vh", // Ensure it takes at least full viewport height
        overflowY: "auto", // Changed to auto for natural scrolling
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        backgroundColor: darkMode ? "#1c2526" : "#fafafa",
        boxSizing: "border-box", // Ensure padding/borders are included in size
        margin: 0, // Remove any default margins
        padding: 0, // Remove any default padding
      }}
    >
      {/* Welcome Section */}
      <motion.section
        id="welcome"
        style={{
          ...sectionStyles,
          backgroundColor: darkMode ? "#1a2a3d" : "#f9fafb",
        }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <motion.img
            src="/assets/company-office.jpg"
            alt="Văn phòng SkinCare Pro"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
            style={{
              width: "50%",
              minWidth: "300px",
              height: "auto",
              maxHeight: "80vh",
              borderRadius: "16px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <div
            style={{
              width: "45%",
              minWidth: "300px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: false }}
              style={{
                ...headingStyles,
                fontSize: "48px",
                fontWeight: "700",
                color: darkMode ? "#e5e7eb" : "#1f2937",
              }}
            >
              Chào mừng đến với{" "}
              <span style={{ color: "#e67e22", fontWeight: "800" }}>
                SkinCare Pro
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: false }}
              style={paragraphStyles}
            >
              Chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực chăm sóc và
              tư vấn da chuyên sâu, mang đến những giải pháp toàn diện, khoa học
              và cá nhân hóa cho từng loại da. Với đội ngũ chuyên gia giàu kinh
              nghiệm và sự kết hợp giữa công nghệ hiện đại cùng các phương pháp
              chăm sóc tiên tiến, chúng tôi cam kết giúp khách hàng đạt được làn
              da khỏe mạnh, rạng rỡ từ bên trong.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: false }}
              style={paragraphStyles}
            >
              Tại SkinCare Pro, chúng tôi không chỉ tập trung vào vẻ đẹp bên
              ngoài mà còn chú trọng nuôi dưỡng làn da từ sâu bên trong, giúp
              bạn tự tin tỏa sáng trong mọi hoàn cảnh. Khám phá các dịch vụ độc
              quyền và sản phẩm chăm sóc da đẳng cấp được thiết kế riêng cho
              bạn.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              viewport={{ once: false }}
            >
              <Link
                to="/contact"
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  backgroundColor: darkMode ? "#34c759" : "#e67e22",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: "600",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "background-color 0.3s ease",
                }}
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
                Khám Phá Dịch Vụ
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        id="team"
        style={sectionStyles}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
            style={headingStyles}
          >
            Đội Ngũ Chuyên Gia
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Đội ngũ của chúng tôi không chỉ có hơn 10 năm kinh nghiệm trong
            ngành làm đẹp và chăm sóc da, mà còn là những người tiên phong trong
            việc nghiên cứu và ứng dụng các công nghệ chăm sóc da mới nhất.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Mỗi chuyên gia tại SkinCare Pro đều được đào tạo bài bản tại các học
            viện danh tiếng trong và ngoài nước, đảm bảo mang đến cho bạn những
            trải nghiệm chuyên nghiệp và hiệu quả nhất.
          </motion.p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
              padding: "0 20px",
              boxSizing: "border-box",
            }}
          >
            {[
              {
                name: "Dr. Nguyễn Minh",
                role: "Chuyên gia da liễu",
                img: "/assets/doctor1.jpg",
                bio: "Chuyên gia với hơn 15 năm kinh nghiệm trong điều trị các vấn đề da liễu.",
              },
              {
                name: "Dr. Lê Hoàng",
                role: "Chuyên gia trị liệu",
                img: "/assets/doctor2.jpg",
                bio: "Chuyên về liệu pháp tái tạo da không xâm lấn.",
              },
              {
                name: "ThS. Trần Mai",
                role: "Chuyên gia nghiên cứu",
                img: "/assets/doctor3.jpg",
                bio: "Đóng góp vào việc phát triển sản phẩm chăm sóc da tự nhiên.",
              },
            ].map((expert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.5,
                  ease: "easeOut",
                }}
                viewport={{ once: false }}
                whileHover={{ y: -8 }}
                style={{
                  backgroundColor: darkMode ? "#2c2c2e" : "#ffffff",
                  padding: "16px",
                  borderRadius: "20px",
                  textAlign: "center",
                  width: "280px",
                  boxShadow: darkMode
                    ? "0 8px 24px rgba(0, 0, 0, 0.3)"
                    : "0 8px 24px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.3s ease",
                  border: darkMode ? "1px solid #38383a" : "1px solid #f5f5f5",
                }}
              >
                <img
                  src={expert.img}
                  alt={expert.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "12px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: darkMode ? "#ffffff" : "#1d1d1f",
                    marginBottom: "8px",
                  }}
                >
                  {expert.name}
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: darkMode ? "#a1a1a6" : "#6e6e73",
                    fontWeight: "400",
                  }}
                >
                  {expert.role}
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: darkMode ? "#bdc3c7" : "#888",
                    marginTop: "8px",
                  }}
                >
                  {expert.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission & Goals */}
      <motion.section
        id="mission"
        style={sectionStyles}
        initial={{ opacity: 0, rotateX: 20 }}
        whileInView={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
            style={headingStyles}
          >
            Sứ Mệnh & Mục Tiêu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Sứ mệnh của chúng tôi là mang lại làn da khỏe đẹp và sự tự tin cho
            mọi người thông qua các liệu trình cá nhân hóa và tư vấn chuyên sâu.
            Chúng tôi hướng đến một cộng đồng yêu thương bản thân và hiểu biết
            về chăm sóc da.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Với tầm nhìn trở thành thương hiệu chăm sóc da hàng đầu khu vực,
            SkinCare Pro không ngừng đổi mới để đáp ứng nhu cầu ngày càng cao
            của khách hàng.
          </motion.p>
          <ul
            style={{
              listStyle: "none",
              padding: "0 20px",
              marginTop: "20px",
              textAlign: "left",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {[
              {
                text: "Đưa công nghệ phân tích da tiên tiến đến khách hàng",
                detail: "Ứng dụng AI để phân tích và đề xuất giải pháp tối ưu.",
              },
              {
                text: "Tư vấn cá nhân hóa phù hợp với từng loại da",
                detail: "Mỗi khách hàng đều nhận được lộ trình riêng biệt.",
              },
              {
                text: "Mang đến giải pháp bền vững, hiệu quả dài lâu",
                detail: "Hỗ trợ lâu dài với sản phẩm thân thiện môi trường.",
              },
            ].map((goal, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.5,
                  ease: "easeOut",
                }}
                viewport={{ once: false }}
                style={{
                  fontSize: "18px",
                  color: darkMode ? "#bdc3c7" : "#444",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <span style={{ color: darkMode ? "#34c759" : "#2ecc71" }}>
                  ✔
                </span>
                <div>
                  {goal.text}
                  <p
                    style={{
                      fontSize: "14px",
                      color: darkMode ? "#a1a1a6" : "#888",
                    }}
                  >
                    {goal.detail}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* History */}
      <motion.section
        id="history"
        style={sectionStyles}
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
            style={headingStyles}
          >
            Lịch Sử Hình Thành & Phát Triển
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            SkinCare Pro ra đời vào năm 2010 từ niềm đam mê mang lại làn da khỏe
            đẹp cho mọi người. Từ một trung tâm nhỏ tại TP.HCM, chúng tôi đã mở
            rộng thành hệ thống hơn 20 chi nhánh trên toàn quốc, phục vụ hàng
            ngàn khách hàng mỗi năm.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Hành trình của chúng tôi gắn liền với những bước tiến công nghệ và
            sự tin tưởng từ khách hàng, từ việc áp dụng các liệu pháp truyền
            thống đến tích hợp trí tuệ nhân tạo trong chăm sóc da hiện đại.
          </motion.p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
              padding: "0 20px",
              boxSizing: "border-box",
            }}
          >
            {[
              {
                year: "2010",
                milestone: "Thành lập trung tâm đầu tiên tại TP.HCM.",
              },
              {
                year: "2015",
                milestone: "Mở rộng ra 10 chi nhánh tại các thành phố lớn.",
              },
              {
                year: "2020",
                milestone: "Ra mắt ứng dụng chăm sóc da bằng AI.",
              },
              {
                year: "2023",
                milestone: "Đạt mốc 50,000 khách hàng hài lòng.",
              },
            ].map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.5,
                  ease: "easeOut",
                }}
                viewport={{ once: false }}
                style={{
                  width: "220px",
                  padding: "16px",
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
                    marginBottom: "8px",
                  }}
                >
                  {event.year}
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: darkMode ? "#bdc3c7" : "#555",
                  }}
                >
                  {event.milestone}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Commitment */}
      <motion.section
        id="commitment"
        style={sectionStyles}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
            style={headingStyles}
          >
            Cam Kết Chất Lượng
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Chúng tôi cam kết mang đến dịch vụ tư vấn da cá nhân hóa với tiêu
            chuẩn cao nhất, đảm bảo an toàn, hiệu quả và sự hài lòng của khách
            hàng trong từng trải nghiệm.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            SkinCare Pro luôn đặt sức khỏe làn da của bạn lên hàng đầu, sử dụng
            các sản phẩm được kiểm nghiệm nghiêm ngặt và đội ngũ chuyên gia tận
            tâm phục vụ 24/7.
          </motion.p>
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
              padding: "0 20px",
              boxSizing: "border-box",
            }}
          >
            {[
              {
                title: "An Toàn",
                desc: "Sử dụng sản phẩm không chứa hóa chất độc hại, được chứng nhận quốc tế.",
              },
              {
                title: "Hiệu Quả",
                desc: "Cam kết mang lại kết quả rõ rệt trong thời gian ngắn nhất.",
              },
              {
                title: "Tận Tâm",
                desc: "Hỗ trợ khách hàng mọi lúc, mọi nơi với sự nhiệt tình và chuyên nghiệp.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.5,
                  ease: "easeOut",
                }}
                viewport={{ once: false }}
                style={{
                  width: "300px",
                  padding: "16px",
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
                    color: darkMode ? "#ffffff" : "#1d1d1f",
                    marginBottom: "10px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: darkMode ? "#bdc3c7" : "#555",
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        id="faq"
        style={sectionStyles}
        initial={{ opacity: 0, rotateY: 20 }}
        whileInView={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
            style={headingStyles}
          >
            Câu Hỏi Thường Gặp
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Dưới đây là những thắc mắc phổ biến từ khách hàng của chúng tôi,
            cùng với câu trả lời chi tiết để bạn hiểu rõ hơn về dịch vụ SkinCare
            Pro.
          </motion.p>
          <div
            style={{
              width: "100%",
              textAlign: "left",
              padding: "0 20px",
              boxSizing: "border-box",
            }}
          >
            {[
              {
                q: "Tôi cần đặt lịch hẹn trước bao lâu?",
                a: "Bạn có thể đặt lịch trước ít nhất 24 giờ để chúng tôi sắp xếp chuyên gia phù hợp. Trong trường hợp khẩn cấp, vui lòng liên hệ hotline để được hỗ trợ ngay.",
              },
              {
                q: "Dịch vụ có dành cho da nhạy cảm không?",
                a: "Chắc chắn rồi! Chúng tôi có các liệu trình đặc biệt dành riêng cho da nhạy cảm, sử dụng sản phẩm dịu nhẹ và không gây kích ứng.",
              },
              {
                q: "Tôi có thể thanh toán bằng cách nào?",
                a: "Chúng tôi chấp nhận thanh toán bằng tiền mặt, thẻ ngân hàng, và các nền tảng thanh toán trực tuyến như MoMo, ZaloPay.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.4,
                  ease: "easeOut",
                }}
                viewport={{ once: false }}
                style={{ marginBottom: "16px" }}
              >
                <p style={{ ...paragraphStyles, marginBottom: "8px" }}>
                  <strong>Q:</strong> {faq.q}
                </p>
                <p style={paragraphStyles}>
                  <strong>A:</strong> {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Nếu bạn có thêm câu hỏi, đừng ngần ngại liên hệ với chúng tôi qua
            email hoặc hotline!
          </motion.p>
        </div>
      </motion.section>

      {/* Policy Link */}
      <motion.section
        id="policy"
        style={sectionStyles}
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
            style={headingStyles}
          >
            Chính Sách Công Ty
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Chúng tôi cam kết minh bạch trong mọi hoạt động, từ quy trình dịch
            vụ đến chính sách bảo hành và hỗ trợ khách hàng. Tìm hiểu thêm về
            các điều khoản và quyền lợi của bạn tại SkinCare Pro.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Chính sách của chúng tôi bao gồm đổi trả sản phẩm trong 7 ngày, hỗ
            trợ kỹ thuật miễn phí trong 30 ngày sau liệu trình, và bảo vệ thông
            tin cá nhân theo tiêu chuẩn GDPR.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <Link
              to="/policy"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                backgroundColor: darkMode ? "#34c759" : "#e67e22",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "600",
                borderRadius: "12px",
                textDecoration: "none",
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
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
              Xem Chính Sách Công Ty
            </Link>
          </motion.div>
          <div
            style={{
              marginTop: "20px",
              width: "100%",
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "0 20px",
              boxSizing: "border-box",
            }}
          >
            {[
              "Chính sách bảo hành dịch vụ",
              "Quy định đổi trả sản phẩm",
              "Cam kết bảo mật thông tin",
            ].map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.6,
                  ease: "easeOut",
                }}
                viewport={{ once: false }}
                style={{
                  padding: "12px 20px",
                  backgroundColor: darkMode ? "#2c2c2e" : "#ffffff",
                  borderRadius: "8px",
                  boxShadow: darkMode
                    ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                    : "0 4px 12px rgba(0, 0, 0, 0.06)",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    color: darkMode ? "#bdc3c7" : "#555",
                  }}
                >
                  {policy}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
