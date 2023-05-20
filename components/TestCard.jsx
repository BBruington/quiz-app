import { useState, useEffect } from "react";

export default function TestCard({topic}) {

  const [end, setEnd] = useState(false)
  const [questionNum, setQuestionNum] = useState(0)
  const [score, setScore] = useState(0)
  const [toggle, setToggle] = useState(false);
  const [cardSet, setCardSet] = useState(topic);
  const [currentTestQuestion, setCurrentTestQuestion] = useState({
    question: "",
    answers:[
      "",
      "",
      "",
      "",
    ],
    correctAnswer: null,
    id: null,
  });

  useEffect(()=> {
    if (questionNum !== null) {
      const newFilteredQuestions = cardSet.filter((question, index) => {
        return index === questionNum
      });
      setCurrentTestQuestion(newFilteredQuestions[[0]]); 
    }
  }, [toggle, questionNum])

  const answer = (guess) => {
    if(currentTestQuestion.correctAnswer === guess) setScore(score + 1);
    if(questionNum < cardSet.length - 1){
      setQuestionNum(questionNum + 1);
    } else{
      setEnd(true);
    }
    
  }

  return (
    <>{cardSet.length > 0 ? (
      <>
        {end ? (
          <div>You got {score} out of {cardSet.length} correct!</div>
        )  :  (
          <>
            <div className="flex justify-between mt-10 mx-10">
              <div>Your Current Score: {score}</div> 
              <div>Question {questionNum + 1} of {cardSet.length}</div>
            </div>
            <div className="flex items-center justify-center bg-gray-200 h-80 my-20 w-10/12 mx-auto">{currentTestQuestion.question}</div>     
            
            {/* answers: */}
            <div className="grid grid-cols-1 md:grid-cols-2 my-5 w-full">
                <button className="testButton" onClick={() => answer(1)}>{currentTestQuestion.answers[0]}</button>
                <button className="testButton" onClick={() => answer(2)}>{currentTestQuestion.answers[1]}</button>
                <button className="testButton" onClick={() => answer(3)}>{currentTestQuestion.answers[2]}</button>
                <button className="testButton" onClick={() => answer(4)}>{currentTestQuestion.answers[3]}</button>
            </div>
          </>
        )}
      </>
      ) : (
        <div className="flex justify-center items-center">It seems you haven&apos;t built a quiz for this topic, please go to edit topic to create a quiz for it!</div>
    )}</>
  )
}