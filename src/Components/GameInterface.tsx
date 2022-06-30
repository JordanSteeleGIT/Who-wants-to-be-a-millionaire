import React, { FC, useState } from "react";
import { FullQuestions } from "../Types/QuizTypes";
import QuestionsPanel from "./QuestionsPanel";
import Scoreboard from "./Scoreboard";

type IProps = {
  data: FullQuestions[];
};

const GameInterface: FC<IProps> = ({ data }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  return (
    <section>
      <div className="game-container">
        <div className="game-wrapper">
          <div className="half">
            <h1>logo</h1>
          </div>
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
