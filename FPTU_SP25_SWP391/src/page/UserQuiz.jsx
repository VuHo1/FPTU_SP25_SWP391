import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

// Container chính với layout chia đôi
const QuizContainer = styled(Box)(({ darkMode }) => ({
    display: "flex",
    minHeight: "75vh",
    background: darkMode ? "#34495e" : "#f5f5f5",
    padding: "20px",
    gap: "20px",
}));

// Bên trái (70%)
const LeftPanel = styled(Box)(({ darkMode }) => ({
    flex: "0 0 70%",
    padding: "20px",
    background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
    borderRadius: "12px",
    boxShadow: darkMode
        ? "0 8px 24px rgba(0, 0, 0, 0.5)"
        : "0 8px 24px rgba(0, 0, 0, 0.15)",
    border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
    color: darkMode ? "#ecf0f1" : "#2c3e50",
    position: "relative",
    minHeight: "400px",
}));

// Bên phải (30%)
const RightPanel = styled(Box)(({ darkMode }) => ({
    flex: "0 0 30%",
    padding: "20px",
    background: darkMode ? "rgba(69, 90, 100, 0.9)" : "rgba(248, 244, 225, 0.9)",
    borderRadius: "12px",
    boxShadow: darkMode
        ? "0 8px 24px rgba(0, 0, 0, 0.5)"
        : "0 8px 24px rgba(0, 0, 0, 0.15)",
    border: darkMode ? "1px solid #5a758c" : "1px solid #ccc",
    color: darkMode ? "#ecf0f1" : "#2c3e50",
}));

// Card dịch vụ
const ServiceCard = styled(Box)(({ darkMode }) => ({
    padding: "15px",
    marginBottom: "15px",
    background: darkMode ? "rgba(52, 73, 94, 0.9)" : "rgba(255, 255, 255, 0.9)",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.2s, background 0.2s",
    "&:hover": {
        transform: "scale(1.03)",
        background: darkMode ? "rgba(52, 73, 94, 1)" : "rgba(255, 255, 255, 1)",
    },
}));

// Nút Next/Finish cố định
const FixedNextButton = styled(Button)(({ darkMode }) => ({
    position: "absolute",
    bottom: "20px",
    right: "20px",
    backgroundColor: darkMode ? "#1abc9c" : "#6c4f37",
    "&:hover": { backgroundColor: darkMode ? "#16a085" : "#5a4030" },
    padding: "10px 20px",
    borderRadius: "8px",
}));

// Nút Reset cố định
const FixedResetButton = styled(Button)(({ darkMode }) => ({
    position: "absolute",
    bottom: "20px",
    left: "20px",
    backgroundColor: darkMode ? "#e74c3c" : "#c0392b",
    "&:hover": { backgroundColor: darkMode ? "#c0392b" : "#a93226" },
    padding: "10px 20px",
    borderRadius: "8px",
}));

