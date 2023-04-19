import { useState, useEffect } from "react";
import { db, getCurrentUser} from "@/utils/firebase";

export default function TestCard() {

  const [end, setEnd] = useState(false)
  const [questionNum, setQuestionNum] = useState(0)
  const [score, setScore] = useState(0)
  const [testQuestions, setTestQuestions] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [cardSet, setCardSet] = useState([]);
  const [users, setUsers] = useState(null);
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
    const getTopics = async () => {
      try {
        const currentUser = await getCurrentUser();
        if(users === null && currentUser !== null ) {
            setUsers(currentUser)
        }
        await getDocs(collection(db, "users", users.email, "topics", topic, "quiz")).then((querySnapshot) => {  
          let newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
          newData = newData.sort( (a,b) => {
            return a.lastModified.milliseconds - b.lastModified.milliseconds
          })
          if(newData) {
            setCardSet(newData); 
          }
        }) 
      } catch (error) {console.error(error)} 
    }
    getTopics()
  }, [toggle])

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