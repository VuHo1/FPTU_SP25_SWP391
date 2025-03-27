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
            src="https://maisoninterior.vn/wp-content/uploads/2025/02/mau-van-phong-lam-viec-dep-02.jpg"
            alt="SkinCare Pro Office"
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
              Welcome to{" "}
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
              We pride ourselves on being a pioneer in the field of advanced skincare and consultation, offering comprehensive, scientific, and personalized solutions for every skin type. With a team of experienced experts and a blend of modern technology and cutting-edge skincare methods, we are committed to helping our customers achieve healthy, radiant skin from within.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: false }}
              style={paragraphStyles}
            >
              At SkinCare Pro, we don’t just focus on outer beauty but also emphasize nurturing your skin from the inside out, helping you shine confidently in every situation. Explore our exclusive services and premium skincare products designed just for you.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              viewport={{ once: false }}
            >
              <Link
                to="/service"
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
                Explore Services
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
            Our Expert Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Our team not only brings over 10 years of experience in the beauty and skincare industry but also leads the way in researching and applying the latest skincare technologies.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Every expert at SkinCare Pro is thoroughly trained at prestigious institutes both domestically and internationally, ensuring you receive the most professional and effective experience.
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
                name: "Dr. Minh Nguyen",
                role: "Dermatologist",
                img: "https://bizweb.dktcdn.net/100/175/849/files/z4277782048544-ed8d504b298a553f544c17838ff9f090.jpg?v=1681895249035",
                bio: "An expert with over 15 years of experience in treating dermatological issues.",
              },
              {
                name: "Dr. Hoang Le",
                role: "Therapy Specialist",
                img: "https://bizweb.dktcdn.net/100/175/849/files/bacsidsc-7090k.jpg?v=1647837404831",
                bio: "Specializes in non-invasive skin regeneration therapies.",
              },
              {
                name: "MSc. Mai Tran",
                role: "Research Specialist",
                img: "https://hthaostudio.com/wp-content/uploads/2022/08/Anh-profile-bac-si-min.jpg",
                bio: "Contributes to the development of natural skincare products.",
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
            Mission & Goals
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Our mission is to bring healthy, beautiful skin and confidence to everyone through personalized treatments and in-depth consultations. We aim to foster a community that loves and understands skincare.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            With a vision to become the leading skincare brand in the region, SkinCare Pro continuously innovates to meet the growing demands of our customers.
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
                text: "Bring advanced skin analysis technology to customers",
                detail: "Using AI to analyze and recommend optimal solutions.",
              },
              {
                text: "Provide personalized consultations for every skin type",
                detail: "Each customer receives a tailored treatment plan.",
              },
              {
                text: "Offer sustainable, long-lasting solutions",
                detail: "Long-term support with eco-friendly products.",
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
            History & Development
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            SkinCare Pro was founded in 2010 with a passion for bringing healthy, beautiful skin to everyone. Starting as a small center in Ho Chi Minh City, we have expanded into a network of over 20 branches nationwide, serving thousands of customers each year.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Our journey is tied to technological advancements and the trust of our customers, evolving from traditional therapies to integrating artificial intelligence into modern skincare.
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
                milestone: "Established the first center in Ho Chi Minh City.",
              },
              {
                year: "2015",
                milestone: "Expanded to 10 branches in major cities.",
              },
              {
                year: "2020",
                milestone: "Launched an AI-powered skincare app.",
              },
              {
                year: "2023",
                milestone: "Reached a milestone of 50,000 satisfied customers.",
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
            Quality Commitment
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            We are committed to providing personalized skincare consultations with the highest standards, ensuring safety, effectiveness, and customer satisfaction in every experience.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            SkinCare Pro always prioritizes your skin’s health, using rigorously tested products and a dedicated team of experts available 24/7.
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
                title: "Safety",
                desc: "Using products free of harmful chemicals, internationally certified.",
              },
              {
                title: "Effectiveness",
                desc: "Committed to delivering noticeable results in the shortest time.",
              },
              {
                title: "Dedication",
                desc: "Supporting customers anytime, anywhere with enthusiasm and professionalism.",
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
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Below are common questions from our customers, along with detailed answers to help you better understand SkinCare Pro’s services.
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
                q: "How far in advance do I need to book an appointment?",
                a: "You can book at least 24 hours in advance to ensure we arrange the right expert for you. For urgent cases, please contact our hotline for immediate assistance.",
              },
              {
                q: "Are the services suitable for sensitive skin?",
                a: "Absolutely! We offer specialized treatments for sensitive skin, using gentle, non-irritating products.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept cash, bank cards, and online payment platforms like MoMo and ZaloPay.",
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
            If you have more questions, feel free to contact us via email or hotline!
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
            Company Policy
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            We are committed to transparency in all our operations, from service processes to warranty and customer support policies. Learn more about your rights and benefits at SkinCare Pro.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            Our policies include product returns within 7 days, free technical support for 30 days post-treatment, and personal data protection in line with GDPR standards.
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
              View Company Policy
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
              "Service warranty policy",
              "Product return regulations",
              "Privacy commitment",
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