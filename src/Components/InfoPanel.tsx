import React, { FC } from "react";

import { FullQuestions } from "../Types/QuizTypes";
import { shuffleArray } from "../Utils/Utils";

type InfoPanelProps = {
  setData: React.Dispatch<React.SetStateAction<FullQuestions[]>>;
  currentQuestion: number;
};

const InfoPanel: FC<InfoPanelProps> = ({ setData, currentQuestion }) => {
  function removeTwoAnswers(fullArray: any, correctAnswer: any) {
    let index = fullArray.indexOf(correctAnswer);
    let numbers = generateRandom(index);
    console.log(numbers);
    for (let i = 0; i < 2; i++) {
      fullArray[numbers[i]] = " ";
    }
    return fullArray;
  }

  function generateRandom(excluded: number) {
    let arr: number[] = [0, 1, 2, 3];
    let excludedArr = arr.filter(function (item) {
      return item !== excluded;
    });
    let shuffledArray = shuffleArray(excludedArr);
    shuffledArray.splice(Math.floor(Math.random() * 3), 1);
    return shuffledArray;
  }

  return (
    <div className="half info-panel">
      <img src="./images/whowants.png" />
      <div>
        <button
          onClick={() =>
            setData((prev) =>
              prev.map((x, index) => {
                if (index === currentQuestion)
                  return {
                    ...x,
                    all_answers: removeTwoAnswers(
                      x.all_answers,
                      x.correct_answer
                    ),
                  };
                return x;
              })
            )
          }
        >
          50/50
        </button>
        <button>ask audience</button>
      </div>
    </div>
  );
};

export default InfoPanel;
