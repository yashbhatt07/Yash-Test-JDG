import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Card, Row, Col, Button,OverlayTrigger } from "react-bootstrap"; 
import "./UserProfile.css";
import Edit from "../../pencil.png";
import Modal from "react-bootstrap/Modal";
import Tooltip from "react-bootstrap/Tooltip";
import like from "../../like.png";
import unLike from "../../unlike.png";
import commentSection from "../../comment-section.png";
import remove from "../../remove.png";

const UserProfile = () => {
  const getRandomLightColor = () => {
    const letters = "ABCDEF";
    const color =
      "#" +
      Array.from(
        { length: 3 },
        () => letters[Math.floor(Math.random() * 6)]
      ).join("");
    return color;
  };
  const posts = useSelector(state => state.posts);
  const allUsers = useSelector(state => state.users);

  console.log("UserProfile -> posts", posts)
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [isNameHovered, setIsNameHovered] = useState(false);
  const myPost = posts.filter(post => post?.ownerId == userData?.id);
  console.log("UserProfile -> myPost", myPost)
  const [newUserName, setNewUserName] = useState(userData.userName);
  const [isModalOpen, setIsModalOpen] = useState(false);
const dispatch = useDispatch()

  console.log("Only My Post", myPost);


  const handleEditConfirm = () => {
    if (newUserName.length>=15) {
      return
    }else{

      dispatch({
        type: "UPDATE_USER_NAME",
        payload: {
          userId: userData.id,
          newName: newUserName
        }
      });
      dispatch({
        type: "UPDATE_USER_NAME_IN_POSTS",
        payload: {
          userId: userData.id,
          newName: newUserName
        }
      });
      const updatedData = JSON.stringify({
        email: userData?.email,
        userName: newUserName,
        id: userData?.id,
      });
      localStorage.setItem("userData", updatedData);
  
      setIsModalOpen(false);
    }
  };
  const handleOpenCommentBox = (postId) => {
    console.log("handleOpenCommentBox -> postId", postId)
    dispatch({
      type: "OPEN_COMMENT_MODAL",
      payload: {
        comment_modal:{
           show:true,
           postId: postId, 

         }
      }
  });
  };

  const handleLikeClick = postId => {
    dispatch({
      type: "ADD_LIKES",
      payload: {
        postId,
        likerId: userData.id
      }
    });
  };

  const deleteHandler = (postId) => {
    dispatch({
      type: "DELETE_POST",
      payload: {
        postId
      }
    });
  };
  return (
    <div className="text-white ">
      <div className="user_profile d-flex">
        <div className="user_profile_photo d-flex justify-content-center">
          <span className="m-auto">{userData?.userName?.substr(0, 1)}</span>
        </div>
        <div className="user_profile_details"   onMouseEnter={() => setIsNameHovered(true)}
            onMouseLeave={() => setIsNameHovered(false)}>
          <span
          
          >
            {userData?.userName}
          </span>
          {isNameHovered && (
          <img src={Edit} width={30} alt="edit" className="mb-4 ms-2" onClick={()=>setIsModalOpen(true)}/>
          )}
        </div>
      </div>
      <hr />

      <div className="text-white mx-4">
        <h3 className="ms-2">Post</h3>

        <Row className="justify-content-center">
          {myPost.map(post => {
            const headerBackgroundColor = getRandomLightColor();
            const bodyBackgroundColor = getRandomLightColor();
            const name = allUsers.find((user)=>user.id===post.ownerId)

            const isLikedByUser = post?.likes?.includes(userData.id);
            return (
              <Col key={post.postId} xs={12} md={6} lg={4}>
                <Card
                  style={{ width: "100%" }}
                  className="main-card mb-2 mx-auto mt-2"
                >
                  <Card.Header
                    className="card-header d-flex justify-content-between"
                    style={{ backgroundColor: headerBackgroundColor }}
                  >
                  <span>

                    {name?.userName || "userName"}
                  </span>
                  <div className="pb-3">
                  <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>{isLikedByUser ? "Undo" : "Like"}</Tooltip>}
              >
                <img
                  src={isLikedByUser ? like : unLike}
                  width={45}
                  alt="like"
                  className="mt-1"
                  onClick={() => handleLikeClick(post.postId)}
                />
              </OverlayTrigger>{" "}
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Comments</Tooltip>}
              >
                <img
                  src={commentSection}
                  width={30}
                  alt="commentSection"
                  onClick={() => handleOpenCommentBox(post.postId)}
                />
              </OverlayTrigger>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>delete</Tooltip>}
              >
                <img
                  src={remove}
                  width={30}
                  alt="Delete"
                  className="ms-2"
                  onClick={()=>deleteHandler(post.postId)}
                />
              </OverlayTrigger>
                  </div>
                  </Card.Header>
                  <Card.Body
                    className="card-body"
                    style={{ backgroundColor: bodyBackgroundColor }}
                  >
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.body}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Name</Modal.Title>
        </Modal.Header>
        <Form>
        <Modal.Body>
        <Form.Control
                  type="text"
                  placeholder="Enter New userName"
                  className="m-2"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="btn" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" className="btn" disabled={newUserName.length<=0 || !newUserName.trim() || newUserName.length>15} onClick={handleEditConfirm}>
            Save Changes
          </Button>
        </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
