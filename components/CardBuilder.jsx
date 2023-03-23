import { useState, useEffect } from "react";
import uuid from "react-uuid"
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { db } from "@/utils/firebase";

export default function CardBuilder() {


  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [selectTopic, setSelectTopic] = useState(false);
  const [cardSet, setCardSet] = useState([]);
  const [currentCard, setCurrentCard] = useState({
    question: "",
    answer: "",
    id: null,
  });

  useEffect(()=> {
    const getTopics = async () => {
      if (!selectTopic) {
        await getDocs(collection(db, "topics")).then((querySnapshot) => {
        let newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
          setTopics(newData);                
        }) 
      }
      if (selectTopic) {
        try {
          await getDocs(collection(db, "topics", topic, "notecards")).then((querySnapshot) => {  
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

  const newNote = () => {
    setCurrentCard({
      question: "",
      answer: "",
      id: null
    })
  }

  const addNote = async (e) => {
    e.preventDefault();
    let newId;
    newId = uuid();
    if(currentCard.answer.length > 0 && currentCard.question.length > 0) {
      await setDoc(doc(db, "topics", topic, "notecards", newId), {
        question: currentCard.question,
        answer: currentCard.answer,
        id: newId,
        lastModified:{
          seconds: Date.now()/1000,
          milliseconds: Date.now()
        }
      })
      setCurrentCard({
        question: currentCard.question,
        answer: currentCard.answer,
        id: newId.toString()
      })
      cardSet.push(currentCard)
      if(currentCard.id === newId) {
        setCurrentCard({
          question: "",
          answer: "",
          id: null
        })
      }
    } else { alert("Please add a question and answer to the notecard")}
  }

  const editNote = async (e) => {
    let noteRef = doc(db, "topics", topic, "notecards", currentCard.id)
    try {
      await updateDoc(noteRef, {
        question: currentCard.question,
          answer: currentCard.answer,
          id: currentCard.id,
          lastModified:{
            seconds: Date.now()/1000,
            milliseconds: Date.now()
          }
      })
      let noteInd = cardSet.findIndex((obj => obj.id == currentCard.id))
      cardSet[noteInd].question = currentCard.question;
      cardSet[noteInd].answer = currentCard.answer;
      cardSet[noteInd].id = currentCard.id;
      setCurrentCard({
        question: "",
        answer: "",
        id: null
      })
    } catch(error) {console.error(error)}
  }
  
  const deleteNote = async (e) => {
    if(currentCard.id) {
      await deleteDoc(doc(db, "topics", topic, "notecards", currentCard.id))
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

  const selectSpecificNote = async (index) => {
    let card = cardSet[index]
    setCurrentCard(card)
  }

  const editQuestion = (event) => {
    setCurrentCard({
      question: event.target.value,
      answer: currentCard.answer,  
      id: currentCard.id
  })}

  const editAnswer = (event) => {
    setCurrentCard({
      question: currentCard.question,
      answer: event.target.value,  
      id: currentCard.id
  })}

  return (
    <div className="w-full">
      {!selectTopic && (
        <div className="flex flex-col items-center justify-center whitespace-nowrap w-full mt-10">
          <span className="text-3xl font-bold mb-8">Please select a topic or create a new one</span>
          <div className="flex mb-5">
            <input 
            onChange={createTopic} 
            type="text" placeholder="create a new topic"
            className="border-black border-2 border-solid rounded px-1"></input>
            <button className="ml-4 px-4 py-2 border-2 border-black border-solid rounded hover:bg-gray-200" onClick={selectTopicButtonHandler}>Create Topic</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-10 w-4/6 md:w-full">
            {topics && topics.map((t) => (
              <div className="w-full" key={t.id}>
                <button className="flex py-10 p-5 w-full justify-center text-center bg-gray-200 hover:bg-gray-300 rounded-sm" onClick={() => selectTopicListHandler(t)}>{t.id}</button> 
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col w-full md:flex-row items-center">
        {selectTopic && (
          <>
          <div className="flex flex-col items-center w-1/2 md:flex-row md:w-full">

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
            <div className="flex flex-col mt-10 md:mr-10 md:w-2/6 items-center">
              <div className="flex flex-col lg:flex-row lg:space-x-8 lg:mb-10">
                {currentCard.id === null ? 
                <button 
                className="button"
                onClick={addNote}>Add your notecard
                </button>
                :
                <button 
                  className="button"
                  onClick={editNote}>Edit existing notecard
                </button>
                }
                <button 
                  className="button"
                  onClick={deleteNote}>Delete your notecard
                </button>
              </div>
              <span className="mb-5 text-center">Here are your note cards</span>
              <span className="line-clamp-3">{currentCard.question}</span>
              <span className="line-clamp-3 mb-10">{currentCard.answer}</span>
              <div className="flex items-center justify-center">
                { cardSet.length > 0  && cardSet.map((card, index) => (
                  <div className="flex items-center" key={card.id}>
                    <button onClick={() => selectSpecificNote(index)} className="flex mr-2 text-center">{index + 1}</button>
                  </div>
                ))}
              </div>
              <button 
                className="button mt-12"
                onClick={newNote}>New notecard
              </button>
            </div>
          </div>
        </>
        )}
      </div>
    </div>
  )
}