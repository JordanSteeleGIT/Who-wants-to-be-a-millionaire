import React, { FC, useState } from "react";
import { FullQuestions } from "../Types/QuizTypes";

type IProps = {
  data: FullQuestions[];
};
const QuestionsScreen: FC<IProps> = ({ data }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>();
  const [buttonColorState, setButtonColorState] = useState<string>("white");
  return (
    <div>
      <h1
        dangerouslySetInnerHTML={{ __html: data[currentQuestion].question }}
      />
      {data[currentQuestion].all_answers.map((answer) => {
        return (
          <button
            dangerouslySetInnerHTML={{ __html: answer }}
            style={{
              backgroundColor:
                selectedAnswer === answer ? buttonColorState : "white",
            }}
            onClick={() => {
              setSelectedAnswer(answer);
              setButtonColorState("orange");
            }}
          />
        );
      })}
      {selectedAnswer && (
        <button
          onClick={() => {
            if (selectedAnswer === data[currentQuestion].correct_answer) {
              setButtonColorState("green");
              setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
              }, 2000);
            }
          }}
        >
          Final Answer
        </button>
      )}
    </div>
  );
};

export default QuestionsScreen;
