import Link from "next/link";
import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore"; 
import { db } from "@/utils/firebase";


export default function Questions() {
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

  return (
    <>
      <span className="flex justify-center mt-10">What topic would you like to study? </span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-10">
        {!selectTopic && (
          <>
            {topics && topics.map((t) => (
              <Link key={t.id} className="flex py-10 justify-center text-center bg-gray-200 hover:bg-gray-300 p-5 rounded-sm" href={`questions/${t.id}`}>
                {t.id}
              </Link>
            ))}
          </>
        )}
      </div>
    </>
  )
}