import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductListPage({ darkMode }) {
  return (
    <div style={{  position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflowY: "scroll",
      scrollSnapType: "y mandatory",
      scrollBehavior: "smooth",
      willChange: "transform",
      WebkitOverflowScrolling: "touch", }}>

       <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: darkMode ? "#34495e" : "#fff",
          textAlign: "center",
          scrollSnapAlign: "start",
        }}
      >
        <div style={{ width: "80%", display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src="/assets/company-office.jpg"
            alt="Văn phòng SkinCare Pro"
            style={{ width: "50%", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
          />
          <div>
            <h1 style={{ fontSize: "40px", color: darkMode ? "#ecf0f1" : "#333" }}>
              Chào mừng đến với <span style={{ color: "#e67e22" }}>SkinCare Pro</span>
            </h1>
            <p style={{ fontSize: "20px", color: darkMode ? "#bdc3c7" : "#555", lineHeight: "1.6" }}>
              Chúng tôi tiên phong trong lĩnh vực chăm sóc và tư vấn da chuyên sâu, mang đến giải pháp toàn diện cho làn da khỏe mạnh.
            </p>
          </div>
        </div>
      </motion.section>

      {/* 📌 Đội ngũ Chuyên gia */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: darkMode ? "#2c3e50" : "#f9f9f9",
          textAlign: "center",
          scrollSnapAlign: "start",
        }}
      >
        <h2 style={{ fontSize: "36px", color: darkMode ? "#ecf0f1" : "#333" }}>Đội Ngũ Chuyên Gia</h2>
        <p style={{ fontSize: "20px", color: darkMode ? "#bdc3c7" : "#555", lineHeight: "1.6" }}>
          Chúng tôi có hơn 10 năm kinh nghiệm trong ngành làm đẹp và chăm sóc da.
        </p>
        <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
          {[
            { name: "Dr. Nguyễn Minh", role: "Chuyên gia da liễu", img: "/assets/doctor1.jpg" },
            { name: "Dr. Lê Hoàng", role: "Chuyên gia trị liệu", img: "/assets/doctor2.jpg" },
          ].map((expert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              style={{
                backgroundColor: darkMode ? "#34495e" : "#fff",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                width: "250px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img src={expert.img} alt={expert.name} style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }} />
              <h3 style={{ fontSize: "24px", color: darkMode ? "#ecf0f1" : "#333" }}>{expert.name}</h3>
              <p style={{ fontSize: "18px", color: darkMode ? "#bdc3c7" : "#666" }}>{expert.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
      {/* 📌 Sứ mệnh và mục tiêu */}
      <motion.section
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.3 }}
         style={{
           height: "100vh",
           display: "flex",
           flexDirection: "column",
           alignItems: "center",
           justifyContent: "center",
           backgroundColor: darkMode ? "#2c3e50" : "#f9f9f9",
           textAlign: "center",
           scrollSnapAlign: "start",
        }}
      >
        <h2 style={{ fontSize: "28px", color: darkMode ? "#ecf0f1" : "#333" }}>
          Sứ Mệnh & Mục Tiêu
        </h2>
        <p style={{ fontSize: "18px", color: darkMode ? "#bdc3c7" : "#555", lineHeight: "1.6" }}>
          Chúng tôi mong muốn giúp mọi người tự tin hơn với làn da của mình thông qua các liệu trình
          cá nhân hóa và tư vấn chuyên sâu.
        </p>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginTop: "20px",
            textAlign: "left",
            display: "inline-block",
          }}
        >
          {[
            "Đưa công nghệ phân tích da tiên tiến đến khách hàng",
            "Tư vấn cá nhân hóa phù hợp với từng loại da",
            "Mang đến giải pháp bền vững, hiệu quả dài lâu",
          ].map((goal, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              style={{
                fontSize: "17px",
                color: darkMode ? "#bdc3c7" : "#444",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              ✅ {goal}
            </motion.li>
          ))}
        </ul>
      </motion.section>

    

      {/* 📌 Lịch sử phát triển */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: darkMode ? "#2c3e50" : "#f9f9f9",
          textAlign: "center",
          scrollSnapAlign: "start",
        }}
      >
        <h2 style={{ fontSize: "28px", color: darkMode ? "#ecf0f1" : "#333" }}>
          Lịch Sử Hình Thành & Phát Triển
        </h2>
        <p style={{ fontSize: "18px", color: darkMode ? "#bdc3c7" : "#555", lineHeight: "1.6" }}>
          Bắt đầu từ năm 2010, chúng tôi đã phát triển từ một trung tâm tư vấn nhỏ thành một hệ thống 
          chăm sóc da chuyên sâu với hơn 20 chuyên gia trên toàn quốc.
        </p>
      </motion.section>

      
      {/* 📌 Cam kết với khách hàng */}
      <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: darkMode ? "#2c3e50" : "#f9f9f9",
            textAlign: "center",
            scrollSnapAlign: "start",
        }}
      >
        <h2 style={{ fontSize: "28px", color: darkMode ? "#ecf0f1" : "#333" }}>
          Cam Kết Chất Lượng
        </h2>
        <p style={{ fontSize: "18px", color: darkMode ? "#bdc3c7" : "#555", lineHeight: "1.6" }}>
          Chúng tôi cam kết cung cấp dịch vụ tư vấn da cá nhân hóa, đảm bảo an toàn và hiệu quả cao nhất.
        </p>
      </motion.section>

      {/* 📌 Câu hỏi thường gặp */}
      <motion.section
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: 0.3 }}
         style={{
           height: "100vh",
           display: "flex",
           flexDirection: "column",
           alignItems: "center",
           justifyContent: "center",
           backgroundColor: darkMode ? "#2c3e50" : "#f9f9f9",
           textAlign: "center",
           scrollSnapAlign: "start",
        }}
      >
        <h2 style={{ fontSize: "28px", color: darkMode ? "#ecf0f1" : "#333" }}>
          Câu Hỏi Thường Gặp
        </h2>
        <p style={{ fontSize: "18px", color: darkMode ? "#bdc3c7" : "#555", lineHeight: "1.6" }}>
          Q: Tôi cần đặt lịch hẹn trước bao lâu? <br />
          A: Bạn có thể đặt lịch trước ít nhất 24 giờ để chúng tôi sắp xếp chuyên gia phù hợp.
        </p>
      </motion.section>

      {/* 📌 Link đến Chính sách công ty */}
      <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.3 }}
           style={{
             height: "100vh",
             display: "flex",
             flexDirection: "column",
             alignItems: "center",
             justifyContent: "center",
             backgroundColor: darkMode ? "#2c3e50" : "#f9f9f9",
             textAlign: "center",
             scrollSnapAlign: "start",
          }}
      >
        <Link
          to="/policy"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: darkMode ? "#1abc9c" : "#e67e22",
            color: "#fff",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            textDecoration: "none",
            transition: "background-color 0.3s",
          }}
        >
          Xem Chính Sách Công Ty
        </Link>
      </motion.div>
    </div>
  );
}


// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function ProductListPage({ darkMode }) {
//   return (
//     <div
//     style={{
//         scrollSnapType: "y proximity", // Giúp cuộn tự nhiên hơn, không bị giật
//         overflowY: "scroll",
//         height: "100vh",
//         maxWidth: "100vw", // ✅ Prevent content overflow
//         width: "100vw",
//         scrollBehavior: "smooth",
//         WebkitOverflowScrolling: "touch", // Hỗ trợ cuộn mượt trên iOS
     
//       }}
      
//     >
//       {[
//         {
//           title: "Chào mừng đến với SkinCare Pro",
//           content: "Chúng tôi tiên phong trong lĩnh vực chăm sóc và tư vấn da chuyên sâu.",
//           image: "/assets/company-office.jpg",
//         },
//         {
//           title: "Đội Ngũ Chuyên Gia",
//           content: "Hơn 10 năm kinh nghiệm trong ngành làm đẹp và chăm sóc da.",
//           experts: [
//             { name: "Dr. Nguyễn Minh", role: "Chuyên gia da liễu", img: "/assets/doctor1.jpg" },
//             { name: "Dr. Lê Hoàng", role: "Chuyên gia trị liệu", img: "/assets/doctor2.jpg" },
//           ],
//         },
//         {
//           title: "Sứ Mệnh & Mục Tiêu",
//           content: "Giúp mọi người tự tin hơn với làn da của mình thông qua tư vấn chuyên sâu.",
//           list: [
//             "Đưa công nghệ phân tích da tiên tiến đến khách hàng",
//             "Tư vấn cá nhân hóa phù hợp với từng loại da",
//             "Mang đến giải pháp bền vững, hiệu quả dài lâu",
//           ],
//         },
//         {
//           title: "Lịch Sử Hình Thành & Phát Triển",
//           content: "Bắt đầu từ năm 2010, chúng tôi phát triển thành một hệ thống chăm sóc da chuyên sâu.",
//         },
//         {
//           title: "Cam Kết Chất Lượng",
//           content: "Chúng tôi cam kết tư vấn da cá nhân hóa, đảm bảo an toàn và hiệu quả.",
//         },
//         {
//           title: "Câu Hỏi Thường Gặp",
//           content: "Q: Tôi cần đặt lịch hẹn trước bao lâu?\nA: Bạn có thể đặt lịch trước ít nhất 24 giờ.",
//         },
//       ].map((section, index) => (
//         <motion.section
//           key={index}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: index * 0.3 }}
//           style={{
//             width: "100vw", // ✅ Ensure full width
//             minHeight: "100vh", // ✅ Ensure full height   
//          boxSizing: "border-box", // ✅ Prevent padding issues


