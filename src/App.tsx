import React, { useState, useEffect } from "react";
import { Question, FullQuestions } from "./Types/QuizTypes";
import { shuffleArray } from "./Utils/Utils";
import axios, { AxiosResponse } from "axios";

import GameInterface from "./Components/GameInterface";
import "./App.css";
const App = () => {
  const [data, setData] = useState<FullQuestions[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  //If the game is lost we need to show a scren with "play again" and reset all state to initialstate
  const [isGameLost, setIsGameLost] = useState<boolean>(false);

  const apiCall = () => {
    setLoading(true);
    setData([]);
    let easy =
      "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple";
    let medium =
      "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple";
    let hard =
      "https://opentdb.com/api.php?amount=5&difficulty=hard&type=multiple";
    axios
      .all([axios.get(easy), axios.get(medium), axios.get(hard)])
      .then(
        axios.spread((...reponse: AxiosResponse[]) => {
          reponse.map((individualReponse: AxiosResponse) => {
            individualReponse.data.results.map((results: Question) => {
              setData((oldArray: FullQuestions[]) => [
                ...oldArray,
                {
                  ...results,
                  all_answers: shuffleArray([
                    ...results.incorrect_answers,
                    results.correct_answer,
                  ]),
                },
              ]);
            });
          });
        })
      )
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isGameLost) {
      //on game restart, reset all states to initial state
      setData([]);
    }
  }, [isGameLost]);

  return (
    <section>
      {gameStarted && !loading ? (
        <GameInterface
          data={data}
          setData={setData}
          setIsGameLost={setIsGameLost}
          isGameLost={isGameLost}
          apiCall={apiCall}
        />
      ) : (
        <div className="centered-container">
          <div className="centered-wrapper">
            {loading && <h1>Game Starting</h1>}
            {!gameStarted && (
              <>
                <h1>Play</h1>
                <button
                  onClick={() => {
                    setGameStarted(true);
                    apiCall();
                  }}
                >
                  Start Game
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default App;
