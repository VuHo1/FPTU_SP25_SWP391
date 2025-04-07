import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { getServiceCategories, getQuestionsByCategory, submitQuiz } from "../api/testApi";
import { useAuth } from "../page/AuthContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Icon Back
import RestartAltIcon from "@mui/icons-material/RestartAlt"; // Icon Reset
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Icon Next


const QuizContainer = styled(Box)(({ darkMode }) => ({
    display: "flex",
    minHeight: "75vh",
    background: darkMode
        ? "linear-gradient(135deg, #34495e 0%, #2c3e50 100%)"
        : "linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)",
    padding: "30px",
    gap: "30px",
}));

const LeftPanel = styled(Box)(({ darkMode }) => ({
    flex: "0 0 70%",
    padding: "30px",
    background: darkMode ? "rgba(52, 73, 94, 0.98)" : "rgba(255, 255, 255, 0.98)",
    borderRadius: "16px",
    boxShadow: darkMode
        ? "0 12px 36px rgba(0, 0, 0, 0.5)"
        : "0 12px 36px rgba(0, 0, 0, 0.1)",
    border: darkMode ? "1px solid #5a758c" : "1px solid #e0e0e0",
    color: darkMode ? "#ecf0f1" : "#2c3e50",
    position: "relative",
    minHeight: "450px",
    display: "flex",
    flexDirection: "column",
}));

const RightPanel = styled(Box)(({ darkMode }) => ({
    flex: "0 0 30%",
    padding: "30px",
    background: darkMode ? "rgba(69, 90, 100, 0.9)" : "rgba(248, 244, 225, 0.9)",
    borderRadius: "16px",
    boxShadow: darkMode
        ? "0 12px 36px rgba(0, 0, 0, 0.5)"
        : "0 12px 36px rgba(0, 0, 0, 0.1)",
    border: darkMode ? "1px solid #5a758c" : "1px solid #e0e0e0",
    color: darkMode ? "#ecf0f1" : "#2c3e50",
}));

const ServiceCard = styled(Box)(({ darkMode }) => ({
    padding: "20px",
    marginBottom: "20px",
    background: darkMode ? "rgba(52, 73, 94, 0.9)" : "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "transform 0.3s, background 0.3s",
    "&:hover": {
        transform: "scale(1.05)",
        background: darkMode ? "rgba(52, 73, 94, 1)" : "rgba(255, 255, 255, 1)",
        boxShadow: darkMode
            ? "0 6px 18px rgba(0, 0, 0, 0.3)"
            : "0 6px 18px rgba(0, 0, 0, 0.1)",
    },
}));

const StyledIconButton = styled(IconButton)(({ darkMode }) => ({
    position: "absolute",
    bottom: "30px",
    right: "30px",
    background: darkMode
        ? "linear-gradient(45deg, #1abc9c 30%, #16a085 90%)"
        : "linear-gradient(45deg, #6c4f37 30%, #5a4030 90%)",
    color: "#fff",
    padding: "10px",
    borderRadius: "50%",
    "&:hover": {
        background: darkMode
            ? "linear-gradient(45deg, #16a085 30%, #1abc9c 90%)"
            : "linear-gradient(45deg, #5a4030 30%, #6c4f37 90%)",
    },
}));

const StyledBackIconButton = styled(IconButton)(({ darkMode }) => ({
    position: "absolute",
    bottom: "30px",
    left: "80px",
    background: darkMode
        ? "linear-gradient(45deg, #3498db 30%, #2980b9 90%)"
        : "linear-gradient(45deg, #2980b9 30%, #3498db 90%)",
    color: "#fff",
    padding: "10px",
    borderRadius: "50%",
    "&:hover": {
        background: darkMode
            ? "linear-gradient(45deg, #2980b9 30%, #3498db 90%)"
            : "linear-gradient(45deg, #3498db 30%, #2980b9 90%)",
    },
}));

const StyledResetIconButton = styled(IconButton)(({ darkMode }) => ({
    position: "absolute",
    bottom: "30px",
    left: "30px",
    background: darkMode
        ? "linear-gradient(45deg, #9b59b6 30%, #8e44ad 90%)"
        : "linear-gradient(45deg, #8e44ad 30%, #9b59b6 90%)",
    color: "#fff",
    padding: "10px",
    borderRadius: "50%",
    "&:hover": {
        background: darkMode
            ? "linear-gradient(45deg, #8e44ad 30%, #9b59b6 90%)"
            : "linear-gradient(45deg, #9b59b6 30%, #8e44ad 90%)",
    },
}));

const QuestionContainer = styled(Box)({
    flex: 1,
    overflowY: "auto",
    marginBottom: "80px",
});


