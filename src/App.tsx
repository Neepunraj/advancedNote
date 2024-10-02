import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Route, Routes } from "react-router-dom";

import { Container } from "react-bootstrap";
import { useLocalStorage } from "./utils/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import NoteList from "./components/NoteList";
import NewNote from "./components/NewNote";
import NoteLayout from "./components/NoteLayout";
import NoteShow from "./components/NoteShow";
import EditNote from "./components/EditNote";

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};
export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidv4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevnote) => {
      return prevnote.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function onDelete(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }
  function onUpdateTag(id:string, label:string){
    setTags(prevtags=>{
      return prevtags.map(tag=> {
        if(tag.id== id){
          return {...tag,label }
        }
        else {
          return tag
        }
      })

    })

  }
  function onDeleteTag(id:string){
    setTags(prevTags=>{
      return prevTags.filter(tag=> tag.id !== id)
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<NoteList 
            availableTags={tags} 
          notes={notesWithTags}
          onUpdateTag={onUpdateTag} 
          onDeleteTag={onDeleteTag} />}
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<NoteShow onDelete={onDelete}  />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="#" element={<Navigate to="/" />} />
        <Route />
      </Routes>
    </Container>
  );
}

export default App;
