import QuizCard from "@/components/QuizCard";
import {getDocs, collection} from "firebase/firestore"; 
import { db, getCurrentUser } from "@/utils/firebase";

export default function Topic({data}) {

  return (
    <div className="flex items-center justify-center">
      <QuizCard 
        topic={data}
      />
    </div>
  )
}

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  let notes;
  const data = await getDocs(collection(db,"users", "psychological_chemist@hotmail.com", "topics", params.topic, "notecards"))
  .then((querySnapshot) => {  
    let newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
    newData = newData.sort( (a,b) => {
      return b.lastModified.milliseconds - a.lastModified.milliseconds
    })
    if(newData) {
      notes = newData; 
    }
  }) 
  return { props: { data: notes ? notes : {}, }, };
}

export async function getStaticPaths() {  
  let data;
  await getDocs(collection(db, "users", "psychological_chemist@hotmail.com", "topics")).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
      data = newData                
  }) 

  const paths = data?.map( (s) => {
    return {
      params: 
      { 
        topic: s.id.toString()  
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}