const UserQuiz = ({ darkMode }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const { isLoggedIn, userId, token } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            if (!token) return;
            try {
                const response = await getServiceCategories(token);
                setCategories(response.data.filter((cat) => cat.status && cat.exist));
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, [token]);

    if (!isLoggedIn || !token || !userId) {
        return (
            <QuizContainer darkMode={darkMode}>
                <LeftPanel darkMode={darkMode}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: darkMode ? "#1abc9c" : "#6c4f37",
                            fontWeight: 700,
                            mb: 4,
                            fontFamily: "'Poppins', sans-serif",
                        }}
                    >
                        Skin Care Quiz
                    </Typography>
                    <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}>
                        Please log in to take the quiz.
                    </Typography>
                </LeftPanel>
                <RightPanel darkMode={darkMode} />
            </QuizContainer>
        );
    }

    const fetchQuestions = async (categoryId) => {
        setLoading(true);
        try {
            const response = await getQuestionsByCategory(categoryId, token);
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

    const handleAnswerChange = (qaId, qaOptionId) => {
        setAnswers((prev) => ({ ...prev, [qaId]: qaOptionId }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBackQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const answerPayload = Object.entries(answers).map(([qaId, qaOptionId]) => ({
                userId,
                qaId: parseInt(qaId),
                qaOptionId: parseInt(qaOptionId),
            }));
            const response = await submitQuiz(answerPayload, token);
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
                    sx={{
                        color: darkMode ? "#1abc9c" : "#6c4f37",
                        fontWeight: 700,
                        mb: 4,
                        fontFamily: "'Poppins', sans-serif",
                    }}
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
                            background: darkMode ? "rgba(255, 255, 255, 0.1)" : "#fff",
                            borderRadius: "8px",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: darkMode ? "#5a758c" : "#e0e0e0",
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
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                        <CircularProgress sx={{ color: darkMode ? "#1abc9c" : "#6c4f37" }} />
                    </Box>
                ) : questions.length > 0 ? (
                    <QuestionContainer>
                        <Typography
                            sx={{
                                color: darkMode ? "#ecf0f1" : "#2c3e50",
                                mb: 3,
                                fontSize: "1.25rem",
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
                            sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 2 }}
                        >
                            {questions[currentQuestionIndex].options.map((option) => (
                                <FormControlLabel
                                    key={option.qaOptionId}
                                    value={option.qaOptionId}
                                    control={<Radio sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }} />}
                                    label={option.answerText}
                                    sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50" }}
                                />
                            ))}
                        </RadioGroup>

                        <Tooltip title={currentQuestionIndex === questions.length - 1 ? "Finish" : "Next Question"}>
                            <StyledIconButton
                                onClick={handleNextQuestion}
                                disabled={!answers[questions[currentQuestionIndex]?.qaId]}
                                darkMode={darkMode}
                            >
                                <ArrowForwardIcon />
                            </StyledIconButton>
                        </Tooltip>
                        <Tooltip title="Reset Quiz">
                            <StyledResetIconButton
                                onClick={handleReset}
                                darkMode={darkMode}
                            >
                                <RestartAltIcon />
                            </StyledResetIconButton>
                        </Tooltip>
                        <Tooltip title="Previous Question">
                            <StyledBackIconButton
                                onClick={handleBackQuestion}
                                disabled={currentQuestionIndex === 0}
                                darkMode={darkMode}
                            >
                                <ArrowBackIcon />
                            </StyledBackIconButton>
                        </Tooltip>
                    </QuestionContainer>
                ) : selectedCategory ? (
                    <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontSize: "1.1rem" }}>
                        No questions available for this category.
                    </Typography>
                ) : (
                    <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontSize: "1.1rem" }}>
                        Please select a category to start the quiz.
                    </Typography>
                )}
            </LeftPanel>

            {/* Bên phải: Hiển thị dịch vụ đề xuất */}
            <RightPanel darkMode={darkMode}>
                <Typography
                    variant="h6"
                    sx={{
                        color: darkMode ? "#1abc9c" : "#6c4f37",
                        fontWeight: 700,
                        mb: 3,
                        fontFamily: "'Poppins', sans-serif",
                    }}
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
                            <Typography
                                sx={{
                                    color: darkMode ? "#ecf0f1" : "#2c3e50",
                                    fontWeight: 600,
                                    fontSize: "1.1rem",
                                }}
                            >
                                {service.name}
                            </Typography>
                            <Typography
                                sx={{
                                    color: darkMode ? "#ecf0f1" : "#2c3e50",
                                    fontSize: "0.9rem",
                                    mb: 1,
                                }}
                            >
                                {service.description}
                            </Typography>
                            <Typography
                                sx={{
                                    color: darkMode ? "#1abc9c" : "#6c4f37",
                                    fontWeight: 500,
                                }}
                            >
                                Price: {service.price} VND
                            </Typography>
                        </ServiceCard>
                    ))
                ) : (
                    <Typography sx={{ color: darkMode ? "#ecf0f1" : "#2c3e50", fontSize: "1rem" }}>
                        Complete the quiz to see recommended services.
                    </Typography>
                )}
            </RightPanel>
        </QuizContainer>
    );
};

export default UserQuiz;