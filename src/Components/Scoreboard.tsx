import React, { FC, useState } from "react";

type ScoreboardProps = {
  currentQuestion: number;
};

const Scoreboard: FC<ScoreboardProps> = ({ currentQuestion }) => {
  const [scoreboard, setScoreboard] = useState<string[]>([
    "£100",
    "£200",
    "£300",
    "£500",
    "£1,000",
    "£2,000",
    "£4,000",
    "£8,000",
    "£16,000",
    "£32,000",
    "£64,000",
    "£125,000",
    "£250,000",
    "£500,000",
    "£1 MILLION",
  ]);
  return (
    <div className="half scoreboard">
      {scoreboard.map((prize, index) => {
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
