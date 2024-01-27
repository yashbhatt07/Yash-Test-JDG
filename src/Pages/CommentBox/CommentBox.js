import React, { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useSelector, useDispatch } from "react-redux";
import "./CommentBox.css";
import axios from "axios";
import { Form, Button, Row, Col } from "react-bootstrap";
import { getToken } from "@firebase/messaging";
import { messaging } from "../../Firebase/Firebase";
const CommentBox = ({ userId }) => {
  const commentModal = useSelector(state => state.comment_modal);
  const comments = useSelector(state => state.comments);
  console.log("CommentBox -> comments", comments);
  const posts = useSelector(state => state.posts);
  const users = useSelector(state => state.users);

  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  var token;
  getToken(messaging).then(tokenNum => {
    token = tokenNum;
  });
  const userData = JSON.parse(localStorage.getItem("userData"));

  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch({
      type: "CLOSE_COMMENT_MODAL",
      payload: {
        comment_modal: {
          show: false,
          postId: null
        }
      }
    });
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/comments"
      );
      console.log(response.data);
      if (comments.length <= 0) {
        response.data.forEach(comment => {
          dispatch({
            type: "STORE_COMMENTS",
            payload: {
              id: comment?.id,
              postId: comment?.postId,
              userId: userData?.id,
              body: comment?.body,
              email: comment.email
            }
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    if (!newComment.trim() || newComment.length <= 0) {
      console.log("Please Enter SomeThings");
      setError("Please Enter SomeThings");
      return;
    } else {
      if (newComment) {
        const newCommentData = {
          id: new Date() + 1,
          postId: commentModal.postId,
          userId: userData?.id,
          userName: userData?.userName,
          body: newComment
        };

        dispatch({
          type: "STORE_COMMENTS",
          payload: newCommentData
        });
        if (token && commentModal.userId !== userData.id) {
          const notificationMessage = {
            notification: {
              title: `${userData.userName} is comment on your post!`,
              body: `${newComment?.substr(0, 20)}...`
            },
            to: token
          };

          // Send the notification
          const response = await sendNotificationToUser(notificationMessage);
          console.log("Notification sent:", response);
        }
        setNewComment("");
        console.log("New comment ADDED");
      } else {
        console.log("Something Is Wrong");
      }
    }
  };
  const sendNotificationToUser = async notificationMessage => {
    try {
      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=AAAALdFrKTQ:APA91bH4XtLn9z3J0sARNeaTaNN9Hax9jE8gBUgYk0CVK6BoabyZeeIZZNxknXvaUt6DQVQqJ3_HtOufBUnRCWNOjBgNrJsdK7caoLQKxYLcLwKbV9-3gM61Db3EeM_1gyem_mflRuas`
        },
        body: JSON.stringify(notificationMessage)
      });

      if (!response.ok) {
        throw new Error(`FCM request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error sending FCM notification:", error);
    }
  };
  return (
    <div>
      <Offcanvas
        show={commentModal.show}
        onHide={handleClose}
        placement="bottom"
        className="comment_box"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Comment Box</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {comments
            .filter(comment => comment.postId === commentModal.postId)
            .map((comment, index) => {
              const userName = users.find(user => user.email === comment.email);

              return (
                <div key={index}>
                  <h3>{comment?.userName || "Unknown"}</h3>
                  <p>{comment.body}</p>
                  <hr />
                </div>
              );
            })}
        </Offcanvas.Body>
        <Form className="m-2 bg-dark" onSubmit={handleSubmit}>
          <Form.Group
            className="mb-3 ms-2 mt-3 w-100"
            controlId="formBasicEmail"
          >
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Comment Here"
                  className="m-2"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
              </Col>
              <Col>
                <Button
                  className="mt-2 btn"
                  type="submit"
                  disabled={newComment?.length <= 0 || !newComment.trim()}
                >
                  Send
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Offcanvas>
    </div>
  );
};

export default CommentBox;
