import { Link } from 'react-router-dom';
import styles from '../utils/card.module.css'
import { Badge, Card, CardBody, Stack } from "react-bootstrap";
import { Tag } from '../App';

type SimplifiedNote={
    id:string;
    title:string;
    tags:Tag[]
}

const Notecard = ({id,title,tags}:SimplifiedNote) => {
    console.log(tags)
  return (
    <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none mt-4 ${styles.card}`}>
        <CardBody>
          <Stack gap={2} className="align-items-center justify-content-center h-100">
            <span className="fs-5">{title}</span>
            {
                tags.length>0 && (
                    <Stack gap={2} direction='horizontal' className='align-items-center flex-wrap'>
                        {
                            tags.map(tag=>(
                                <Badge className='text-truncate' key={tag.id}>
                                    {tag.label}
                                </Badge>
                            ))
                        }

                    </Stack>
                )

            }
           

          </Stack>
          
        </CardBody>
      </Card>
  )
}
export default Notecard

