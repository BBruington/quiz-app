import { useState, useEffect } from "react";
import uuid from "react-uuid"
import { collection, addDoc, getDocs, setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore"; 
import { db } from "@/utils/firebase";

export default function TestBuilder() {

  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("");
  const [selectTopic, setSelectTopic] = useState(false);
  const [cardSet, setCardSet] = useState([]);
  const [currentCard, setCurrentCard] = useState({
    question: '',
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answer: null,
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
    }
    getTopics()
  }, [selectTopic])

  return (
  <>
  </>
  )
}