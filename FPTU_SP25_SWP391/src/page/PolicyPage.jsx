import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PolicyPage({ darkMode }) {
  const containerStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    minHeight: "100vh", // Minimum height to allow content to grow
    overflowY: "auto",
    overflowX: "hidden",
    scrollBehavior: "smooth",
    backgroundColor: darkMode ? "#1c2526" : "#fafafa",
    padding: "40px 20px", // Increased padding for a spacious feel
  };

  const sectionStyles = {
    width: "100%",
    maxWidth: "900px", // Wider content area
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "40px 0", // Increased vertical padding
  };

  const headingStyles = {
    fontSize: "48px", // Larger heading
    fontWeight: "700",
    color: darkMode ? "#ffffff" : "#1d1d1f",
    letterSpacing: "-1px",
    marginBottom: "30px",
    lineHeight: "1.2",
  };

  const subheadingStyles = {
    fontSize: "24px",
    fontWeight: "600",
    color: darkMode ? "#e5e7eb" : "#333",
    margin: "20px 0 15px",
  };

  const paragraphStyles = {
    fontSize: "18px",
    color: darkMode ? "#a1a1a6" : "#6e6e73",
    lineHeight: "1.8", // Increased line height for readability
    maxWidth: "800px",
    marginBottom: "30px", // More spacing
    textAlign: "left",
  };

  const policyItemStyles = {
    backgroundColor: darkMode ? "#2c2c2e" : "#ffffff",
    padding: "25px", // Increased padding
    borderRadius: "16px",
    boxShadow: darkMode
      ? "0 6px 18px rgba(0, 0, 0, 0.4)"
      : "0 6px 18px rgba(0, 0, 0, 0.08)",
    width: "100%",
    maxWidth: "800px", // Wider items
    textAlign: "left",
    marginBottom: "40px", // Increased spacing between items
    border: darkMode ? "1px solid #38383a" : "1px solid #f0f0f0",
  };

  const buttonStyles = {
    display: "inline-block",
    padding: "16px 40px", // Larger button
    backgroundColor: darkMode ? "#34c759" : "#e67e22",
    color: "#ffffff",
    fontSize: "20px", // Larger font
    fontWeight: "600",
    borderRadius: "12px",
    textDecoration: "none",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    marginTop: "40px", // More space above button
  };

  return (
    <div style={containerStyles}>
      <motion.section
        id="policy"
        style={sectionStyles}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.2 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: false }}
          style={headingStyles}
        >
          Chính Sách Công Ty SkinCare Pro
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: false }}
          style={paragraphStyles}
        >
          Tại SkinCare Pro, chúng tôi cam kết mang đến cho khách hàng những dịch
          vụ và sản phẩm chăm sóc da chất lượng cao nhất, đồng thời đảm bảo
          quyền lợi tối đa trong mọi giao dịch và trải nghiệm. Dưới đây là các
          chính sách chi tiết được xây dựng dựa trên sự minh bạch, công bằng và
          sự hài lòng của bạn.
        </motion.p>

        <div style={{ width: "100%" }}>
          {[
            {
              title: "Chính Sách Đổi Trả Sản Phẩm",
              content:
                "Khách hàng có quyền đổi trả sản phẩm trong vòng 7 ngày kể từ ngày mua hàng, với điều kiện sản phẩm phải còn nguyên vẹn, chưa qua sử dụng và kèm theo hóa đơn mua hàng hợp lệ. Chi phí vận chuyển đổi trả sẽ do khách hàng chịu trách nhiệm, trừ trường hợp sản phẩm bị lỗi do nhà sản xuất hoặc SkinCare Pro. Trong trường hợp lỗi từ phía chúng tôi, chúng tôi sẽ cung cấp dịch vụ đổi trả miễn phí và hỗ trợ tối đa để đảm bảo sự hài lòng của bạn.",
            },
            {
              title: "Chính Sách Bảo Hành Dịch Vụ",
              content:
                "Tất cả các liệu trình chăm sóc da tại SkinCare Pro đều được bảo hành trong vòng 30 ngày kể từ ngày thực hiện dịch vụ. Nếu trong thời gian này, khách hàng gặp phải bất kỳ vấn đề nào liên quan đến lỗi kỹ thuật hoặc quy trình thực hiện, chúng tôi cam kết hỗ trợ miễn phí để khắc phục. Để đảm bảo quyền lợi, vui lòng liên hệ ngay với đội ngũ chăm sóc khách hàng của chúng tôi kèm theo thông tin đặt lịch hoặc hóa đơn dịch vụ.",
            },
            {
              title: "Chính Sách Bảo Mật Thông Tin",
              content:
                "Chúng tôi hiểu rằng quyền riêng tư của khách hàng là tối quan trọng. Mọi thông tin cá nhân được thu thập sẽ được bảo vệ nghiêm ngặt theo tiêu chuẩn GDPR (Quy định Bảo vệ Dữ liệu Chung của Liên minh Châu Âu). SkinCare Pro cam kết không chia sẻ, bán hoặc tiết lộ dữ liệu của bạn cho bất kỳ bên thứ ba nào mà không có sự đồng ý rõ ràng từ bạn, trừ khi có yêu cầu pháp lý từ cơ quan có thẩm quyền. Chúng tôi sử dụng công nghệ mã hóa tiên tiến để đảm bảo an toàn thông tin trong suốt quá trình lưu trữ và xử lý.",
            },
            {
              title: "Chính Sách Hỗ Trợ Khách Hàng",
              content:
                "Đội ngũ hỗ trợ khách hàng của SkinCare Pro hoạt động 24/7 nhằm mang đến sự hỗ trợ nhanh chóng và hiệu quả nhất cho bạn. Bạn có thể liên hệ với chúng tôi qua hotline, email, hoặc các kênh mạng xã hội chính thức. Mọi thắc mắc, khiếu nại hoặc yêu cầu hỗ trợ sẽ được xử lý trong vòng 48 giờ làm việc. Chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu và sẵn sàng lắng nghe mọi ý kiến đóng góp để cải thiện dịch vụ.",
            },
            {
              title: "Chính Sách Hoàn Tiền",
              content:
                "Trong trường hợp khách hàng không hài lòng với dịch vụ hoặc sản phẩm đã mua, SkinCare Pro cung cấp chính sách hoàn tiền linh hoạt. Yêu cầu hoàn tiền cần được gửi trong vòng 14 ngày kể từ ngày giao dịch, kèm theo lý do cụ thể và bằng chứng liên quan (hóa đơn, hình ảnh sản phẩm, v.v.). Sau khi xem xét, chúng tôi sẽ hoàn tiền đầy đủ hoặc một phần tùy theo tình trạng sản phẩm/dịch vụ, trong thời gian tối đa 7 ngày làm việc.",
            },
            {
              title: "Chính Sách Giao Hàng",
              content:
                "Chúng tôi cung cấp dịch vụ giao hàng toàn quốc với thời gian giao hàng dự kiến từ 2-5 ngày làm việc, tùy thuộc vào khu vực. Khách hàng sẽ được cung cấp mã theo dõi đơn hàng để tiện theo dõi. Trong trường hợp đơn hàng bị thất lạc hoặc hư hỏng trong quá trình vận chuyển, SkinCare Pro sẽ chịu trách nhiệm hoàn toàn và gửi lại sản phẩm thay thế miễn phí trong thời gian sớm nhất có thể.",
            },
          ].map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: false }}
              style={policyItemStyles}
            >
              <h3 style={subheadingStyles}>{policy.title}</h3>
              <p style={paragraphStyles}>{policy.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          <Link
            to="/about"
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
            Quay Lại Trang Giới Thiệu
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
