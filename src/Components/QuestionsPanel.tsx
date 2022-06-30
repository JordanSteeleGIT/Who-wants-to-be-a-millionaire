import React, { FC, useState } from "react";
import { FullQuestions } from "../Types/QuizTypes";
import { questionNumber } from "../Utils/Utils";

type QuestionsPanelProps = {
  data: FullQuestions[];
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
};

const QuestionsPanel: FC<QuestionsPanelProps> = ({
  data,
  currentQuestion,
  setCurrentQuestion,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>();
  const [endOfRound, setEndOfRound] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleBackgroundColor = (answer: string): string => {
    if (data[currentQuestion].correct_answer === answer && endOfRound) {
      return "green";
    } else if (answer !== selectedAnswer) {
      return "#02337c";
    } else {
      return "orange";
    }
  };

  const handleFontColor = (answer: string): string => {
    if (data[currentQuestion].correct_answer === answer && endOfRound) {
      return "black";
    } else if (answer !== selectedAnswer) {
      return "white";
    } else {
      return "black";
    }
  };

  const handleAnimation = (answer: string): string | undefined => {
    if (data[currentQuestion].correct_answer === answer) {
      if (data[currentQuestion].correct_answer === selectedAnswer) {
        return "corrent-animate";
      }
      if (data[currentQuestion].correct_answer !== selectedAnswer) {
        return "incorrent-animate";
      }
    }
  };

  return (
    <div className="questions-panel-container full">
      <div className="question-box">
        <h1
          dangerouslySetInnerHTML={{ __html: data[currentQuestion].question }}
        />
      </div>
      <div className="answers-container">
        {data[currentQuestion].all_answers.map((answer, index) => {
          return (
            <button
              disabled={endOfRound}
              className={`answer-box ${
                endOfRound ? handleAnimation(answer) : ""
              } `}
              dangerouslySetInnerHTML={{
                __html: `<span style="color:${handleFontColor(
                  answer
                )}">${questionNumber(index)}</span>&nbsp${answer}`,
              }}
              style={{
                backgroundColor: handleBackgroundColor(answer),
                color: handleFontColor(answer),
              }}
              onClick={() => {
                setSelectedAnswer(answer);
              }}
            />
          );
        })}
        {selectedAnswer && (
          <button
            className="final-answer"
            onClick={() => {
              setEndOfRound(true);
              if (selectedAnswer === data[currentQuestion].correct_answer) {
                setTimeout(() => {
                  setEndOfRound(false);
                  setCurrentQuestion(currentQuestion + 1);
                  setSelectedAnswer(null);
                }, 3400);
              } else {
                setGameOver(true);
              }
            }}
          >
            Final Answer
          </button>
        )}
      </div>
      {/* {gameOver && <h1>GAME OVER</h1>} */}
    </div>
  );
};

export default QuestionsPanel;
