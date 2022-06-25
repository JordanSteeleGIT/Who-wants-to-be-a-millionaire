import React, { useState, useEffect } from "react";
import { Question, FullQuestions } from "./Types/QuizTypes";
import { shuffleArray } from "./Utils/Utils";
import axios, { AxiosResponse } from "axios";
import QuestionsScreen from "./Components/QuestionsScreen";

const App = () => {
  const [data, setData] = useState<FullQuestions[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const apiCall = async () => {
    setLoading(true);
    let easy =
      "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple";
    let medium =
      "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple";
    let hard =
      "https://opentdb.com/api.php?amount=5&difficulty=hard&type=multiple";
    const data2 = await axios
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
    console.log(data);
  }, [data]);

  return (
    <>
      <div>
        {loading && <h1>loading</h1>}
        {gameStarted && !loading && <QuestionsScreen data={data} />}
        <button
          onClick={() => {
            apiCall();
            setGameStarted(true);
          }}
        >
          Start Game
        </button>
      </div>
    </>
  );
};

export default App;
