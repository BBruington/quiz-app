import { useState, useEffect } from "react";
import Link from "next/link";
import LinkToSignIn from "../../components/LinkToSignIn";
import TestCard from "../../components/TestCard";
import QuizCard from "../../components/QuizCard";
import uuid from "react-uuid"
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore"; 
import { db, getCurrentUser } from "@/utils/firebase";

export default function Test() {
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [topicData, setTopicData] = useState(null);
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

  const selectQuizOrCard = async (type) => {
    try {
      if (type === "quiz") {
        const fetchedData = await getDocs(collection(db,"users", users.email, "topics", topic, "quiz"))
        const userTopicData = fetchedData.docs.map((doc) => ({...doc.data(), id:doc.id }));
        userTopicData.sort( (a,b) => {
          return a.lastModified.milliseconds - b.lastModified.milliseconds;
        })
        setTopicData(userTopicData);
        setQuiz(true);
      }
      if (type === "card") {
        const fetchedData = await getDocs(collection(db,"users", users.email, "topics", topic, "notecards"))
        const userTopicData = fetchedData.docs.map((doc) => ({...doc.data(), id:doc.id }));
        userTopicData.sort( (a,b) => {
          return a.lastModified.milliseconds - b.lastModified.milliseconds;
        })
        setTopicData(userTopicData);
        setCard(true);
      }
    } catch(error) {
      console.error(error);
    }
  }

  const selectTopicListHandler = (top) => {
    const newTopic = String(top.id);
    setTopic(newTopic);
    setSelectTopic(true);
  }

  const selectTopicButtonHandler = async () => {
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
      {users ? (
        <>
        {topics.length === 0 && 
        <>
          <div className="flex justify-center">It seems like you don&apos;t have any topics to study. Please check out the topic builder to design your own quizes and note cards!</div>
          <Link onClick={() => checkUrl("http://localhost:3000/builder")} href="/builder" className="nav flex justify-center">Build a topic to study</Link>
        </>
        }
        { !selectTopic && !card && !quiz && (
          <div className="flex flex-col items-center justify-center whitespace-nowrap w-full mt-10">
            {topics.length !== 0 && 
            <span className="text-3xl font-bold mb-8">Please select a topic to study</span>
            }
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
          <span className="text-2xl md:text-3xl font-bold mb-8">Would you like to study with a quiz or set of note cards?</span>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-10 w-4/6 md:w-full">
              <div className="w-full">
                <button className="flex py-10 p-5 w-full justify-center text-center bg-gray-200 hover:bg-gray-300 rounded-sm" onClick={() => selectQuizOrCard("quiz")}>Quiz</button> 
              </div>
              <div className="w-full">
                <button className="flex py-10 p-5 w-full justify-center text-center bg-gray-200 hover:bg-gray-300 rounded-sm" onClick={() => selectQuizOrCard("card")}>Note Cards</button> 
              </div>
          </div>
        </div>
        )}
        {card && <QuizCard topic={topicData} />}
        {quiz && <TestCard topic={topicData} />}</>
      ) : (
      <>
        <LinkToSignIn />
      </>)}
    </div>
  )
}