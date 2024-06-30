import React, { useState, useEffect } from "react";
import { Button, Progress, Typography, Input, Modal } from "antd";
import questionsJson from "./dummyQuiz.json";
import "./Quiz.css";
import { FieldTimeOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const { Title } = Typography;

const QuizApp = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showalert, setshowalert] = useState(undefined);
  const [seconds, setSeconds] = useState(45);
  const [clicked, setClicked] = useState(false);
  const [pass, setPass] = useState(null);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [value, setValue] = useState(0);
  const [currentPer, setCurrentPer] = useState(0);
  const [maxPer, setMaxPer] = useState(100);
  const [minPer, setMinPer] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds <= 0) {
        clearInterval(interval);
        handleSkipQuestion();
        setWrongAnswer(wrongAnswer + 1);
      } else {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const questions = questionsJson.map((eachQuestion) => {
    return {
      ...eachQuestion,
      incorrect_answers: [
        ...eachQuestion.incorrect_answers,
        eachQuestion.correct_answer,
      ],
    };
  });

  const totalQuestions = [
    ...questions,
    ...skippedQuestions.map((skippedQuestion) => ({
      ...skippedQuestion,
      skipped: true,
    })),
  ];

  const data = [
    {
      val: 100,
      color: "green",
    },
    {
      val: currentPer,
      color: "yellow",
    },
    {
      val: maxPer,
      color: "orange",
    },
    {
      val: minPer,
      color: "red",
    },
  ];

  const handleNextQuestion = () => {
    setshowalert(undefined);
    setPass(null);
    setSeconds(45);

    // Update progress bar here
    setValue(value + 1);

    if (currentQuestionIndex === questions.length - 1) {
      setShowResult(true);
      setQuizCompleted(true); // Mark quiz as completed
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    setClicked(false);
    setSelectedOption(null);

    // Update currentPer and other percentages
    setMinPer((correctAnswers * 100) / questions.length);
    setCurrentPer((correctAnswers * 100) / (currentQuestionIndex + 1));
    setMaxPer(
      ((correctAnswers + (questions.length - (currentQuestionIndex + 1))) *
        100) /
        questions.length
    );
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);

    if (option === questions[currentQuestionIndex].correct_answer) {
      setPass(option);
      setCorrectAnswers(correctAnswers + 5);
      setshowalert(true);
      setPass(true);
    } else {
      setshowalert(false);
      setPass(false);
      setWrongAnswer(wrongAnswer + 1);
    }

    setClicked(true);
  };

  const handleSkipQuestion = () => {
    setSkippedQuestions([...skippedQuestions, questions[currentQuestionIndex]]);
    handleNextQuestion();
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    setIsFeedbackModalVisible(false);
    console.log("Feedback submitted: ", feedback);
  };

  const handleSubmitQuiz = () => {
    // Calculate score based on correct answers
    const totalScore = correctAnswers * 5;
    console.log("Quiz submitted. Total score:", totalScore);
    setQuizCompleted(true);
  };

  const [isQuizActive, setIsQuizActive] = useState(true);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsQuizActive(false);
        setQuizEnded(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (quizEnded) {
    return (
      <div>
        <h1>Quiz Application</h1>
        <div style={{ color: "red", fontWeight: "bold" }}>
          The quiz has ended because you switched tabs. Please restart the quiz.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Quiz Application</h1>
      {isQuizActive ? (
        <div>
          <div className="contain-quiz">
            {!showResult ? (
              <div className="app">
                <div className="bar">
                  <Progress
                    percent={(value / totalQuestions.length) * 100}
                    status="active"
                    showInfo={false}
                  />
                </div>
                <div className="first-row">
                  <Title level={3}>
                    Question {currentQuestionIndex + 1} / of{" "}
                    {totalQuestions.length}
                  </Title>
                  <span>
                    <FieldTimeOutlined />
                    {seconds} seconds
                  </span>
                </div>
                <div className="star">
                  <FontAwesomeIcon
                    style={{
                      color:
                        questions[currentQuestionIndex].difficulty === "easy" ||
                        questions[currentQuestionIndex].difficulty ===
                          "medium" ||
                        questions[currentQuestionIndex].difficulty === "hard"
                          ? "#FCA120"
                          : "#dedede",
                    }}
                    icon={faStar}
                  />
                  <FontAwesomeIcon
                    style={{
                      color:
                        questions[currentQuestionIndex].difficulty ===
                          "medium" ||
                        questions[currentQuestionIndex].difficulty === "hard"
                          ? "#FCA120"
                          : "#dedede",
                    }}
                    icon={faStar}
                  />
                  <FontAwesomeIcon
                    style={{
                      color:
                        questions[currentQuestionIndex].difficulty === "hard"
                          ? "#FCA120"
                          : "#dedede",
                    }}
                    icon={faStar}
                  />
                </div>
                <div className="second-row">
                  <span className="question">
                    {decodeURIComponent(
                      totalQuestions[currentQuestionIndex].question
                    )}
                  </span>
                </div>
                <div className="main-container">
                  <div className="main-contain">
                    {totalQuestions[currentQuestionIndex].incorrect_answers.map(
                      (option, index) => (
                        <div className="middle-contain" key={index}>
                          <Button
                            style={{
                              margin: 5,
                              color: "black",
                              width: 230,
                              height: 45,
                              backgroundColor:
                                option === selectedOption ? "green" : "white",
                            }}
                            onClick={() => handleOptionSelect(option)}
                          >
                            {decodeURIComponent(option)}
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div
                  className="next-button"
                  style={{position:"relative",left:0,top:0,bottom:0,right:0 }}
                >
                  <Button
                    onClick={handleNextQuestion}
                    className="button"
                    disabled={!clicked} // Disable if no option is selected
                  >
                    Next
                  </Button>
                  <Button
                    onClick={handleSkipQuestion}
                    className="button"
                    style={{ marginLeft: 10 }}
                  >
                    Skip
                  </Button>
                </div>
                <div className="progress-container">
                  <div
                    style={{
                      position: "absolute",
                      bottom: "5px",
                      left: "5px",
                      width: "100%",
                    }}
                  >
                    {/* <ResultProgress data={data.sort((x, y) => y.val - x.val)} /> */}
                  </div>
                </div>
              </div>
            ) : (
              <div className="quiz-result">
                <h2>Quiz Result</h2>
                <p>
                  You scored {correctAnswers} out of {questions.length}
                </p>
                <Progress
                  percent={(correctAnswers / totalQuestions.length) * 100}
                  status="active"
                  type="circle"
                  size={130}
                />
                <Button
                  onClick={() => setIsFeedbackModalVisible(true)}
                  className="button"
                >
                  Submit Feedback
                </Button>
                <Modal
                  title="Feedback"
                  visible={isFeedbackModalVisible}
                  onOk={handleFeedbackSubmit}
                  onCancel={() => setIsFeedbackModalVisible(false)}
                >
                  <Input.TextArea
                    value={feedback}
                    onChange={handleFeedbackChange}
                    placeholder="Enter your feedback"
                    rows={4}
                  />
                </Modal>
              </div>
            )}
          </div>
          {showResult && (
            <Button onClick={handleSubmitQuiz} className="button">
              Submit Quiz
            </Button>
          )}
          {skippedQuestions.length > 0 && (
            <div className="skipped-questions">
              <h2>Skipped Questions</h2>
              {skippedQuestions.map((question, index) => (
                <div key={index} className="skipped-question">
                  <p>{decodeURIComponent(question.question)}</p>
                  <ul>
                    {question.incorrect_answers.map((option, idx) => (
                      <li key={idx}>{decodeURIComponent(option)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ color: "red", fontWeight: "bold" }}>
          The quiz is paused. Please return to the quiz tab.
        </div>
      )}
    </div>
  );
};

export default QuizApp;