//             height: "100vh",
            
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             backgroundColor: darkMode ? (index % 2 === 0 ? "#34495e" : "#2c3e50") : (index % 2 === 0 ? "#fff" : "#f9f9f9"),
//             textAlign: "center",
//             scrollSnapAlign: "start",
//             padding: "40px",
//           }}
//         >
//           <h2 style={{ fontSize: "36px", color: darkMode ? "#ecf0f1" : "#333" }}>{section.title}</h2>
//           <p style={{ fontSize: "20px", color: darkMode ? "#bdc3c7" : "#555", lineHeight: "1.6", maxWidth: "800px" }}>
//             {section.content}
//           </p>

//           {/* Nếu có hình ảnh */}
//           {section.image && (
//             <img
//               src={section.image}
//               alt={section.title}
//               style={{ width: "60%", borderRadius: "12px", marginTop: "20px" }}
//             />
//           )}

//           {/* Nếu có danh sách mục tiêu */}
//           {section.list && (
//             <ul style={{ textAlign: "left", marginTop: "20px" }}>
//               {section.list.map((item, i) => (
//                 <motion.li
//                   key={i}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: i * 0.2 }}
//                   style={{ fontSize: "18px", color: darkMode ? "#bdc3c7" : "#444", marginBottom: "10px" }}
//                 >
//                   ✅ {item}
//                 </motion.li>
//               ))}
//             </ul>
//           )}

//           {/* Nếu có đội ngũ chuyên gia */}
//           {section.experts && (
//             <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
//               {section.experts.map((expert, i) => (
//                 <motion.div
//                   key={i}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: i * 0.2 }}
//                   style={{
//                     backgroundColor: darkMode ? "#34495e" : "#fff",
//                     padding: "20px",
//                     borderRadius: "12px",
//                     textAlign: "center",
//                     width: "250px",
//                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                   }}
//                 >
//                   <img src={expert.img} alt={expert.name} style={{ width: "100%", borderRadius: "8px", marginBottom: "10px" }} />
//                   <h3 style={{ fontSize: "24px", color: darkMode ? "#ecf0f1" : "#333" }}>{expert.name}</h3>
//                   <p style={{ fontSize: "18px", color: darkMode ? "#bdc3c7" : "#666" }}>{expert.role}</p>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </motion.section>
//       ))}

//       {/* 📌 Link đến Chính sách công ty */}
//       <motion.div
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         style={{
//           textAlign: "center",
//           height: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           backgroundColor: darkMode ? "#1abc9c" : "#e67e22",
//           scrollSnapAlign: "start",
//         }}
//       >
//         <Link
//           to="/policy"
//           style={{
//             display: "inline-block",
//             padding: "12px 24px",
//             backgroundColor: darkMode ? "#16a085" : "#d35400",
//             color: "#fff",
//             fontSize: "20px",
//             fontWeight: "bold",
//             borderRadius: "8px",
//             textDecoration: "none",
//             transition: "background-color 0.3s",
//           }}
//         >
//           Xem Chính Sách Công Ty
//         </Link>
//       </motion.div>
//     </div>
//   );
// }
