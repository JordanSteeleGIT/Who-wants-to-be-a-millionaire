import React, { useState, useEffect } from "react";
import { Question, FullQuestions } from "./Types/QuizTypes";
import { shuffleArray } from "./Utils/Utils";
import axios, { AxiosResponse } from "axios";
import MenuScreen from "./Components/MenuScreen";

import GameInterface from "./Components/GameInterface";
import "./App.css";
const App = () => {
  const [data, setData] = useState<FullQuestions[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const apiCall = () => {
    setLoading(true);

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
    if (isGameOver) {
      setData([]);
    }
  }, [isGameOver]);

  return (
    <section>
      {gameStarted && !loading ? (
        <GameInterface
          data={data}
          setData={setData}
          setIsGameOver={setIsGameOver}
          isGameOver={isGameOver}
          apiCall={apiCall}
        />
      ) : (
        <MenuScreen title={!loading ? "Play" : "Game Starting"}>
          {!loading && (
            <button
              onClick={() => {
                setGameStarted(true);
                apiCall();
              }}
            >
              Start Game
            </button>
          )}
        </MenuScreen>
      )}
    </section>
  );
};

export default App;
