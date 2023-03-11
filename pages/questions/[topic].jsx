import QuizCard from "@/components/QuizCard";
import {getDocs, collection} from "firebase/firestore"; 
import { db } from "@/utils/firebase";

export default function Topic({data}) {
  console.log("topic client: ", data)
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
  console.log("params: ", params)
  let notes;
  const data = await getDocs(collection(db,"topics", params.topic, "notecards")).then((querySnapshot) => {  
    const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
    if(newData) {
      notes = newData; 
    }
  }) 
  console.log("notes: ", notes)
  // const sess = await prisma.sessionTest.findMany();
  // const findSessionNumById = sess.find((s) => {
  //   return (
  //     s.session.toString() == params.session //dynamic id
  //   )
  // });
  return { props: { data: notes ? notes : {}, }, };
}

export async function getStaticPaths() {  
  let data;
  await getDocs(collection(db, "topics")).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
      data = newData                
    }) 

  const paths = data.map( (s) => {
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