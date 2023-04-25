import QuizCard from "@/components/QuizCard";
import {getDocs, collection} from "firebase/firestore"; 
import { db, getCurrentUser } from "@/utils/firebase";

export default function Topic({data}) {

  return (
    <>
      <div className="flex items-center justify-center">
        <QuizCard 
          topic={data}
        />
      </div>
    </>
  )
}

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  try {
    const data = await getDocs(collection(db,"users", "psychological_chemist@hotmail.com", "topics", params.topic, "notecards"))
      const newData = data.docs.map((doc) => ({...doc.data(), id:doc.id }));
      newData.sort( (a,b) => {
        return a.lastModified.milliseconds - b.lastModified.milliseconds
      })
        return { props: { data: newData ? newData : {}, }, };

  } catch(error) {
    console.error(error);
  }
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