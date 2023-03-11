import { useState, useEffect } from "react";
import uuid from "react-uuid"
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore"; 
import { db } from "@/utils/firebase";

export default function CardBuilder() {

  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectTopic, setSelectTopic] = useState(false);
  const [currentCard, setCurrentCard] = useState({
    question: "",
    answer: "",
    id: null,
  });
  const [cardSet, setCardSet] = useState([]);

  useEffect(()=> {
    const getTopics = async () => {
      if (!selectTopic) {
        await getDocs(collection(db, "topics")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
          setTopics(newData);                
        }) 
      }
      if (selectTopic) {
        try {
          await getDocs(collection(db,"topics", topic, "notecards")).then((querySnapshot) => {  
            const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
            if(newData) {
              setCardSet(newData); 
            }
          }) 
        } catch (error) {console.error(error)} 
      }
    }
    getTopics()
  }, [selectTopic])

  const selectTopicListHandler = (top) => {
    const newTopic = String(top.id);
    setTopic(newTopic);
    setSelectTopic(true);
  }

  const selectTopicButtonHandler = async () => {
    await setDoc(doc(db, "topics", topic,), {
      id: uuid()
    })
    setSelectTopic(true);
  }

  const createTopic = (event) => {
    const value = event.target.value;
    setTopic(value);
  }

  const addNote = async (e) => {
    e.preventDefault();
    if(currentCard.answer.length > 0 && currentCard.question.length > 0) {
      const data = await addDoc(collection(db, "topics", topic, "notecards"), {
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
        question: "",
        answer: "",
        id: null
      })
    } else { alert("Please add a question and answer to the notecard")}
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
    <div className="flex flex-col w-full md:flex-row items-center">

      {!selectTopic && (
        <div>
          <span>Please select a topic or create a new one</span>
          <form className="flex">
            <input onChange={createTopic} type="text" placeholder="create a new topic"></input>
            <button onSubmit={selectTopicButtonHandler}>Create Topic</button>
          </form>
          {topics && topics.map((t) => (
            <div key={t.id}>
              <button onClick={() => selectTopicListHandler(t)}>{t.id}</button> 
            </div>
          ))}
        </div>
      )}

      {selectTopic && (
      <>
        <form onSubmit={addNote} className="flex flex-col items-center w-1/2 md:flex-row md:w-full">
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
              <span className="text-sm my-5 bg-black text-white py-2 w-full text-center rounded-sm">Insert your answer:</span>
              <textarea 
                value={currentCard.answer}
                onChange={editAnswer}
                className="flex mb-4 p-2 w-full h-80 border border-black" type="text">
              </textarea>
            </div>
          </main>

          {/* display note */}
          <div className="flex flex-col mt-10 md:mr-10 md:w-2/6">
            <button 
              type="submit"
              className="mb-5 bg-black text-white py-3 px-5 rounded-md hover:bg-gray-700 whitespace-nowrap w-auto"
              onClick={addNote}>Add your notecard
            </button>
            <span className="mb-5 text-center">Here are your note cards</span>
            <span className="line-clamp-3">{currentCard.question}</span>
            <span className="line-clamp-3 mb-10">{currentCard.answer}</span>
            {/* <span>Topic: {topic && topic}</span> */}
            <div className="flex items-center justify-center">
              { cardSet.length > 0  && cardSet.map((card, index) => (
                <div className="flex items-center" key={card.id}>
                  <button className="flex mr-2 text-center">{index + 1}</button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </>
      )}
    </div>
  )
}