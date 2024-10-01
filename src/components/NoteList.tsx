import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
 
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Stack,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import {  Tag } from "../App";
import Notecard from "../utils/Notecard";


type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
};
type SimplifiedNote = {
  id: string;
  title: string;
  tags: Tag[];
};

const NoteList = ({ availableTags, notes }: NoteListProps) => {
  const { id } = useParams();
  const [selectedTags, setSelecetedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
          (selectedTags.length === 0 || selectedTags.every(tag=> note.tags.some(noteTag=> noteTag.id === tag.id)))
        
      );
    });
  }, [notes, selectedTags, title]);

 
  return (
    <>
      <Row>
        <Col className="">
          <h1>Lists</h1>
        </Col>
        <Col xs="auto">
          <Stack direction="horizontal" gap={2}>
            <Link to={"/new"}>
              <Button variant="primary">Create</Button>
            </Link>
            <Button variant="outline-danger">Delete</Button>
            <Link to={`/${id}/edit`}>
              <Button variant="outline-secondary">Edit</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <form>
        <Row>
          <Col>
            <FormGroup controlId="title">
              <FormLabel>Title</FormLabel>
              <FormControl
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup controlId="tags">
              <FormLabel>Tags</FormLabel>
              <ReactSelect
                isMulti
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelecetedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
              />
            </FormGroup>
          </Col>
        </Row>
      </form>
     
      <Row xs={1} md={2} lg={3} xl={4} className="g-3">
        {filteredNotes.map((note) => (
          
          <Col key={note.id}>
            
            <Notecard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default NoteList;
