import "../App.css";
import { useState, useEffect, useContext } from "react";
import { GameStateContext } from "../helpers/Contexts";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [optionChosen, setOptionChosen] = useState("");

  const { score, setScore, setGameState } = useContext(GameStateContext);

  // Fetch questions from API
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=3&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        // Convert questions to match your internal format
        const formatted = data.results.map((q) => {
          const options = [...q.incorrect_answers];
          const answerIndex = Math.floor(Math.random() * 4);
          options.splice(answerIndex, 0, q.correct_answer);

          return {
            prompt: q.question,
            options,
            answer: q.correct_answer,
          };
        });
        setQuestions(formatted);
      });
  }, []);

  const chooseOption = (option) => {
    setOptionChosen(option);
  };

  const nextQuestion = () => {
    if (questions[currentQuestion].answer === optionChosen) {
      setScore(score + 1);
    }
    setOptionChosen("");
    setCurrentQuestion(currentQuestion + 1);
  };

  const finishQuiz = () => {
    if (questions[currentQuestion].answer === optionChosen) {
      setScore(score + 1);
    }
    setGameState("finished");
  };

  if (questions.length === 0) return <div>Loading questions...</div>;

  return (
    <div className="Quiz">
      <h1 dangerouslySetInnerHTML={{ __html: questions[currentQuestion].prompt }} />
      <div className="questions">
        {questions[currentQuestion].options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => chooseOption(option)}
            className={option === optionChosen ? "selected-option" : ""}
            dangerouslySetInnerHTML={{ __html: option }}
          />
        ))}
      </div>


      {currentQuestion === questions.length - 1 ? (
        <button onClick={finishQuiz} id="nextQuestion">
          Finish Quiz
        </button>
      ) : (
        <button onClick={nextQuestion} id="nextQuestion">
          Next Question
        </button>
      )}
    </div>
  );
}

export default Quiz;
