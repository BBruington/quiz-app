import { useState, useEffect } from "react";

export default function TestCard() {

  const [end, setEnd] = useState(false)
  const [questionNum, setQuestionNum] = useState(0)
  const [score, setScore] = useState(0)
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentTestQuestions, setCurrentTestQuestions] = useState({
    question: "",
    answerOne: "",
    answerTwo: "",
    answerThree: "",
    answerFour: "",
    correct: null,
  });

  const answer = (guess) => {
    if(currentTestQuestions.correct === guess) setScore(score + 1);
    if(questionNum < testQuestions.length){
      setQuestionNum(questionNum + 1);
    } else{
      setEnd(true);
    }
    
  }

  return (
    <>
      {end ? (
        <div>You got {score} out of {testQuestions.length} correct!</div>
      )  :  (
        <>
          <div className="flex justify-between mt-10 mx-10">
            <div>Your Current Score: {score}</div>
            <div>Question {questionNum} of {testQuestions.length}</div>
          </div>
          <div className="flex items-center justify-center bg-gray-200 h-80 my-20 w-10/12 mx-auto">This is where the question would be asked?</div>      
          
          {/* answers: */}
          <div className="grid grid-cols-1 md:grid-cols-2 my-5 w-full">
              <button className="testButton" onClick={() => answer(1)}>answer 1</button>
              <button className="testButton" onClick={() => answer(2)}>answer 2</button>
              <button className="testButton" onClick={() => answer(3)}>answer 3</button>
              <button className="testButton" onClick={() => answer(4)}>answer 4</button>
          </div>
        </>
      )}
    </>
  )
}