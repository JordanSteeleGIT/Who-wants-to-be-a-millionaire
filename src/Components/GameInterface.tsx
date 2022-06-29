import React, { FC } from "react";
import { FullQuestions } from "../Types/QuizTypes";
import QuestionsPanel from "./QuestionsPanel";

type IProps = {
  data: FullQuestions[];
};

const GameInterface: FC<IProps> = ({ data }) => {
  return (
    <section>
      <div className="game-container">
        <div className="game-wrapper">
          <div className="half">
            <h1>logo</h1>
          </div>
          <div className="half">
            <h1>score</h1>
          </div>
          <QuestionsPanel data={data} />
        </div>
      </div>
    </section>
  );
};

export default GameInterface;
