import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/PolicyPage.css"; // Import the CSS file

export default function PolicyPage({ darkMode }) {
  return (
    <div className={`container ${darkMode ? "dark" : "light"}`}>
      <motion.section
        id="policy"
        className="section"
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
          className="heading"
        >
          Chính Sách Công Ty SkinCare Pro
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: false }}
          className="paragraph"
        >
          Tại SkinCare Pro, chúng tôi cam kết mang đến cho khách hàng những dịch
          vụ và sản phẩm chăm sóc da chất lượng cao nhất, đồng thời đảm bảo
          quyền lợi tối đa trong mọi giao dịch và trải nghiệm. Dưới đây là các
          chính sách chi tiết được xây dựng dựa trên sự minh bạch, công bằng và
          sự hài lòng của bạn.
        </motion.p>

        <div className="policy-container">
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2, ease: "easeOut" }}
              viewport={{ once: false }}
              className="policy-item"
            >
              <h3 className="subheading">{policy.title}</h3>
              <p className="paragraph">{policy.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          <Link to="/about" className="button">
            Quay Lại Trang Giới Thiệu
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
