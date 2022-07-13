import React, { FC, useEffect, useState } from "react";
import { FullQuestions } from "../Types/QuizTypes";
import InfoPanel from "./InfoPanel";
import QuestionsPanel from "./QuestionsPanel";
import Scoreboard from "./Scoreboard";
import MenuScreen from "./MenuScreen";
import { scoreboardData } from "../Utils/Utils";

type InterfaceProps = {
  data: FullQuestions[];
  setData: React.Dispatch<React.SetStateAction<FullQuestions[]>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  isGameOver: boolean;
  apiCall: () => void;
};

const GameInterface: FC<InterfaceProps> = ({
  data,
  setData,
  setIsGameOver,
  isGameOver,
  apiCall,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [disabledAnswers, setDisabledAnswers] = useState<number[]>([]);

  const handleDisabledButtons = (array: number[]): void => {
    setDisabledAnswers(array);
  };
  useEffect(() => {
    setDisabledAnswers([]);
  }, [currentQuestion]);

  return (
    <>
      {!isGameOver ? (
        <>
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
                setIsGameOver={setIsGameOver}
                isGameOver={isGameOver}
              />
            </div>
          </div>
        </>
      ) : (
        <MenuScreen
          title={currentQuestion < 14 ? "You just lost" : "You won"}
          currentQuestion={
            currentQuestion < 14 ? currentQuestion - 1 : currentQuestion
          }
        >
          <button
            onClick={() => {
              setIsGameOver(false);
              apiCall();
            }}
          >
            Play Again
          </button>
        </MenuScreen>
      )}
    </>
  );
};

export default GameInterface;
