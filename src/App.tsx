import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigate, Route, Routes } from 'react-router-dom'


import { Container } from 'react-bootstrap'
import { useLocalStorage } from './utils/useLocalStorage'
import { useMemo } from 'react'
import {v4 as uuidv4} from 'uuid';
import NoteList from './components/NoteList'
import NewNote from './components/NewNote'

export type Note ={
  id:string
}& NoteData
export type RawNote={
  id:string
} & RawNoteData

export type RawNoteData={
  tile:string;
  markdown:string;
  tagIds:string[]


}

export type NoteData={
  title:string
  tags:Tag[]
  markdown:string

}
export type Tag={
  id:string;
  label:string;
}


function App() {
  const [notes,setNotes]= useLocalStorage<RawNote[]>('NOTES',[])
  const [tags,setTags] = useLocalStorage<Tag[]>('TAGS',[])
  const notesWithTags = useMemo(()=>{
    return notes.map(note=>{
      return {...notes,tags:tags.filter(tag=> note.tagIds.includes(tag.id))}
    })

  },[notes,tags])


  function onCreateNote ({tags,...data}:NoteData){
    setNotes(prevNotes=>{
      return [...prevNotes,{...data,id:uuidv4,tagIds:tags.map(tag=>tag.id)}]
    })

  }

  function addTag(tag:Tag){
    setTags(prev=> [...prev,tag])
  }

  return (
    <Container className='my-4'>
    <Routes>
      <Route path='/' element={<NoteList availableTags={tags} notes={notes}/>} />
      <Route path='/new' element={<NewNote 
      onSubmit={onCreateNote}
      onAddTag={addTag}
      availableTags={tags}
       />} />
      <Route path='/:id' >
      <Route index element={<h1>Show</h1>} />
      <Route path='edit' element={ <h1>Edit</h1>}/>
      </Route>
      <Route path='#' element={<Navigate to='/'/>} />
      <Route />

    </Routes>
    </Container>
  )
}

export default App
