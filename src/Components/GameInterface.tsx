import React, { FC, useEffect, useState } from "react";
import { FullQuestions } from "../Types/QuizTypes";
import InfoPanel from "./InfoPanel";
import QuestionsPanel from "./QuestionsPanel";
import Scoreboard from "./Scoreboard";

type InterfaceProps = {
  data: FullQuestions[];
  setData: React.Dispatch<React.SetStateAction<FullQuestions[]>>;
  setIsGameLost: React.Dispatch<React.SetStateAction<boolean>>;
  isGameLost: boolean;
  apiCall: () => void;
};

const GameInterface: FC<InterfaceProps> = ({
  data,
  setData,
  setIsGameLost,
  isGameLost,
  apiCall,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [disabledAnswers, setDisabledAnswers] = useState<number[]>([]);

  const handleDisabledButtons = (array: number[]): void => {
    setDisabledAnswers(array);
  };

  return (
    <>
      {!isGameLost ? (
        <div className="game-container">
          <div className="game-wrapper">
            <InfoPanel
              setData={setData}
              data={data}
              currentQuestion={currentQuestion}
              handleDisabledButtons={handleDisabledButtons}
            />
            <Scoreboard currentQuestion={currentQuestion} />
            <QuestionsPanel
              data={data}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              disabledAnswers={disabledAnswers}
              setIsGameLost={setIsGameLost}
              isGameLost={isGameLost}
            />
          </div>
        </div>
      ) : (
        <div className="centered-container">
          <div className="centered-wrapper">
            <h1>You lost, congrats !!!!</h1>
            <button
              onClick={() => {
                setIsGameLost(false);
                apiCall();
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GameInterface;
