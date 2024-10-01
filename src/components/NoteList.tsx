import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
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
import styles from "../utils/card.module.css"

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
        selectedTags.length === 0 || selectedTags.every(tag=> note.tags.some(noteTag=> noteTag.id === tag.id))
      );
    });
  }, [notes, selectedTags, title]);

  function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
      <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none mt-4 ${styles.card}`}>
        <CardBody>
          <Stack gap={2} className="align-items-center justify-content-center h-100">
            <span className="fs-5">{title}</span>
            {
              tags.length >0 && (
                <Stack gap={2} direction="horizontal" className="justify-content-center flex-wrap">
                  {
                    tags.map(tag =>(
                      <Badge key={tag.id} className="text-truncate">
                        {tag .label}

                      </Badge>
                    ))
                  }

                </Stack>

              )
            }

          </Stack>
        </CardBody>
      </Card>
    );
  }
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
              <Button variant="outine-secondary">Edit</Button>
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
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default NoteList;
