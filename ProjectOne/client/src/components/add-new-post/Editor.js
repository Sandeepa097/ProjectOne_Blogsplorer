import React, {useState, useEffect} from "react";
import CustomFileUpload from "../common/CustomFileUpload";
import ReactQuill from "react-quill";
import { Card, CardBody, Form, FormInput } from "shards-react";
import { AddPostStore } from "../../flux";

import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

const Editor = ({post, setPost}) => {
  const [title, setTitle] = useState(AddPostStore.getPost().title)
  const [backgroundImage, setBackgroundImage] = useState(AddPostStore.getPost().backgroundImage)
  const [body, setBody] = useState(AddPostStore.getPost().body)
  const [preview, setPreview] = useState({
    image: !AddPostStore.getPost().backgroundImage ? '' : AddPostStore.getPost().backgroundImage
  })

  useEffect(() => {
    AddPostStore.addChangeListener(setDetails)
    setPost({...post, title: title, backgroundImage: backgroundImage, body: body})

    return() => AddPostStore.removeChangeListener(setDetails)
  }, [title, backgroundImage, body])

  const setDetails = () => {
    const details = AddPostStore.getPost()
    setTitle(details.title)
    setBackgroundImage(details.backgroundImage)
    setBody(details.body)
    setPreview({...preview, image: !details.backgroundImage ? '' : details.backgroundImage})
  }

  const onChangeContent = (html) => {
    setBody(html)
  }
  const onChangeTitle = (text) => {
    setTitle(text)
  }
  const chooseImage = (event) => {
    if(!event.target.files[0]){
      return null
    }
    setBackgroundImage(event.target.files[0])
    setPreview({...preview, image: URL.createObjectURL(event.target.files[0])})
  }
  const closeImage = (e) => {
    setBackgroundImage(null)
    setPreview({...preview, image: ''})
  }

  return(
    <Card small className="mb-3">
    <CardBody>
      <Form className="add-new-post">
        <FormInput size="lg" 
                  className="mb-3" 
                  value={title}
                  placeholder="Your Post Title" 
                  onChange={e => onChangeTitle(e.target.value)}
                  />
          <CustomFileUpload chooseImage={(e) => chooseImage(e)} text="Select Background Image..." />
          {preview.image && <div>
            <img src={preview.image} alt = "" width="50px" height="50px" />
            <button onClick={(e) => closeImage(e)}><span>&times;</span></button>
          </div>}
        <br />
        <ReactQuill className="add-new-post__editor mb-1" 
                    value = {body}
                    placeholder="Type Your Content Here..." 
                    modules= {{
                      toolbar: {
                        container: [
                          [{'header': [1, 2, 3, false]}],
                          ['bold', 'italic', 'underline'],
                          [{'list': 'ordered'}, {'list': 'bullet'}],
                          [{'align': ''}, {'align': 'right'}, {'align': 'center'}, {'align': 'justify'}],
                          [{'color': []}]
                        ]
                      }
                    }} 
                    onChange = {onChangeContent} />
      </Form>
    </CardBody>
  </Card>
  )
};

export default Editor;
