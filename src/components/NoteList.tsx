import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
  Row,
  Stack,
} from "react-bootstrap";
import { Link} from "react-router-dom";
import ReactSelect from "react-select";
import { Tag } from "../App";
import Notecard from "../utils/Notecard";

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag:(id:string)=>void
onUpdateTag:(id:string,label:string)=> void
};
type SimplifiedNote = {
  id: string;
  title: string;
  tags: Tag[];
};
type TagsmodalProps = {
  availableTags: Tag[];
  show: boolean;
  handleClose:()=> void;
};
function EditTagsModal({ availableTags, show , handleClose, onUpdateTag,onDeleteTag}: TagsmodalProps) {
  return(
   <Modal show={show} onHide={handleClose}>
    <ModalHeader closeButton>
      <ModalTitle>Edit Tags</ModalTitle>
    </ModalHeader>
    <ModalBody>
      <Form>
        <Stack gap={2}>
          {availableTags.map((tag) => (
            <Row key={tag.id}>
              <Col>
              <FormControl type="text" value={tag.label} onChange={e=> onUpdateTag(tag.id,e.target.value)} /> 
              </Col>
              <Col xs="auto">
                <Button variant="outline-danger" onClick={()=>onDeleteTag(tag.id)}>&times;</Button>
              </Col>
            </Row>
          ))}
        </Stack>
      </Form>
    </ModalBody>
  </Modal>)
}

const NoteList = ({ availableTags, notes, onDeleteTag, onUpdateTag }: NoteListProps) => {
  const [selectedTags, setSelecetedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [showModal, setshowModal] = useState(false);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === "" ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((tag) =>
            note.tags.some((noteTag) => noteTag.id === tag.id)
          ))
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

            <Button variant="outline-secondary" onClick={()=>setshowModal(true)}>Edit Tags</Button>
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
      <EditTagsModal 
      onDeleteTag={onDeleteTag}
      onUpdateTag={onUpdateTag}
      availableTags={availableTags} show={showModal} handleClose={()=>setshowModal(false)} />
    </>
  );
};

export default NoteList;
