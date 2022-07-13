import React, { FC } from "react";
import { scoreboardData } from "../Utils/Utils";

type MenuScreenProps = {
  children: React.ReactNode;
  title: string;
  currentQuestion?: number;
};

const MenuScreen: FC<MenuScreenProps> = ({
  children,
  title,
  currentQuestion,
}) => {
  return (
    <div className="centered-container">
      <div className="centered-wrapper">
        <img src="./images/whowants.png" />
        <h1>{title}</h1>
        {currentQuestion != null && <h2>{scoreboardData[currentQuestion]}</h2>}

        {children}
      </div>
    </div>
  );
};

export default MenuScreen;
