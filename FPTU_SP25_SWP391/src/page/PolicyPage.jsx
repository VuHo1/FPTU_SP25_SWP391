import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PolicyPage({ darkMode }) {
  const sectionStyles = {
    minHeight: "100vh", // Consistent with ProductListPage
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: darkMode ? "#1c2526" : "#fafafa",
    textAlign: "center",
    scrollSnapAlign: "start",
    padding: "20px 0",
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
        width: "100%",
        height: "100%",
        minHeight: "100vh", // Ensure it takes at least full viewport height
        overflowY: "auto",
        overflowX: "hidden",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        backgroundColor: darkMode ? "#1c2526" : "#fafafa",
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      }}
    >
      <motion.section
        id="policy"
        style={sectionStyles}
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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: false }}
            style={{
              ...headingStyles,
              fontSize: "48px", // Larger like the welcome section
              fontWeight: "700",
              color: darkMode ? "#e5e7eb" : "#1f2937",
            }}
          >
            Company Policy{" "}
            <span style={{ color: "#e67e22", fontWeight: "800" }}>
              SkinCare Pro
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: false }}
            style={paragraphStyles}
          >
            At SkinCare Pro, we are committed to providing our customers with the highest quality skincare products and services while ensuring maximum benefits in every transaction and experience. Below are detailed policies built on transparency, fairness, and your satisfaction.
          </motion.p>

          {/* Policy Items */}
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
                title: "Product Return Policy",
                content:
                  "Customers may return products within 7 days from the purchase date, provided the product remains unopened, unused, and accompanied by a valid purchase receipt. Return shipping costs will be borne by the customer, except in cases where the product is defective due to the manufacturer or SkinCare Pro.",
              },
              {
                title: "Service Warranty Policy",
                content:
                  "All skincare treatments at SkinCare Pro come with a 30-day warranty from the date of service. If any issues related to technical errors or the procedure arise within this period, we commit to providing free support to resolve them.",
              },
              {
                title: "Privacy Policy",
                content:
                  "We understand that customer privacy is paramount. All personal information collected will be strictly protected in accordance with GDPR standards.",
              },
              {
                title: "Customer Support Policy",
                content:
                  "The SkinCare Pro customer support team operates 24/7 to provide you with the fastest and most effective assistance. You can reach us via hotline, email, or our official social media channels.",
              },
              {
                title: "Refund Policy",
                content:
                  "If customers are dissatisfied with a purchased service or product, SkinCare Pro offers a flexible refund policy. Refund requests must be submitted within 14 days from the transaction date.",
              },
              {
                title: "Shipping Policy",
                content:
                  "We offer nationwide shipping with an estimated delivery time of 2-5 business days. In case of lost or damaged orders, SkinCare Pro will take full responsibility.",
              },
            ].map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.4,
                  ease: "easeOut",
                }}
                viewport={{ once: false }}
                whileHover={{ y: -8 }} // Hover effect like team cards
                style={{
                  backgroundColor: darkMode ? "#2c2c2e" : "#ffffff",
                  padding: "16px",
                  borderRadius: "20px",
                  textAlign: "center",
                  width: "300px", // Consistent with team cards
                  boxShadow: darkMode
                    ? "0 8px 24px rgba(0, 0, 0, 0.3)"
                    : "0 8px 24px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.3s ease",
                  border: darkMode ? "1px solid #38383a" : "1px solid #f5f5f5",
                }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: darkMode ? "#ffffff" : "#1d1d1f",
                    marginBottom: "12px",
                  }}
                >
                  {policy.title}
                </h3>
                <p
                  style={{
                    fontSize: "16px",
                    color: darkMode ? "#bdc3c7" : "#555",
                  }}
                >
                  {policy.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <Link
              to="/about"
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
              Back to About Page
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}