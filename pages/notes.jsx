import ReactMarkdown from "react-markdown"
import NoteMain from '../components/myNotes/noteMain';
import uuid from 'react-uuid';
import { useState, useEffect } from 'react';
import { addDoc, updateDoc, doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
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
        const currentUser = await getCurrentUser(); 
        if(currentUser) {
          setUsers(currentUser);
          await getDocs(collection(db, "users", currentUser.email, "notebook")).then((querySnapshot) => {
            let newData = querySnapshot.docs.map((doc) => ({...doc.data(), id:doc.id }));
            newData = newData.sort( (a,b) => {
              return b.lastModified.milliseconds - a.lastModified.milliseconds
            })
            if(newData) {
              setEmailNotes(newData);
            }
          })
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
  }

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  const deleteNote = async (e) => {
    if(activeNote.id) {
      await deleteDoc(doc(db,"users", users.email, "notebook", activeNote.id))
      let objInd = emailNotes.findIndex((obj) => obj.id === activeNote.id)
      if(objInd > -1) {
        emailNotes.splice(objInd, 1);
      }
      setActiveNote({
        title: "Please select a new note",
        body: "",
        id: null
      })
    }
  }
  const saveNote = async (updatedNote) => {
    console.log(updatedNote)
    if(activeNote.id) {
      if(emailNotes) {
        const updatedNotesArray = {
          id: activeNote.id,
          body: activeNote.body,
          title: activeNote.title,
          lastModified:{
            seconds: activeNote.lastModified.seconds,
            milliseconds: activeNote.lastModified.milliseconds
          }
        }
        const noteDoc = await doc(db,"users", users.email, "notebook", activeNote.id)
        await updateDoc(noteDoc, updatedNotesArray);

      setActiveNote(updatedNotesArray)
      }
    }
    setAddNoteToggle(!addNoteToggle)
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
    await setDoc(doc(db, "users", users.email, "notebook", newId), newNote)
    emailNotes.unshift(newNote)
    setActiveNote(newNote)
    setAddNoteToggle(!addNoteToggle)
  }

  

  const updateNote = async (updatedNote) => {
    if(emailNotes) {
      const updatedNotesArray = {
        id: updatedNote.id,
        body: updatedNote.body,
        title: updatedNote.title,
        lastModified:{
          seconds: updatedNote.lastModified.seconds,
          milliseconds: updatedNote.lastModified.milliseconds
        }
      }
      setActiveNote(updatedNotesArray)
    }
    setAddNoteToggle(!addNoteToggle)
  }

  return (
    <>
      <div className="flex justify-start">
        <div className="w-2/6 overflow-auto border-r-2 border-r-gray-200 border-b-2 border-t-2 h-[90vh]">
          <div className="flex justify-between p-4">
            <h1 className="text-xl md:text-3xl font-bold items-center text tracking-tight text-gray-900 mt-1 md:m-0">Notes</h1>
            <div className="flex flex-cols md:flex-row  ml-2">
              <button onClick={handleEditMode} className="text-green-700 hover:text-green-500 font-bold lg:mr-5 text-center text-sm sm:text-base">Edit Note</button>
              <button onClick={addNote} className="text-teal-600 hover:text-teal-400 font-bold ml-1 text-center text-sm sm:text-base">Add Note</button>
            </div>
          </div>
          <div className="app-sidebar-notes">

            {/* clickable notes */}

            {(emailNotes.map((note, index) => (
              <div key={note.id} className="p-4 cursor-pointer hover:bg-gray-200" onClick={() => handleNoteOnClick(index)}>
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-xs md:text-md leading-3">{note.title}</strong> 
                    <ReactMarkdown className="text-xs md:text-sm ">{note.body && note.body.substr(0, 25) + '...'}</ReactMarkdown>

                    <small className="font-light block text-xs">last modified: {new Date(note.lastModified.seconds * 1000).toLocaleDateString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    </small>
                  </div>
                  <div className="mt-2 ml-1 flex flex-col space-y-4 md:space-y-0 md:flex-row items-center justify-center">
                    <button onClick={() => saveNote(note.id)} className="text-green-700 hover:text-green-500 md:mr-2 font-bold text-sm sm:text-base">Save</button>
                    <button onClick={() => deleteNote(note.id)} className="text-orange-700 hover:text-orange-500 font-bold text-sm sm:text-base">Delete</button>
                  </div>
                </div>
              </div>
            )))}

          </div>
        </div>
          <NoteMain 
          activeNote={activeNote}
          updateNote={updateNote}
          editMode={editMode}          
          />
      </div>
    </>
  )
}