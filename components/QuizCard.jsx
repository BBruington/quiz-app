import { useState, useEffect } from "react";


export default function QuizCard({topic}) {

  const [currentQuestion, setCurrentquestion ] = useState(null)
  const [ showAnswer, setShowAnswer ] = useState(false);
  const [ questionNum, setQuestionNum ] = useState(1);

  useEffect(() => {
    const newFilteredQuestions = topic.questions.filter((question) => {
      return question.number === questionNum
    });
    console.log("new question: ", newFilteredQuestions)
    if(newFilteredQuestions != 0){
      setCurrentquestion(newFilteredQuestions);
    } else {
      setQuestionNum(1)
    }
  }, [questionNum]);

  const showAnswerHandler = () => {
    setShowAnswer(!showAnswer);
  }

  const questionNumHandler = () => {
    setQuestionNum(questionNum + 1)
  }
  
  return (
    <>
      <div className="h-80 flex flex-col items-center justify-center mt-20">
        {currentQuestion && currentQuestion.map( (currentQuestion) => (
          <div className="" key={currentQuestion.number}>
            <div className="flex py-20 px-5 mt-40 items-center justify-center h-80 w-full bg-sky-300 rounded">


              { showAnswer ? 
                <div>{currentQuestion.answer}</div> 
                :
                <div>{currentQuestion.question}</div>
              }

            </div>
            <div className="flex pt-20">
              { showAnswer ? 
                <button onClick={showAnswerHandler} className="py-3 px-5 border-solid border-2 hover:bg-sky-500 bg-sky-300 border-sky-500 rounded">Show Question</button>
                :
                <button onClick={showAnswerHandler} className="py-3 px-5 border-solid border-2 hover:bg-sky-500 bg-sky-300 border-sky-500 rounded">Show Answer</button>
              }

              <button onClick={questionNumHandler} className="ml-10 py-3 px-5 justify-end border-solid border-2 hover:bg-sky-500 bg-sky-300 border-sky-500 rounded">Next Question</button>

            </div>
          </div>
        ))}
      </div>
    </>
  )
}