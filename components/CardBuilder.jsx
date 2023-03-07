import { useState, useEffect } from "react";
import uuid from "react-uuid"
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { db } from "@/utils/firebase";

export default function CardBuilder() {

  const [topic, setTopic] = useState([]);
  const [selectTopic, setSelectTopic] = useState(false);
  const [currentCard, setCurrentCard] = useState({
    question: null,
    answer: null,
    id: null,
  });
  const [cardSet, setCardSet] = useState([]);

  useEffect(()=> {
    const getTopics = async () => {
        await getDocs(collection(db, "topics")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
          setTopic(newData);                
          console.log("topic", topic);
      }) 
    }
    getTopics()
  }, [])


  const addNote = async () => {
    await addDoc(collection(db, "topics", topic, "notecards"), {
      question: currentCard.question,
      answer: currentCard.answer,
      id: uuid(),
      lastModified:{
        seconds: Date.now()/1000,
        milliseconds: Date.now()
      }
    })
    cardSet.push(currentCard)
    setCurrentCard({
      question: null,
      answer: null,
      id: null
    })
  }

  const editQuestion = (event) => {
    setCurrentCard({
      question: event.target.value,
      answer: currentCard.answer,  
      id: currentCard.id? currentCard.id : uuid(),
  })}

  const editAnswer = (event) => {
    setCurrentCard({
      question: currentCard.question,
      answer: event.target.value,  
      id: currentCard.id? currentCard.id : uuid(),
  })}

  return (
    <div className="flex flex-col w-1/2 md:flex-row md:w-full">

      {!selectTopic && (<div>
        <span>Please select a topic or create a new one</span>
        <div>
          <input type="text" placeholder="create a new topic"></input>
        </div>
        {topic && topic.map((t) => (

          <div key={t.id}>
            <button>{t.id}</button> 
          </div>
        ))}
      </div>)}
      {selectTopic && (<>
        {/* Note Card Builder */}
        <main className="flex flex-col items-center w-full">
          <div className="flex flex-col mt-10 w-full md:w-4/6 items-center">
            <span className="text-sm mb-5 bg-black text-white py-2 w-full text-center rounded-sm">Insert your question:</span>
            <textarea id="question"
              onChange={editQuestion}
              className="flex mb-4 p-2 w-full h-30vh border border-black" type="text">
            </textarea>
          </div>
          <div className="flex flex-col mt-10 w-full md:w-4/6 items-center">
            <span className="text-sm my-5 bg-black text-white py-2 w-full text-center rounded-sm">Insert your answer:</span>
            <textarea 
              onChange={editAnswer}
              className="flex mb-4 p-2 w-full h-80 border border-black" type="text">
            </textarea>
          </div>
        </main>
        {/* display note */}
        <div className="flex flex-col mt-10 md:mr-10 md:w-2/6">
          <button className="mb-5 bg-black text-white py-3 px-5 rounded-md hover:bg-gray-700 whitespace-nowrap w-auto"
            onClick={addNote}>Add your notecard
          </button>
          <span className="mb-5 text-center">Here are your note cards</span>
          <span>{currentCard.question}</span>
          <span>{currentCard.answer}</span>
          <div className="flex items-center justify-center">
            { cardSet.length > 0  && cardSet.map((card, ind) => (
              <div className="flex items-center" key={card.id}>
                <button className="flex mr-2 text-center">{ind + 1}</button>
              </div>
            ))}
          </div>
        </div>
      </>)}
    </div>
  )
}