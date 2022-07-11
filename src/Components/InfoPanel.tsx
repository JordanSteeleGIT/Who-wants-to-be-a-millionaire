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

  const handleAskHostDifficulty = () => {
    //Switch statement for each question difficulty
    let randomNumber = randombetween(0, 1);
    switch (data[currentQuestion].difficulty) {
      case "easy":
        return handleAskHost(randomNumber, 0.85);
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
      setAskHostData(
        data[currentQuestion].all_answers[
          randomExcluded(0, 3, indexOfCorrectAnswer)
        ]
      );
    }
  };

  useEffect(() => {
    console.log(askHostData);
  }, [askHostData]);

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
  const calculateAudienceAnswers = (
    allAnswersArray: any,
    bias: number[],
    amountOfResponses: number
  ) => {
    //Sums return value from biasRandomSelection
    let newArr = ["A", "B", "C", "D"];
    let audienceAnswers: AskAudienceType = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    };
    for (let i = 0; i < amountOfResponses; i++) {
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
          audienceProbability,
          30
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
          audienceProbability,
          30
        )
      );
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
      <img src="./images/whowants.png" />
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
