import { useState, useEffect } from "react";
import {getDocs, collection} from "firebase/firestore"; 
import { db, getCurrentUser} from "@/utils/firebase";

export default function TestCard({topic}) {

  const [end, setEnd] = useState(false)
  const [questionNum, setQuestionNum] = useState(0)
  const [score, setScore] = useState(0)
  const [toggle, setToggle] = useState(false);
  const [cardSet, setCardSet] = useState(topic);
  const [currentTestQuestions, setCurrentTestQuestions] = useState({
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
      if(newFilteredQuestions !== 0){
        setCurrentTestQuestions(newFilteredQuestions); 
      } else {
        setQuestionNum(0);
      }
    }
  }, [toggle, questionNum])

  const answer = (guess) => {
    if(currentTestQuestions.correctAnswer === guess) setScore(score + 1);
    if(questionNum < cardSet.length){
      setQuestionNum(questionNum + 1);
    } else{
      setEnd(true);
    }
    
  }

  return (
    <>
      {end ? (
        <div>You got {score} out of {cardSet.length} correct!</div>
      )  :  (
        <>
          <div className="flex justify-between mt-10 mx-10">
            <div>Your Current Score: {score}</div>
            <div>Question {questionNum + 1} of {cardSet.length}</div>
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