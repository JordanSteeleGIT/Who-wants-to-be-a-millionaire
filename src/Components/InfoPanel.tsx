import React, { FC, useState } from "react";

import { FullQuestions } from "../Types/QuizTypes";
import { shuffleArray } from "../Utils/Utils";

type InfoPanelProps = {
  setData: React.Dispatch<React.SetStateAction<FullQuestions[]>>;
  currentQuestion: number;
  data: FullQuestions[];
  handleDisabledButtons: (array: number[]) => void;
};

const InfoPanel: FC<InfoPanelProps> = ({
  setData,
  currentQuestion,
  data,
  handleDisabledButtons,
}) => {
  const [hasFiftyfiftyLifeline, setHasFiftyfiftyLifeline] =
    useState<boolean>(true);

  const removeTwoAnswers = (
    fullArray: string[],
    correctAnswer: string
  ): string[] => {
    let index = fullArray.indexOf(correctAnswer);
    let numbers = generateRandom(index);
    handleDisabledButtons(numbers);
    for (let i = 0; i < 2; i++) {
      fullArray[numbers[i]] = " ";
    }
    return fullArray;
  };

  const generateRandom = (excluded: number): number[] => {
    var arr = [];
    while (arr.length < 2) {
      var r = Math.floor(Math.random() * 4);
      if (arr.indexOf(r) === -1 && r !== excluded) arr.push(r);
    }
    return arr;
  };

  const handleFiftyFifty = (): void => {
    const newState = data.map((obj, index) => {
      if (index === currentQuestion) {
        return {
          ...obj,
          all_answers: removeTwoAnswers(obj.all_answers, obj.correct_answer),
        };
      }
      return obj;
    });
    setHasFiftyfiftyLifeline(false);
    setData(newState);
  };

  const handleAskAudience = () => {
    switch (data[currentQuestion].difficulty) {
      case "easy":
        return handleEasyAskAudience(
          data[currentQuestion].all_answers,
          data[currentQuestion].correct_answer
        );

      default:
        return handleEasyAskAudience(
          data[currentQuestion].all_answers,
          data[currentQuestion].correct_answer
        );
    }
  };

  const biasedRandomSelection = (
    values: string[],
    probabilities: number[]
  ): string | undefined => {
    var rand = Math.random();
    var cumulativeProb = 0;
    for (var i = 0; i < probabilities.length; i++) {
      cumulativeProb += probabilities[i];
      if (rand < cumulativeProb) return values[i];
    }
  };

  const calculateAudienceAnswers = (allAnswersArray: any, bias: number[]) => {
    let newArr = ["a", "b", "c", "d"];
    let audienceAnswers: any = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    };

    for (let i = 0; i < 30; i++) {
      let answer = biasedRandomSelection(allAnswersArray, bias);
      let indexOfAnswer = allAnswersArray?.indexOf(answer);

      audienceAnswers[newArr[indexOfAnswer]] =
        audienceAnswers[newArr[indexOfAnswer]] + 1;
    }
    return audienceAnswers;
  };

  const generateProb = (allAnswersArray: string[], correctAnswer: string) => {
    let probabilitiesArr = [];
    let indexOfCorrectAnswer = allAnswersArray.indexOf(correctAnswer);
    for (let i = 0; i < 4; i++) {
      if (i === indexOfCorrectAnswer) {
        probabilitiesArr.push(0.7);
      } else {
        probabilitiesArr.push(0.1);
      }
    }
    return probabilitiesArr;
  };

  const handleEasyAskAudience = (
    allAnswersArray: string[],
    correctAnswer: string
  ) => {
    let probability = generateProb(allAnswersArray, correctAnswer);
    let audienceAnswersObj = calculateAudienceAnswers(
      allAnswersArray,
      probability
    );
    return audienceAnswersObj;
  };

  return (
    <div className="half info-panel">
      <img src="./images/whowants.png" />
      <div>
        <button
          onClick={() => (hasFiftyfiftyLifeline ? handleFiftyFifty() : null)}
        >
          50/50
        </button>
        <button onClick={() => console.log(handleAskAudience())}>
          ask audience
        </button>
        <button>ask host</button>
      </div>
    </div>
  );
};

export default InfoPanel;
