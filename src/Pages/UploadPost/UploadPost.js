import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { closeModal } from "../redux/actions";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import axios from "axios";


const UploadPost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [titleError, setTitleError] = useState("");
  const show = useSelector(state => state.modal.show);
  console.log("UploadPost -> show", show)
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("userData"));


  const handleClose = () => {
    dispatch({
      type: "CLOSE_MODAL",
      payload: {
        modal: {
          show: false
        }
      }
    });
  };

  const UploadPostHandler = async e => {
    e.preventDefault();

    if (!title.trim() && !description.trim()) {
      setError("Please Enter Both");
      return;
    } else {
      setError("");
    }
    if (!title.trim()) {
      setTitleError("Please Enter Title");
      return;
    } else if (title.length > 0) {
      setTitleError("");
    } else if (title.length > 20) {
      setTitleError("Title Length Must Less Then 20 Characters");
      return;
    } else {
      setTitleError("");
    }

    if (!description.trim()) {
      setDescriptionError("Please Enter Description");
      return;
    } else if (description.length > 0) {
      setDescriptionError("");
    } else if (description.length > 100) {
      setTitleError("Title Length Must Less Then 100 Characters");
      return;
    } else {
      setDescriptionError("");
    }
    try {
    await axios.post("https://jsonplaceholder.typicode.com/posts",{
            postId: Math.random(),
                ownerId: userData.id,
                title: title,
                body: description,
                userName:userData?.userName || "",
                token:userData?.token

        });
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts");

                
    dispatch({
        type: "STORE_POST",
        payload: {
            postId: Math.random(),
            ownerId: userData.id,
            title: title,
            body: description,
            userName:userData?.userName || "",
            token:userData?.token

        }
    });
    


handleClose()
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };
  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Post</Modal.Title>
        </Modal.Header>
        <Form onSubmit={UploadPostHandler}>
          <Modal.Body>
            <Form.Group controlId="text" className="mb-4">
              <Form.Label className="text-dark">Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title Here"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <span className="text-danger">{titleError}</span>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label className="text-dark">Description</Form.Label>
              <Form.Control
                as="textarea" rows={3} 
                placeholder="Enter Description Here"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              
              <span className="text-danger">{descriptionError}</span>
            </Form.Group>
           
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <span className="text-danger">{error}</span>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UploadPost;
