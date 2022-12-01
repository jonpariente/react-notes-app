import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"

export default function App() {

    const [notes, setNotes] = React.useState(() => {
        return JSON.parse(localStorage.getItem('notes')) || []
    })

    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    React.useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes])


    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }

    function updateNote(text) {
        // Re-arrange notes to show first the one that is being edited
        setNotes(oldNotes => {
            const newNotes = [];
            for (const note of oldNotes.values()) {
                note.id === currentNoteId
                ? newNotes.unshift({...note, body: text})
                : newNotes.push(note)
            }

            return newNotes
        })

        // Another way of rearranging notes
        // setNotes(oldNotes => {
        //     const newNotes = oldNotes.filter(note => {
        //         return note.id !== currentNoteId
        //     })
        //     newNotes.unshift({...findCurrentNote(), body: text})
        //     return newNotes
        // })
        
        // Doesn't rearrange the notes in the sidebar
        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }

        //         : oldNote
        // }))
    }

    function deleteNote(event, noteId) {
        event.stopPropagation();
        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={findCurrentNote()}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={findCurrentNote()}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}
