import { useState, useEffect } from "react";


export default function QuizCard({topic}) {
  const [ cardSet, setCardSet ] = useState(topic);
  const [ updateCards, setUpdateCards ] = useState(false);
  const [ currentQuestion, setCurrentquestion ] = useState(null);
  const [ showAnswer, setShowAnswer ] = useState(false);
  const [ questionNum, setQuestionNum ] = useState(0);

  useEffect(() => {
    if (questionNum !== null) {
      const newFilteredQuestions = cardSet.filter((question, index) => {
        return index === questionNum
      });
      if(newFilteredQuestions !== 0){
        setCurrentquestion(newFilteredQuestions); 
      } else {
        setQuestionNum(0);
      }
    }
  }, [questionNum, updateCards]);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];

        // Swap
        array[i] = array[j];
        array[j] = temp;
    }
    setCardSet(array);
    if ( questionNum === 0){
      setUpdateCards(!updateCards);
    } else (setQuestionNum(0))
};

  const showAnswerHandler = () => {
    setShowAnswer(!showAnswer);
  }

  const specificQuestionHandler = (num) => {
    setShowAnswer(false);
    setQuestionNum(num);
  }

  const nextQuestionHandler = () => {
    setShowAnswer(false);
    if (questionNum + 1 < topic.length) {
      setQuestionNum(questionNum + 1);
    } else setQuestionNum(0)
  }
  
  return (
    <>{cardSet.length > 0 ? (
      <><div className="flex flex-col items-center justify-center max-w-3xl">
        {currentQuestion && currentQuestion.map( (currentQuestion) => (
          <div className="flex flex-col" key={currentQuestion.number}>
            <div className="flex justify-center mt-20 pb-10 text-lg font-bold">Question {questionNum + 1}</div>
            <div className="flex px-5 mt-5 items-center justify-center h-80 w-full bg-sky-300 rounded">

              { showAnswer ? 
                <div>{currentQuestion.answer}</div> 
                :
                <div>{currentQuestion.question}</div>
              }

            </div>
            <div className="flex justify-center pt-20">
              { showAnswer ? 
                <button onClick={showAnswerHandler} className="py-3 px-5 border-solid border-2 hover:bg-sky-400 active:bg-sky-500 bg-sky-300 border-sky-500 rounded">Show Question</button>
                :
                <button onClick={showAnswerHandler} className="py-3 px-5 border-solid border-2 hover:bg-sky-400 active:bg-sky-500 bg-sky-300 border-sky-500 rounded">Show Answer</button>
              }

              <button onClick={nextQuestionHandler} className="ml-10 py-3 px-5 border-solid border-2 hover:bg-sky-500 bg-sky-300 border-sky-500 rounded">Next Question</button>
              <button onClick={() => shuffle(cardSet)} className="ml-10 py-3 px-5 border-solid border-2 hover:bg-sky-500 bg-sky-300 border-sky-500 rounded">Shuffle Questions</button>
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-10 text-lg">Select a specific question:</div>
        <div className="flex justify-center mt-5">
          {topic && topic.map( (top, index) => (
            <div key={index} className="flex">
              <span onClick={() => specificQuestionHandler(index)} className="mx-2 text-sm hover:underline cursor-pointer">{index + 1} </span>
            </div>
          ))}
        </div>
      </div></>
    ) : (
      <div className="flex justify-center items-center">It seems you haven&apos;t built a set of notecards for this topic, please go to edit topic to create a set!</div>
    )}</>
  )
}