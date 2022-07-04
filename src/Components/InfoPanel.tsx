import React, { FC, useState } from "react";

import { FullQuestions } from "../Types/QuizTypes";
import { shuffleArray } from "../Utils/Utils";

type InfoPanelProps = {
  setData: React.Dispatch<React.SetStateAction<FullQuestions[]>>;
  currentQuestion: number;
  data: FullQuestions[];
};

const InfoPanel: FC<InfoPanelProps> = ({ setData, currentQuestion, data }) => {
  function removeTwoAnswers(fullArray: any, correctAnswer: any) {
    let index = fullArray.indexOf(correctAnswer);
    let numbers = generateRandom(index);
    console.info(numbers);
    for (let i = 0; i < 2; i++) {
      fullArray[numbers[i]] = " ";
    }
    return fullArray;
  }

  function generateRandom(excluded: number) {
    var arr = [];
    while (arr.length < 2) {
      var r = Math.floor(Math.random() * 4);
      if (arr.indexOf(r) === -1 && r !== excluded) arr.push(r);
    }
    return arr;
  }

  const handleFiftyFifty = () => {
    const newState = data.map((obj, index) => {
      if (index === currentQuestion) {
        return {
          ...obj,
          all_answers: removeTwoAnswers(obj.all_answers, obj.correct_answer),
        };
      }
      return obj;
    });

    setData(newState);
  };

  return (
    <div className="half info-panel">
      <img src="./images/whowants.png" />
      <div>
        <button onClick={handleFiftyFifty}>50/50</button>
        <button>ask audience</button>
      </div>
    </div>
  );
};

export default InfoPanel;
