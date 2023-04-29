import TestCard from "../../components/TestCard"
import {getDocs, collection} from "firebase/firestore"; 
import { db, getCurrentUser } from "@/utils/firebase"; 

export default function Topic({data}) {

  return (
    <div className="flex items-center justify-center">
      <TestCard 
        topic={data}
      />
    </div>
  )
}

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  // const currentUser = await getCurrentUser() 
  const data = await getDocs(collection(db,"users", "psychological_chemist@hotmail.com", "topics", params.test, "quiz"))
  const newData = data.docs.map((doc) => ({...doc.data(), id:doc.id }));
    newData.sort( (a,b) => {
      return b.lastModified.milliseconds - a.lastModified.milliseconds
    })
  return { props: { data: newData ? newData : {}, }, };
}

export async function getStaticPaths() {  
  let data;
  //const currentUser = await getCurrentUser()
  await getDocs(collection(db,"users", "psychological_chemist@hotmail.com", "topics")).then((querySnapshot) => {
    const newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
      data = newData                
    }) 

  const paths = data.map( (s) => {
    return {
      params: 
      { 
        test: s.id.toString()  
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}