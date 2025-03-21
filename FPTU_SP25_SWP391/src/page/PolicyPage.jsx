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
            Chính Sách Công Ty{" "}
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
            Tại SkinCare Pro, chúng tôi cam kết mang đến cho khách hàng những dịch vụ và sản phẩm chăm sóc da chất lượng cao nhất, đồng thời đảm bảo quyền lợi tối đa trong mọi giao dịch và trải nghiệm. Dưới đây là các chính sách chi tiết được xây dựng dựa trên sự minh bạch, công bằng và sự hài lòng của bạn.
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
                title: "Chính Sách Đổi Trả Sản Phẩm",
                content:
                  "Khách hàng có quyền đổi trả sản phẩm trong vòng 7 ngày kể từ ngày mua hàng, với điều kiện sản phẩm phải còn nguyên vẹn, chưa qua sử dụng và kèm theo hóa đơn mua hàng hợp lệ. Chi phí vận chuyển đổi trả sẽ do khách hàng chịu trách nhiệm, trừ trường hợp sản phẩm bị lỗi do nhà sản xuất hoặc SkinCare Pro.",
              },
              {
                title: "Chính Sách Bảo Hành Dịch Vụ",
                content:
                  "Tất cả các liệu trình chăm sóc da tại SkinCare Pro đều được bảo hành trong vòng 30 ngày kể từ ngày thực hiện dịch vụ. Nếu trong thời gian này, khách hàng gặp phải bất kỳ vấn đề nào liên quan đến lỗi kỹ thuật hoặc quy trình thực hiện, chúng tôi cam kết hỗ trợ miễn phí để khắc phục.",
              },
              {
                title: "Chính Sách Bảo Mật Thông Tin",
                content:
                  "Chúng tôi hiểu rằng quyền riêng tư của khách hàng là tối quan trọng. Mọi thông tin cá nhân được thu thập sẽ được bảo vệ nghiêm ngặt theo tiêu chuẩn GDPR.",
              },
              {
                title: "Chính Sách Hỗ Trợ Khách Hàng",
                content:
                  "Đội ngũ hỗ trợ khách hàng của SkinCare Pro hoạt động 24/7 nhằm mang đến sự hỗ trợ nhanh chóng và hiệu quả nhất cho bạn. Bạn có thể liên hệ với chúng tôi qua hotline, email, hoặc các kênh mạng xã hội chính thức.",
              },
              {
                title: "Chính Sách Hoàn Tiền",
                content:
                  "Trong trường hợp khách hàng không hài lòng với dịch vụ hoặc sản phẩm đã mua, SkinCare Pro cung cấp chính sách hoàn tiền linh hoạt. Yêu cầu hoàn tiền cần được gửi trong vòng 14 ngày kể từ ngày giao dịch.",
              },
              {
                title: "Chính Sách Giao Hàng",
                content:
                  "Chúng tôi cung cấp dịch vụ giao hàng toàn quốc với thời gian giao hàng dự kiến từ 2-5 ngày làm việc. Trong trường hợp đơn hàng bị thất lạc hoặc hư hỏng, SkinCare Pro sẽ chịu trách nhiệm hoàn toàn.",
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
              Quay Lại Trang Giới Thiệu
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}