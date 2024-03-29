import { useState, useEffect } from "react";
import uuid from "react-uuid";
import CardBuilder from "../../components/CardBuilder";
import TestBuilder from "../../components/TestBuilder";
import LinkToSignIn from "../../components/LinkToSignIn";
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { db, getCurrentUser } from "@/lib/firebase"; 

export default function Builder() {
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [selectTopic, setSelectTopic] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [card, setCard] = useState(false);
  const [quiz, setQuiz] = useState(false);
  const [users, setUsers] = useState(null);  

  useEffect(()=> {
    const getTopics = async () => {
      const currentUser = await getCurrentUser();
      if(currentUser !== null) {
        setUsers(currentUser)
      } else {setUsers(null)}
      if (!selectTopic && currentUser !== null) {
        await getDocs(collection(db, "users", currentUser.email, "topics")).then((querySnapshot) => {
        let newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
          setTopics(newData);                
        }) 
      }
      if (selectTopic) {
        try {
          await getDocs(collection(db,"users", currentUser.email, "topics", topic, "notecards")).then((querySnapshot) => {  
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
  }, [selectTopic, toggle])

  const selectQuizOrCard = (type) => {
    if (type === "quiz") setQuiz(true)
    if (type === "card") setCard(true)
  }

  const selectTopicListHandler = (top) => {
    const newTopic = String(top.id);
    setTopic(newTopic);
    setSelectTopic(true);
  }

  const selectTopicButtonHandler = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "users", users.email, "topics", topic,), {
      id: uuid()
    })
    setSelectTopic(true);
    setToggle(!toggle)
  }

  const createTopic = (event) => {
    const value = event.target.value;
    setTopic(value);
  }

  return (
    <div className="w-full">
      {users ? (<>
      { !selectTopic && !card && !quiz && (
        <div className="flex flex-col items-center justify-center whitespace-nowrap w-full mt-10">
          <span className="text-3xl font-bold mb-8">Please select a topic or create a new one</span>
          <form onSubmit={selectTopicButtonHandler} className="flex mb-5">
            <input 
            onChange={createTopic} 
            type="text" placeholder="create a new topic"
            className="border-black border-2 border-solid rounded px-1"></input>
            <button 
              className="ml-4 px-4 py-2 border-2 text-white bg-black border-black border-solid rounded hover:bg-gray-700" 
              type="submit">Create Topic</button>
          </form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-10 w-4/6 md:w-full">
            {topics && topics.map((t) => (
              <div className="w-full" key={t.id}>
                <button className="flex py-10 p-5 w-full justify-center text-center bg-gray-200 hover:bg-gray-300 rounded-sm" onClick={() => selectTopicListHandler(t)}>{t.id}</button> 
              </div>
            ))}
          </div>
        </div>
      )}
      {selectTopic && !card && !quiz && (
        <div className="flex flex-col items-center justify-center whitespace-nowrap w-full mt-10">
        <span className="text-2xl md:text-3xl font-bold mb-8">You have selected {topic}</span>
        <span className="text-2xl md:text-3xl font-bold mb-8">Would you like to create a quiz or set of note cards?</span>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-10 w-4/6 md:w-full">
            <div className="w-full">
              <button className="flex py-10 p-5 w-full justify-center text-center bg-gray-200 hover:bg-gray-300 rounded-sm" onClick={() => selectQuizOrCard("card")}>Note Cards</button> 
            </div>
            <div className="w-full">
              <button className="flex py-10 p-5 w-full justify-center text-center bg-gray-200 hover:bg-gray-300 rounded-sm" onClick={() => selectQuizOrCard("quiz")}>Quiz</button> 
            </div>
        </div>
      </div>
      )}
      {card && <CardBuilder topic={topic} topics={topics} />}
      {quiz && <TestBuilder topic={topic} topics={topics} />}
      </>) : (<>
        <LinkToSignIn />
      </>)}
    </div>
  )
}