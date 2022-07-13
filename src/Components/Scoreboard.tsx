import React, { FC } from "react";
import { scoreboardData } from "../Utils/Utils";

type ScoreboardProps = {
  currentQuestion: number;
};

const Scoreboard: FC<ScoreboardProps> = ({ currentQuestion }) => {
  return (
    <div className="half scoreboard">
      {scoreboardData.map((prize, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundColor:
                currentQuestion === index ? "orange" : "transparent",
              color: currentQuestion === index ? "black" : "orange",
            }}
          >
            <h1>{index + 1}</h1>
            {currentQuestion >= index ? <span>ㆍ</span> : <span></span>}
            <h1>{prize}</h1>
          </div>
        );
      })}
    </div>
  );
};

export default Scoreboard;
