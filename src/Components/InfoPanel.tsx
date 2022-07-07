import React, { FC, useEffect, useState } from "react";

import { FullQuestions } from "../Types/QuizTypes";
import { shuffleArray, randombetween } from "../Utils/Utils";

type InfoPanelProps = {
  setData: React.Dispatch<React.SetStateAction<FullQuestions[]>>;
  currentQuestion: number;
  data: FullQuestions[];
  handleDisabledButtons: (array: number[]) => void;
};

type AskAudienceType = {
  [key: string]: number;
};

const InfoPanel: FC<InfoPanelProps> = ({
  setData,
  currentQuestion,
  data,
  handleDisabledButtons,
}) => {
  const [hasFiftyfiftyLifeline, setHasFiftyfiftyLifeline] =
    useState<boolean>(true);
  const [hasAskAudienceLifeline, setHasAskAudienceLifeline] =
    useState<boolean>(true);

  const [displayAudienceGraph, setDisplayAudienceGraph] =
    useState<boolean>(false);
  const [askAudienceData, setAskAudienceData] = useState<AskAudienceType>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  });

  useEffect(() => {
    setDisplayAudienceGraph(false);
  }, [currentQuestion]);

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

  const handleAskAudienceDifficulty = () => {
    //Switch statement for each question difficulty
    let randomNumber = randombetween(0, 1);
    switch (data[currentQuestion].difficulty) {
      case "easy":
        return handleAskAudience(randomNumber, 0.95);
      case "medium":
        return handleAskAudience(randomNumber, 0.85);
      case "hard":
        return handleAskAudience(randomNumber, 0.7);
      default:
        return handleAskAudience(randomNumber, 0.85);
    }
  };

  const generateWrongAnswersProb = (max: number, thecount: number) => {
    //Function takes the remaining probability chance and and picks a number within a range for each individual answer
    var r = [];
    let newMax = max;
    let stopMaxRoll = newMax * 0.15;
    for (let i = 0; i < thecount; i++) {
      if (i === thecount - 1) {
        r.push(parseFloat(newMax.toFixed(2)));
      } else {
        let randomNumber = randombetween(stopMaxRoll, newMax - stopMaxRoll);
        r.push(randomNumber);
        newMax = newMax - randomNumber;
      }
    }
    return shuffleArray(r);
  };

  const generateAllAnswersProb = (correctAnswerProbability: number) => {
    //Function returns an array with each answers weights to be chosen by the audience
    let wrongAnswersProbArr = generateWrongAnswersProb(
      1 - correctAnswerProbability,
      3
    );
    let indexOfCorrectAnswer = data[currentQuestion].all_answers.indexOf(
      data[currentQuestion].correct_answer
    );
    wrongAnswersProbArr.splice(
      indexOfCorrectAnswer,
      0,
      correctAnswerProbability
    );
    return wrongAnswersProbArr;
  };

  const biasedRandomSelection = (
    values: string[],
    probabilities: number[]
  ): string | undefined => {
    //Functions the probablities to pick and answer
    var rand = Math.random();
    var cumulativeProb = 0;
    for (var i = 0; i < probabilities.length; i++) {
      cumulativeProb += probabilities[i];
      if (rand < cumulativeProb) return values[i];
    }
  };
  const calculateAudienceAnswers = (allAnswersArray: any, bias: number[]) => {
    //Sums return value from biasRandomSelection
    let newArr = ["A", "B", "C", "D"];
    let audienceAnswers: AskAudienceType = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };
    for (let i = 0; i < 30; i++) {
      let answer = biasedRandomSelection(allAnswersArray, bias); // The result will an answer as a string
      let indexOfAnswer = allAnswersArray.indexOf(answer); // Find the index of the chosen answer
      audienceAnswers[newArr[indexOfAnswer]] =
        audienceAnswers[newArr[indexOfAnswer]] + 1;
    }
    return audienceAnswers;
  };

  const handleAskAudience = (randomNumber: number, threshold: number) => {
    setHasAskAudienceLifeline(false);
    //Function indentifies if audience is going to be correct and what to do with the result
    if (randomNumber < threshold) {
      //audience is correct
      let correctAnswerProbability = randombetween(0.51, 0.9);
      let audienceProbability = generateAllAnswersProb(
        correctAnswerProbability
      );
      setAskAudienceData(
        calculateAudienceAnswers(
          data[currentQuestion].all_answers,
          audienceProbability
        )
      );
    } else {
      //audience is wrong
      let correctAnswerProbability = randombetween(0.1, 0.4);
      let audienceProbability = generateAllAnswersProb(
        correctAnswerProbability
      );
      setAskAudienceData(
        calculateAudienceAnswers(
          data[currentQuestion].all_answers,
          audienceProbability
        )
      );
    }
  };

  const handleButtonEvent = (lifeLineState: boolean) => {
    if (!lifeLineState) {
      return "cross";
    } else {
      return undefined;
    }
  };

  return (
    <div className="half info-panel">
      <img src="./images/whowants.png" />
      {displayAudienceGraph && (
        <div className="audience-container">
          {Object.keys(askAudienceData).map((keyName) => {
            return (
              <div
                style={{
                  height: askAudienceData[keyName] * 3,
                }}
              >
                <h4 className="audience-number">{askAudienceData[keyName]}</h4>
                <h4 className="audience-letter">{keyName}</h4>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <button
          className={handleButtonEvent(hasFiftyfiftyLifeline)}
          onClick={() => (hasFiftyfiftyLifeline ? handleFiftyFifty() : null)}
        >
          50/50
        </button>
        <button
          className={handleButtonEvent(hasAskAudienceLifeline)}
          onClick={() => {
            if (hasAskAudienceLifeline) {
              handleAskAudienceDifficulty();
              setDisplayAudienceGraph(true);
            }
          }}
        >
          ask audience
        </button>
        <button
          style={{
            background: true
              ? "radial-gradient(circle,rgba(7,46,120,1) 0%, rgba(10,21,74,1) 100%"
              : "red",
          }}
        >
          ask host
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;
