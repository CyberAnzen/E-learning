import QuestionInterface from "./AnswerPage/QuestionInterface";
import React from "react";

const AnswerScreen = () => {
      const [isQuestionInterfaceOpen, setIsQuestionInterfaceOpen] = useState(false);

  const openQuestionInterface = () => {
    setIsQuestionInterfaceOpen(true);
  };

  const closeQuestionInterface = () => {
    setIsQuestionInterfaceOpen(false);
  };

  return <div>AnswerScreen</div>;
};

export default AnswerScreen;
