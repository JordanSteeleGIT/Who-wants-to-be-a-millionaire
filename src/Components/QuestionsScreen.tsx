import React, { FC } from "react";
import { FullQuestions } from "../Types/QuizTypes";

type IProps = {
  data?: FullQuestions[];
};
const QuestionsScreen: FC<IProps> = ({ data }) => {
  return (
    <div>
      {data?.map((data) => {
        return (
          <div className="hello">
            <h1 dangerouslySetInnerHTML={{ __html: data.question }} />
            <h2 dangerouslySetInnerHTML={{ __html: data.correct_answer }} />
            {data.all_answers.map((answer) => {
              return <button dangerouslySetInnerHTML={{ __html: answer }} />;
            })}
          </div>
        );
      })}
      <h1>rendered</h1>
    </div>
  );
};

export default QuestionsScreen;
