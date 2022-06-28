import React, { FC, useState } from "react";
import { FullQuestions } from "../Types/QuizTypes";

type IProps = {
  data: FullQuestions[];
};

const QuestionsScreen: FC<IProps> = ({ data }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>();
  const [endOfRound, setEndOfRound] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleColor = (answer: string) => {
    if (data[currentQuestion].correct_answer === answer && endOfRound) {
      return "green";
    } else if (answer !== selectedAnswer) {
      return "white";
    } else {
      return "orange";
    }
  };

  const handleAnimation = (answer: string) => {
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
    <div>
      <h1
        dangerouslySetInnerHTML={{ __html: data[currentQuestion].question }}
      />
      {data[currentQuestion].all_answers.map((answer) => {
        return (
          <button
            className={endOfRound ? handleAnimation(answer) : ""}
            dangerouslySetInnerHTML={{ __html: answer }}
            style={{
              backgroundColor: handleColor(answer),
            }}
            onClick={() => {
              setSelectedAnswer(answer);
            }}
          />
        );
      })}
      {selectedAnswer && (
        <button
          onClick={() => {
            setEndOfRound(true);
            if (selectedAnswer === data[currentQuestion].correct_answer) {
              setTimeout(() => {
                setEndOfRound(false);
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
              }, 5000);
            } else {
              setGameOver(true);
            }
          }}
        >
          Final Answer
        </button>
      )}

      {gameOver && <h1>GAME OVER</h1>}
    </div>
  );
};

export default QuestionsScreen;
