import { useState } from "react";


export default function QuizCard() {

  const [ showAnswer, setShowAnswer ] = useState(false);

  const showAnswerHandler = () => {
    setShowAnswer(!showAnswer);
  }
  
  return (
    <>
      <div className="h-80 w-1/2 flex flex-col items-center justify-center">
        <div className="flex py-20 mt-40 items-center justify-center h-80 w-full bg-sky-300 rounded">
          { showAnswer ? 
            <div>this is a good answer for a card</div> 
            :
            <div>What would be a great test question for my cards?</div>
          }

        </div>
        <div className="flex pt-20">
          { showAnswer ? 
            <button onClick={showAnswerHandler} className="py-3 px-5 border-solid border-2 hover:bg-sky-500 bg-sky-300 border-sky-500 rounded">Show Question</button>
            :
            <button onClick={showAnswerHandler} className="py-3 px-5 border-solid border-2 hover:bg-sky-500 bg-sky-300 border-sky-500 rounded">Show Answer</button>
          }

          <button className="ml-10 py-3 px-5 justify-end border-solid border-2 hover:bg-sky-500 bg-sky-300 border-sky-500 rounded">Next Question</button>

        </div>
        
      </div>
    </>
  )
}