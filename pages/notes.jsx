import NoteSideBar from '../components/myNotes/noteSideBar';
import NoteMain from '../components/myNotes/noteMain';
import uuid from 'react-uuid';
import { useState, useEffect } from 'react';
import { addDoc, updateDoc, doc, setDoc, getDocs } from 'firebase/firestore';
import { getCurrentUser, db } from "../utils/firebase";
import useSWR from 'swr';

const fetcher = () => fetch(url).then(res => res.json())
export default function Notes() {

  const [users, setUsers] = useState(null)
  const [emailNotes, setEmailNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(false);
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
        const currentUser = await getCurrentUser();   
        if(currentUser) {
          setUsers(currentUser);
          const notebook = await getDocs(db, "users", currentUser.email, "notebook")
          if(notebook.length === 0) {
            const newId = uuid()
            await setDoc(db, "users", currentUser.email, "notebook", newId, {
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
        }else {setEmailNotes(defaultEmailNotes)}
      } catch (error) {
        console.error("error: ", error)
      }
    }

    getNotes();
  },[]) 

  const deleteNote = async (idToDelete) => {
    if(emailNotes[0]) {
      const updatedNotesArray = [{
        email: emailNotes[0].email,
        id: emailNotes[0].id,
        notes:
        emailNotes[0].notes.filter((note) => {return note.id !== idToDelete})
      }]
        setEmailNotes(updatedNotesArray)
        const noteDoc = doc(db,"users", users.email, "notebook", emailNotes[0].id)
        await updateDoc(noteDoc, updatedNotesArray[0])
    }
  }

  const addNote = async () => {

    const newNote = {
      title: "Untitled Note",
      body: "",
      id: uuid(),
      lastModified: {
        seconds: Date.now()/1000,
        milliseconds: Date.now()
      }
    };
    const addedNote = emailNotes;
    addedNote[0].notes.unshift(newNote)

    setEmailNotes(addedNote)
    setAddNoteToggle(!addNoteToggle)
    
    const noteDoc = doc(db,"users", users.email, "notebook", emailNotes[0].id)
    await updateDoc(noteDoc, addedNote[0])
   }

  const updateNote = async (updatedNote) => {
    if(emailNotes[0]) {
      const updatedNotesArray = [{
        email: emailNotes[0].email,
        id: emailNotes[0].id,
        notes:
        emailNotes[0].notes.map((note) => {
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
    if(emailNotes[0]){
      const activeNoteListener = emailNotes[0].notes.find((note) => note.id === activeNote);
      return activeNoteListener
    }
  }

  return (
    <>
    
      <div className="flex justify-start">
          <NoteSideBar 
          emailNotes={emailNotes} 
          addNote={addNote} 
          deleteNote={deleteNote} 
          activeNote={activeNote}
          setActiveNote={setActiveNote}
          editMode={editMode}
          setEditMode={setEditMode}
          />
          <NoteMain 
          activeNote={getActiveNote()}
          updateNote={updateNote}
          editMode={editMode}          
          />
      </div>
    </>
  )
}