const UserQuiz = ({ darkMode }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");
    const userId = 5; // Thay bằng giá trị thực từ hệ thống đăng nhập
    const axiosInstance = axios.create({
        baseURL: "https://kinaa1410-001-site1.qtempurl.com/api",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
    });

    // Lấy danh sách danh mục dịch vụ
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get("/ServiceCategory");
                setCategories(response.data.filter((cat) => cat.status && cat.exist));
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    // Lấy câu hỏi theo danh mục
    const fetchQuestions = async (categoryId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/Qa/servicecategory/${categoryId}`);
            setQuestions(response.data);
            setAnswers({});
            setCurrentQuestionIndex(0);
            setResults(null);
        } catch (err) {
            console.error("Error fetching questions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        fetchQuestions(categoryId);
    };

    const handleAnswerChange = (qaId, answer) => {
        setAnswers((prev) => ({ ...prev, [qaId]: answer }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const answerPayload = Object.entries(answers).map(([qaId, answer]) => ({
                userId,
                qaId: parseInt(qaId),
                answer,
            }));
            const response = await axiosInstance.post("/QaAnswer/submit-and-recommend", answerPayload);
            setResults(response.data);
        } catch (err) {
            console.error("Error submitting quiz:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedCategory("");
        setQuestions([]);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setResults(null);
    };

    const handleServiceClick = (serviceId) => {
        window.location.href = `/service/${serviceId}`;
    };

    return (
        <QuizContainer darkMode={darkMode}>
            {/* Bên trái: Chọn danh mục và làm quiz */}
            <LeftPanel darkMode={darkMode}>
                <Typography
                    variant="h5"
                    sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600, mb: 3 }}
                >
                    Skin Care Quiz
                </Typography>

                {/* Chọn danh mục */}
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                        Select Category
                    </InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        sx={{
                            color: darkMode ? "#ecf0f1" : "#2c3e50",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: darkMode ? "#5a758c" : "#ccc",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: darkMode ? "#1abc9c" : "#6c4f37",
                            },
                        }}
                    >
                        <MenuItem value="">
                            <em>Choose a category</em>
                        </MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.serviceCategoryId} value={cat.serviceCategoryId}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Hiển thị câu hỏi */}
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress sx={{ color: darkMode ? "#1abc9c" : "#6c4f37" }} />
                    </Box>
                ) : questions.length > 0 ? (
                    <Box sx={{ position: "relative", minHeight: "200px" }}>
                        <Typography
                            sx={{
                                color: darkMode ? "#ecf0f1" : "#2c3e50",
                                mb: 2,
                                fontSize: "1.2rem",
                                fontWeight: 500,
                                wordWrap: "break-word",
                            }}
                        >
                            Question {currentQuestionIndex + 1} of {questions.length}:{" "}
                            {questions[currentQuestionIndex].question}
                        </Typography>
                        <RadioGroup
                            value={answers[questions[currentQuestionIndex].qaId] || ""}
                            onChange={(e) => handleAnswerChange(questions[currentQuestionIndex].qaId, e.target.value)}
                            sx={{ mb: 3, display: "flex", flexDirection: "row", justifyContent: "center", gap: 3 }}
                        >
                            <FormControlLabel
                                value="Yes"
                                control={<Radio sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }} />}
                                label="Yes"
                                sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}
                            />
                            <FormControlLabel
                                value="No"
                                control={<Radio sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }} />}
                                label="No"
                                sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}
                            />
                        </RadioGroup>
                        <FixedNextButton
                            variant="contained"
                            onClick={handleNextQuestion}
                            disabled={!answers[questions[currentQuestionIndex]?.qaId]}
                            darkMode={darkMode}
                        >
                            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
                        </FixedNextButton>
                        <FixedResetButton
                            variant="contained"
                            onClick={handleReset}
                            darkMode={darkMode}
                        >
                            Reset
                        </FixedResetButton>
                    </Box>
                ) : selectedCategory ? (
                    <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                        No questions available for this category.
                    </Typography>
                ) : (
                    <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                        Please select a category to start the quiz.
                    </Typography>
                )}
            </LeftPanel>

            {/* Bên phải: Hiển thị dịch vụ đề xuất */}
            <RightPanel darkMode={darkMode}>
                <Typography
                    variant="h6"
                    sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600, mb: 2 }}
                >
                    Recommended Services
                </Typography>
                {results ? (
                    results.map((service) => (
                        <ServiceCard
                            key={service.serviceId}
                            darkMode={darkMode}
                            onClick={() => handleServiceClick(service.serviceId)}
                        >
                            <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontWeight: 600 }}>
                                {service.name}
                            </Typography>
                            <Typography
                                sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontSize: "0.9rem", mb: 1 }}
                            >
                                {service.description}
                            </Typography>
                            <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                                Price: {service.price} VND
                            </Typography>
                        </ServiceCard>
                    ))
                ) : (
                    <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                        Complete the quiz to see recommended services.
                    </Typography>
                )}
            </RightPanel>
        </QuizContainer>
    );
};

export default UserQuiz;