import React, { FC, useEffect, useState } from "react";

import { FullQuestions } from "../Types/QuizTypes";
import { shuffleArray, randombetween } from "../Utils/Utils";
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
    let numbers = generateRandom(index);
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
  const handleAskHostDifficulty = () => {
    //Switch statement for each question difficulty
    let randomNumber = randombetween(0, 1);
    switch (data[currentQuestion].difficulty) {
      case "easy":
        return handleAskHost(randomNumber, 0.95);
      case "medium":
        return handleAskHost(randomNumber, 0.75);
      case "hard":
        return handleAskHost(randomNumber, 0.65);
      default:
        return handleAskHost(randomNumber, 0.75);
    }
  };

  const randomExcluded = (
    min: number,
    max: number,
    excluded: number
  ): number => {
    var n = Math.floor(Math.random() * (max - min) + min);
    if (n >= excluded) n++;
    return n;
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
            randomExcluded(0, 3, indexOfCorrectAnswer)
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

  const handleAskAudienceDifficulty = () => {
    //Switch statement for each question difficulty
    let randomNumber = randombetween(0, 1);
    switch (data[currentQuestion].difficulty) {
      case "easy":
        return handleAskAudience(randomNumber, 0.91);
      case "medium":
        return handleAskAudience(randomNumber, 0.85);
      case "hard":
        return handleAskAudience(randomNumber, 0.7);
      default:
        return handleAskAudience(randomNumber, 0.85);
    }
  };

  const randomIntExcludingArray = (
    min: number,
    max: number,
    exclude: number[]
  ): number => {
    const nums = [];
    for (let i = min; i <= max; i++) {
      if (!exclude.includes(i)) nums.push(i);
    }

    const randomIndex = Math.floor(Math.random() * nums.length);
    return nums[randomIndex];
  };

  const handleAudienceWrongAnswersCount = (numberOfCorrectAnswers: number) => {
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
      //in here check if 50/50 has been used
      for (let i = 0; i < 30 - numberOfCorrectAnswers; i++) {
        //rolls i times and picks a random number thats not the correct answer
        tempAudienceAnswers[
          lookUpArray[randomExcluded(0, 3, indexOfCorrectAnswer)]
        ] += 1;
      }
    } else {
      let invalidAnswers =
        fiftyFiftyData.removedAnswers.concat(indexOfCorrectAnswer);
      tempAudienceAnswers[
        lookUpArray[randomIntExcludingArray(0, 3, invalidAnswers)]
      ] = 30 - numberOfCorrectAnswers;
    }
    tempAudienceAnswers[lookUpArray[indexOfCorrectAnswer]] =
      numberOfCorrectAnswers;
    setAskAudienceData(tempAudienceAnswers);
  };

  const randomInteger = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleAskAudience = (randomNumber: number, threshold: number) => {
    setHasAskAudienceLifeline(false);
    //Function indentifies if audience is going to be correct and what to do with the result
    if (randomNumber < threshold) {
      let correctAnswers = randomInteger(16, 25);
      handleAudienceWrongAnswersCount(correctAnswers);
      //audience is correct
    } else {
      //audience is wrong
      let correctAnswers = randomInteger(6, 12);
      handleAudienceWrongAnswersCount(correctAnswers);
    }
  };

  const handleButtonClass = (lifeLineState: boolean) => {
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
