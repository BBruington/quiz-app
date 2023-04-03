import { useState, useEffect } from "react";
import uuid from "react-uuid"
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { db } from "@/utils/firebase";

export default function TestBuilder() {
  const [answerNum, setAnswerNum] = useState(1);
  const [cardSet, setCardSet] = useState([]);
  const [currentCard, setCurrentCard] = useState({
    question: '',
    answers: {
      1:"",
      2:"",
      3:"",
      4:"",
    },
    answer: null,
    id: null,
  });

  useEffect(()=> {
    const getTopics = async () => {
      try {
        await getDocs(collection(db, "topics", topic, "quiz")).then((querySnapshot) => {  
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
  }, [])

  const editAnswer = (ansNum, event) => {
    setCurrentCard({
      question: currentCard.question,
      answer: currentCard.answer,
      id: currentCard.id
    })
    if (ansNum !== 4) {
      setAnswerNum(answerNum + 1)
    } else { setAnswerNum(1)}
  }

  return (
    <>
      {/* Note Card Builder */}
      <main className="flex flex-col items-center w-full">
        <div className="flex flex-col mt-10 w-full md:w-4/6 items-center">
          <span className="text-sm mb-5 bg-black text-white py-2 w-full text-center rounded-sm">Insert your question:</span>
          <textarea 
            value={currentCard.question}
            id="question"
            // onChange={editQuestion}
            className="flex mb-4 p-2 w-full h-30vh border border-black" type="text">
          </textarea>
        </div>
        <div className="flex flex-col mt-5 md:mt-10 w-full md:w-4/6 items-center">
          <span className="text-sm my-5 bg-black text-white py-2 w-full text-center rounded-sm">Insert your answer for: answer {answerNum}</span>
          <textarea 
            onChange={() => editAnswer(answerNum)}
            className="flex mb-4 p-2 w-full h-80 border border-black" type="text">
          </textarea>
        </div>
      </main>
    </>
  )
}