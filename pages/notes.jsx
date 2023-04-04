import ReactMarkdown from "react-markdown"
import NoteMain from '../components/myNotes/noteMain';
import uuid from 'react-uuid';
import { useState, useEffect } from 'react';
import { addDoc, updateDoc, doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { getCurrentUser, db } from "../utils/firebase";
import useSWR from 'swr';

const fetcher = () => fetch(url).then(res => res.json())
export default function Notes() {

  const [users, setUsers] = useState(null)
  const [emailNotes, setEmailNotes] = useState([]);
  const [activeNote, setActiveNote] = useState({});
  const [addNoteToggle, setAddNoteToggle] = useState(false);
  const [editMode, setEditMode] = useState(false);
  //const { data, error, isLoading } = useSWR('/api/getUserNotesData', fetcher);

  const defaultEmailNotes = {
    title:'Remember to sign in to save your notes',
    body:'',
    id:uuid(),
    lastModified:{
      seconds: Date.now()/1000,
      milliseconds: Date.now()
    }
  }

  useEffect(() => {
    const getNotes = async () => {  
      try{
        console.log("start")
        const currentUser = await getCurrentUser();   
        console.log(currentUser)
        if(currentUser) {
          setUsers(currentUser);
          let notebook = await getDocs(collection(db, "users", currentUser.email, "notebook")).then((querySnapshot) => {
            let newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
            newData = newData.sort( (a,b) => {
              return a.lastModified.milliseconds - b.lastModified.milliseconds
            })
            console.log(querySnapshot)
            console.log(newData)
            if(newData.length !== 0) {
              setEmailNotes(newData); 
            }
          }) 
          console.log(notebook)
          if(newData.length === 0) {
            const newId = uuid()
            await setDoc(doc(db, "users", currentUser.email, "notebook", newId), {
                id: newId,
                title:'Untitled Note',
                body:'',
                id:uuid(),
                lastModified:{
                  seconds: Date.now()/1000,
                  milliseconds: Date.now()
                }
            })
          }
        }else {setActiveNote(defaultEmailNotes)}
      } catch (error) {
        console.error("error: ", error)
      }
    }

    getNotes();
  },[addNoteToggle]) 

  const handleNoteOnClick = (index) => {
    let currentNote = emailNotes[index]
    setActiveNote(currentNote)
    console.log(activeNote)
  }

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  const deleteNote = async (e) => {
    if(activeNote.id) {
      await deleteDoc(doc(db,"users", users.email, "topics", topic, "notecards", activeNote.id))
      let objInd = cardSet.findIndex((obj) => obj.id === activeNote.id)
      if(objInd > -1) {
        cardSet.splice(objInd, 1);
      }
      setActiveNote({
        question: "",
        answer: "",
        id: null
      })
    }
  }

  const addNote = async (e) => {
    e.preventDefault();
    let newId;
    newId = uuid();
    const newNote = {
      title: "Untitled Note",
      body: "",
      id: newId,
      lastModified: {
        seconds: Date.now()/1000,
        milliseconds: Date.now()
      }
    };
    emailNotes.unshift(newNote)
    setActiveNote(newNote)
    await setDoc(doc(db, "users", users.email, "topics", topic, "notecards", newId), newNote)
    setAddNoteToggle(!addNoteToggle)
  }

  

  const updateNote = async (updatedNote) => {
    if(emailNotes) {
      const updatedNotesArray = [{
        email: updatedNote.email,
        id: updatedNote.id,
        notes:
        activeNote.notes.map((note) => {
        if(note.id === activeNote) {
          return updatedNote;
        }
        return note;
      })}]
      setEmailNotes(updatedNotesArray)
      const noteDoc = doc(db,"users", users.email, "notebook", emailNotes[0].id)
      await updateDoc(noteDoc, updatedNotesArray[0])
    }
  }

  const getActiveNote = () => {
      const activeNoteListener = emailNotes[0].notes.find((note) => note.id === activeNote);
      return activeNoteListener
  }

  return (
    <>
      <div className="flex justify-start">
      <>
      <div className="w-2/6 overflow-auto border-r-2 border-r-gray-200 border-b-2 h-90v">
        <div className="flex justify-between p-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl m-0">Notes</h1>
          <div className="sm:ml-6">
            <button onClick={handleEditMode} className="text-green-700 hover:text-green-500 font-bold lg:mr-5">Edit Note</button>
            <button onClick={addNote} className="text-teal-600 hover:text-teal-400 font-bold">Add Note</button>
          </div>
        </div>
        <div className="app-sidebar-notes">
          {emailNotes[0] && (emailNotes.map((note, index) => (
            <div key={note.id} className="p-4 cursor-pointer hover:bg-gray-200" onClick={() => handleNoteOnClick(index)}>
              <div className="flex justify-between">
                <div>
                  <strong>{note.title}</strong> 
                  <ReactMarkdown className="">{note.body && note.body.substr(0, 50) + '...'}</ReactMarkdown>

                  <small className="font-light block">last modified: {new Date(note.lastModified.seconds * 1000).toLocaleDateString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  </small>
                </div>
                  <div className="mt-2">
                    <button onClick={() => deleteNote(note.id)} className="text-orange-700 hover:text-orange-500 font-bold">Delete</button>
                  </div>
              </div>
            </div>
          )))}
        </div>

      </div>
    </>
          <NoteMain 
          activeNote={activeNote}
          updateNote={updateNote}
          editMode={editMode}          
          />
      </div>
    </>
  )
}