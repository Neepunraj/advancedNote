
import { FormEvent, useRef, useState } from 'react'
import {Form, Col, FormGroup, FormLabel, Row, Stack, FormControl, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import { NoteData, Tag } from '../App'
import {v4 as uuidv4} from 'uuid';


type NoteformProps={
    onSubmit:(data:NoteData)=>void
    onAddTag :(tag:Tag) => void
    availableTags:Tag[]
} & Partial<NoteData>

const NoteForm = ({onSubmit, onAddTag,availableTags, title='', markdown='',tags=[]}:NoteformProps) => {
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef  = useRef<HTMLTextAreaElement>(null)
    const [selectedTags,setselectedTags]= useState<Tag[]>(tags)
    const navigate= useNavigate()

    
    const handleSubmit =(e:FormEvent)=>{
        e.preventDefault();
        onSubmit({title:titleRef.current!.value, 
            markdown:markdownRef.current!.value,
        tags:selectedTags,
    })
    navigate('..')


    }
  return (
    <Form onSubmit={handleSubmit}>
        <Stack gap={4} >
            <Row>
                <Col>
                <FormGroup controlId='title'>
                    <FormLabel>Title</FormLabel>
                    <FormControl ref={titleRef} required defaultValue={title} />

                </FormGroup>
                </Col>
                
                <Col>
                <FormGroup controlId='tags'>
                    <FormLabel>Tags</FormLabel>
                   <CreatableSelect 
                   onCreateOption={label=>{
                    const newTag = {id:uuidv4(),label}
                    onAddTag(newTag)
                    setselectedTags(prev=>{
                        return [...prev,newTag]
                    })
                   }}

                   options={availableTags.map(tag=>{
                    return {label:tag.label,value:tag.id}
                   })}
                   value={selectedTags.map(tag=>{
                    return {label:tag.label,value:tag.id}
                   })}
                   onChange={tags=>{
                    setselectedTags(tags.map(tag=>{
                        return {label:tag.label,id:tag.value}
                    }))
                   }}
                  
                 
                   isMulti />
                    
                    

                </FormGroup>
                </Col>
            </Row>
            <FormGroup controlId='markdown'>
                <FormLabel>Body</FormLabel>
                <FormControl ref={markdownRef} required  as='textarea'  rows={15} defaultValue={markdown}/>
            </FormGroup>
        </Stack>
        <Stack direction='horizontal' gap={2} className='justify-content-end mt-4'>
            <Button type='submit' variant='primary' >Save</Button>
            <Link to='..'>
            <Button type='button' variant='outline-secondary'>Cancel</Button>
            </Link>
        </Stack>
    </Form>
  )
}

export default NoteForm
