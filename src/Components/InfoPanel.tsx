import React, { FC, useEffect, useState } from "react";

import { FullQuestions } from "../Types/QuizTypes";
import {
  randomFloatBetween,
  randomIntExcludingArray,
  generateRandomArray,
  randomIntExcludingValue,
  randomInteger,
} from "../Utils/Utils";
import logo from "../logo.png";
type InfoPanelProps = {
  setData: React.Dispatch<React.SetStateAction<FullQuestions[]>>;
  currentQuestion: number;
  data: FullQuestions[];
  handleDisabledButtons: (array: number[]) => void;
};

type AskAudienceType = {
  [key: string]: number;
};
type FiftyFiftyData = {
  isActive: boolean;
  removedAnswers: number[];
};

const InfoPanel: FC<InfoPanelProps> = ({
  setData,
  currentQuestion,
  data,
  handleDisabledButtons,
}) => {
  const [hasFiftyfiftyLifeline, setHasFiftyfiftyLifeline] =
    useState<boolean>(true);

  const [fiftyFiftyData, setFiftyFiftyData] = useState<FiftyFiftyData>({
    isActive: false,
    removedAnswers: [],
  });
  const [hasAskAudienceLifeline, setHasAskAudienceLifeline] =
    useState<boolean>(true);
  const [hasAskHostLifeline, setHasAskHostLifeline] = useState<boolean>(true);

  const [displayHostAnswer, setDisplayHostAnswer] = useState<boolean>(false);
  const [displayAudienceGraph, setDisplayAudienceGraph] =
    useState<boolean>(false);
  const [askAudienceData, setAskAudienceData] = useState<AskAudienceType>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  });

  const [askHostData, setAskHostData] = useState<string>();

  useEffect(() => {
    setDisplayAudienceGraph(false);
    setDisplayHostAnswer(false);

    setFiftyFiftyData({
      isActive: false,
      removedAnswers: [],
    });
  }, [currentQuestion]);

  const removeTwoAnswers = (
    fullArray: string[],
    correctAnswer: string
  ): string[] => {
    let index = fullArray.indexOf(correctAnswer);
    let numbers = generateRandomArray(index);
    handleDisabledButtons(numbers);
    setFiftyFiftyData({
      isActive: true,
      removedAnswers: numbers,
    });

    for (let i = 0; i < 2; i++) {
      fullArray[numbers[i]] = " ";
    }
    return fullArray;
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
  const handleAskHostDifficulty = () => {
    //Switch statement for each question difficulty
    let randomNumber = randomFloatBetween(0, 1);
    switch (data[currentQuestion].difficulty) {
      case "easy":
        handleAskHost(randomNumber, 0.95);
        break;
      case "medium":
        handleAskHost(randomNumber, 0.75);
        break;
      case "hard":
        handleAskHost(randomNumber, 0.65);
        break;
      default:
        handleAskHost(randomNumber, 0.75);
        break;
    }
  };

  const handleAskHost = (randomNumber: number, threshold: number): void => {
    //TODO: look into using generateAllAnswersProb with biasedRandomSelection
    setHasAskHostLifeline(false);
    let indexOfCorrectAnswer = data[currentQuestion].all_answers.indexOf(
      data[currentQuestion].correct_answer
    );
    if (randomNumber < threshold) {
      setAskHostData(data[currentQuestion].correct_answer);
    } else {
      if (!fiftyFiftyData.isActive) {
        setAskHostData(
          data[currentQuestion].all_answers[
            randomIntExcludingValue(0, 3, indexOfCorrectAnswer)
          ]
        );
      } else {
        //50/50 active
        let invalidAnswers =
          fiftyFiftyData.removedAnswers.concat(indexOfCorrectAnswer);
        setAskHostData(
          data[currentQuestion].all_answers[
            randomIntExcludingArray(0, 3, invalidAnswers)
          ]
        );
      }
    }
  };

  const handleAskAudienceDifficulty = (): void => {
    //Switch statement for each question difficulty
    let randomNumber = randomFloatBetween(0, 1);
    switch (data[currentQuestion].difficulty) {
      case "easy":
        handleAskAudience(randomNumber, 0.91);
        break;
      case "medium":
        handleAskAudience(randomNumber, 0.85);
        break;
      case "hard":
        handleAskAudience(randomNumber, 0.7);
        break;
      default:
        handleAskAudience(randomNumber, 0.85);
        break;
    }
  };

  const handleAskAudience = (randomNumber: number, threshold: number): void => {
    setHasAskAudienceLifeline(false);
    //Function indentifies if audience is going to be correct and what to do with the result
    if (randomNumber < threshold) {
      let correctAnswers = randomFloatBetween(0.51, 0.87);
      handleAudienceWrongAnswersCount(correctAnswers);
      //audience is correct
    } else {
      //audience is wrong
      let correctAnswers = randomInteger(0.2, 0.4);
      handleAudienceWrongAnswersCount(correctAnswers);
    }
  };

  const generateAllAnswersProb = (
    noIncorrectProb: number,
    correctAnswerProb: number,
    indexOfCorrectAnswer: number
  ): number[] => {
    //Function takes the remaining probability chance and and picks a number within a range for each individual answer
    var r = [];
    let max = 1 - correctAnswerProb;
    let newMax = max;
    let stopMaxRoll = newMax * 0.15;
    for (let i = 0; i < noIncorrectProb; i++) {
      if (i === noIncorrectProb - 1) {
        r.push(parseFloat(newMax.toFixed(2)));
      } else {
        let randomNumber = randomFloatBetween(
          stopMaxRoll,
          newMax - stopMaxRoll
        );
        r.push(randomNumber);
        newMax = newMax - randomNumber;
      }
    }
    return spliceProbArray(r, indexOfCorrectAnswer, correctAnswerProb);
  };

  const spliceProbArray = (
    incorrectProbArr: number[],
    indexOfCorrectAnswer: number,
    correctAnswerProb: number
  ): number[] => {
    incorrectProbArr.splice(indexOfCorrectAnswer, 0, correctAnswerProb);
    return incorrectProbArr;
  };

  const biasedRandomSelection = <T,>(
    values: T[],
    probabilities: number[]
  ): any => {
    //Functions the probablities to pick and answer
    var rand = Math.random();
    var cumulativeProb = 0;
    for (var i = 0; i < probabilities.length; i++) {
      cumulativeProb += probabilities[i];
      if (rand < cumulativeProb) return values[i];
    }
  };

  const handleAudienceWrongAnswersCount = (correctAnswerProb: number): void => {
    let indexOfCorrectAnswer = data[currentQuestion].all_answers.indexOf(
      data[currentQuestion].correct_answer
    );
    let tempAudienceAnswers: AskAudienceType = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };
    let lookUpArray = ["A", "B", "C", "D"];
    if (!fiftyFiftyData.isActive) {
      let probArrWithoutFiftyFifty = generateAllAnswersProb(
        3,
        correctAnswerProb,
        indexOfCorrectAnswer
      );
      for (let i = 0; i < 30; i++) {
        tempAudienceAnswers[
          biasedRandomSelection(lookUpArray, probArrWithoutFiftyFifty)
        ] += 1;
      }
    } else {
      //Array with only answers that I want to generate probabilities for (correct answer and one other answer)
      let availableAnswers = removeMultipleIndexes(
        lookUpArray,
        fiftyFiftyData.removedAnswers
      );
      //since 50/50 is active the audience should have a higher chance of being correct
      let increasedCorrectAnswerProb =
        correctAnswerProb + 0.15 <= 1
          ? correctAnswerProb + 0.15
          : correctAnswerProb;

      let probArrWithFiftyFifty = generateAllAnswersProb(
        1,
        increasedCorrectAnswerProb,
        indexOfCorrectAnswer
      );

      for (let i = 0; i < 30; i++) {
        tempAudienceAnswers[
          biasedRandomSelection(availableAnswers, probArrWithFiftyFifty)
        ] += 1;
      }
    }
    setAskAudienceData(tempAudienceAnswers);
  };

  const removeMultipleIndexes = <T,>(arr: T[], index: number[]): T[] => {
    for (var i = index.length - 1; i >= 0; i--) {
      arr.splice(index[i], 1);
    }
    return arr;
  };

  const handleButtonClass = (lifeLineState: boolean): string | undefined => {
    if (!lifeLineState) {
      return "cross";
    } else {
      return undefined;
    }
  };

  return (
    <div className="half info-panel">
      <img src={logo} />
      {displayAudienceGraph && (
        <div className="lifeline-container audience-container">
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
      {displayHostAnswer && (
        <div className="lifeline-container askhost-container">
          <h1
            dangerouslySetInnerHTML={{ __html: `I think its ${askHostData}` }}
          />
        </div>
      )}

      <div>
        <button
          className={handleButtonClass(hasFiftyfiftyLifeline)}
          onClick={() => (hasFiftyfiftyLifeline ? handleFiftyFifty() : null)}
        >
          50/50
        </button>
        <button
          className={handleButtonClass(hasAskAudienceLifeline)}
          onClick={() => {
            if (hasAskAudienceLifeline) {
              handleAskAudienceDifficulty();
              setDisplayAudienceGraph(true);
              setDisplayHostAnswer(false);
            }
          }}
        >
          ask audience
        </button>
        <button
          className={handleButtonClass(hasAskHostLifeline)}
          onClick={() => {
            if (hasAskHostLifeline) {
              handleAskHostDifficulty();
              setDisplayHostAnswer(true);
              setDisplayAudienceGraph(false);
            }
          }}
        >
          ask host
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;
