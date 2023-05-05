import { useState, useEffect } from "react";
import uuid from "react-uuid"
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { db, getCurrentUser } from "@/utils/firebase";

export default function TestBuilder({topic}) {
  const [users, setUsers] = useState(null)
  const [answerNum, setAnswerNum] = useState(1);
  const [toggle, setToggle] = useState(false);
  const [answerValue, setAnswerValue] = useState("");
  const [cardSet, setCardSet] = useState([]);
  const [currentCard, setCurrentCard] = useState({
    question: '',
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
      await getDocs(collection(db, "users", currentUser.email, "topics", topic, "quiz")).then((querySnapshot) => {  
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

  const switchAnswer = (card, index) => {
    if(card) {
      setCurrentCard({
        question: currentCard.question,
        answers:[
          currentCard.answers[0],
          currentCard.answers[1],
          currentCard.answers[2],
          currentCard.answers[3],
        ],
        correctAnswer: index + 1,
        id: currentCard.id
      })
    } else {
      if(index+1 !== answerNum) {
        setAnswerNum(index+1)
        setAnswerValue(currentCard.answers[index])
      }
    }
  }

  const editQuestion = (event) => {
    setCurrentCard({
      question: event.target.value,
      answers:[
        currentCard.answers[0],
        currentCard.answers[1],
        currentCard.answers[2],
        currentCard.answers[3],
      ],
      correctAnswer: currentCard.correctAnswer,
      id: currentCard.id
    })
  }
  const editAnswer = (event) => {
    setAnswerValue(event.target.value)
    switch (answerNum) {
      case 1:
        setCurrentCard({
          question: currentCard.question,
          answers:[
            event.target.value,
            currentCard.answers[1],
            currentCard.answers[2],
            currentCard.answers[3],
          ],
          correctAnswer: currentCard.correctAnswer,
          id: currentCard.id
        })
        break;
      case 2:
        setCurrentCard({
          question: currentCard.question,
          answers:[
            currentCard.answers[0],
            event.target.value,
            currentCard.answers[2],
            currentCard.answers[3],
          ],
          correctAnswer: currentCard.correctAnswer,
          id: currentCard.id
        })
        break;
      case 3:
        setCurrentCard({
          question: currentCard.question,
          answers:[
            currentCard.answers[0],
            currentCard.answers[1],
            event.target.value,
            currentCard.answers[3],
          ],
          correctAnswer: currentCard.correctAnswer,
          id: currentCard.id
        })
        break;
      case 4:
        setCurrentCard({
          question: currentCard.question,
          answers:[
            currentCard.answers[0],
            currentCard.answers[1],
            currentCard.answers[2],
            event.target.value,
          ],
          correctAnswer: currentCard.correctAnswer,
          id: currentCard.id
        })
        break;
    }
  }

  const confirmTestCard = async () => {
    let newId;
    newId = uuid();
    await setDoc(doc(db, "users", users.email, "topics", topic, "quiz", newId), {
      question:currentCard.question,
      answers:[
        currentCard.answers[0],
        currentCard.answers[1],
        currentCard.answers[2],
        currentCard.answers[3],
        
      ],
      id: newId,
      correctAnswer: currentCard.correctAnswer,
      lastModified:{
        seconds: Date.now()/1000,
        milliseconds: Date.now()
      }
    })
    setCurrentCard({
      question: '',
      answers:[
        "",
        "",
        "",
        "",
      ],
      correctAnswer: null,
      id: null,
    })
    setToggle(!toggle)
    setAnswerNum(1)
    setAnswerValue("")
  }

  const selectSpecificNote = async (index) => {
    let card = cardSet[index]
    setCurrentCard(card)
    setAnswerNum(1)
    setAnswerValue(cardSet[index].answers[0])
  }

  const addNewQuizCard = async (e) => {
    e.preventDefault();
    let newId;
    newId = uuid();
    await setDoc(doc(db, "users", users.email, "topics", topic, "quiz", newId), {
      question: '',
      answers:[
        "",
        "",
        "",
        "",
      ],
      correctAnswer: null,
      id: newId,
      lastModified:{
        seconds: Date.now()/1000,
        milliseconds: Date.now()
      }
    })
    setCurrentCard({
      question: "",
      answer: "",
      answers:[
        "",
        "",
        "",
        "",
      ],
      correctAnswer: null,
      id: newId,
    })
    setCardTrigger(!toggle)
  }

  const deleteQuizCard = async (e) => {
    if(currentCard.id) {
      await deleteDoc(doc(db,"users", users.email, "topics", topic, "quiz", currentCard.id))
      let objInd = cardSet.findIndex((obj) => obj.id === currentCard.id)
      if(objInd > -1) {
        cardSet.splice(objInd, 1);
      }
      setCurrentCard({
        question: "",
        answer: "",
        id: null
      })
    }
  }

  return (
    <>
  <div className="flex flex-col items-center justify-center">
    <span className="text-sm mb-5 bg-black text-white py-2 w-full text-center rounded-sm md:w-4/6">The questions in this test:</span>
    <div className="flex items-center justify-center">
      { cardSet.length > 0  && cardSet.map((card, index) => (
        <div className="flex items-center" key={card.id}>
          <button onClick={() => selectSpecificNote(index)} className="flex mr-2 text-center">{index + 1}</button>
        </div>
      ))}
    </div>
  </div>
      {/* Note Card Builder */}
      <main className="flex flex-col items-center w-full">
        <div className="flex flex-col mt-10 w-full md:w-4/6 items-center">
          <span className="text-sm mb-5 bg-black text-white py-2 w-full text-center rounded-sm">Insert your question:</span>
          <textarea 
            value={currentCard.question}
            id="question"
            onChange={editQuestion}
            className="flex mb-4 p-2 w-full h-30vh border border-black" type="text">
          </textarea>
        </div>
        <div className="flex flex-col mt-5 md:mt-10 w-full md:w-4/6 items-center">
          <span className="text-sm my-5 bg-black text-white py-2 w-full text-center rounded-sm">Edit your answer for: answer {answerNum}</span>
          <div className="space-x-7 mb-5">
            {currentCard.answers.map((card, index) => (
              <span onClick={() => switchAnswer(false, index)} className="cursor-pointer hover:underline" key={index}>{index + 1}</span> 
            ))}
          </div>
          {/* (currentCard.question[answerNum - 1] */}
          <textarea 
            onChange={editAnswer}
            value={answerValue}
            className="flex mb-4 p-2 w-full h-80 border border-black" type="text">
          </textarea>
          <span className="text-sm my-5 bg-black text-white py-2 w-full text-center rounded-sm">Select the correct answer</span>
          <div className="space-x-7 mb-5">
            {currentCard.answers.map((card, index) => (
              <span onClick={() => switchAnswer(true, index)} className={`cursor-pointer hover:underline text-xl ${index+1 == currentCard.correctAnswer ? 'underline' : ''}`} key={index}>{index + 1}</span> 
            ))}
          </div>
        </div>
        <button onClick={confirmTestCard} className="button md:w-4/6">Confirm Changes</button>
        <button onClick={addNewQuizCard} className="button md:w-4/6">Add a New Question</button>
      </main>
    </>
  )
}