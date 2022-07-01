import React, { FC, useState } from "react";
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
  return (
    <section>
      <div className="game-container">
        <div className="game-wrapper">
          <InfoPanel setData={setData} currentQuestion={currentQuestion} />
          <Scoreboard currentQuestion={currentQuestion} />
          <QuestionsPanel
            data={data}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
          />
        </div>
      </div>
    </section>
  );
};

export default GameInterface;
