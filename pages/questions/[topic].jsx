import QuizCard from "@/components/QuizCard";
import {getDocs, collection} from "firebase/firestore"; 
import { db } from "@/utils/firebase";

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
    const fetchedData = await getDocs(collection(db,"users", "psychological_chemist@hotmail.com", "topics", params.topic, "notecards"))
    const userTopicData = fetchedData.docs.map((doc) => ({...doc.data(), id:doc.id }));
    userTopicData.sort( (a,b) => {
      return a.lastModified.milliseconds - b.lastModified.milliseconds
    })
    return { props: { data: userTopicData ? userTopicData : {}, }, };

  } catch(error) {
    console.error(error);
  }
}

export async function getStaticPaths() {  
  let userTopicsData;
  await getDocs(collection(db, "users", "psychological_chemist@hotmail.com", "topics")).then((querySnapshot) => {
    const fetchedData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
    userTopicsData = fetchedData;
  }) 

  const paths = userTopicsData?.map( (top) => {
    return {
      params: 
      { 
        topic: top.id.toString()  
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}