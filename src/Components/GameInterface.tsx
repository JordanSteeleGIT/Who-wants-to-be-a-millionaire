import React, { FC, useEffect, useState } from "react";
import { FullQuestions } from "../Types/QuizTypes";
import InfoPanel from "./InfoPanel";
import QuestionsPanel from "./QuestionsPanel";
import Scoreboard from "./Scoreboard";

type IProps = {
  data: FullQuestions[];
  setData: React.Dispatch<React.SetStateAction<FullQuestions[]>>;
};

const GameInterface: FC<IProps> = ({ data, setData }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [disabledAnswers, setDisabledAnswers] = useState<number[]>([]);

  const handleDisabledButtons = (array: number[]) => {
    setDisabledAnswers(array);
  };

  return (
    <section>
      <div className="game-container">
        <div className="game-wrapper">
          <InfoPanel
            setData={setData}
            data={data}
            currentQuestion={currentQuestion}
            handleDisabledButtons={handleDisabledButtons}
          />
          <Scoreboard currentQuestion={currentQuestion} />
          <QuestionsPanel
            data={data}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            disabledAnswers={disabledAnswers}
          />
        </div>
      </div>
    </section>
  );
};

export default GameInterface;
