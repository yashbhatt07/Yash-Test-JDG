import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import axios from "axios";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import "./Feed.css";
import like from "../../like.png";
import unLike from "../../unlike.png";
import commentSection from "../../comment-section.png";
import remove from "../../remove.png";
import { TokenHandler, onMessageListener } from "../../Firebase/Firebase";
import { messaging } from "../../Firebase/Firebase";
import CommentBox from "../CommentBox/CommentBox";

const Feed = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
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
  const allUsers = useSelector((state) => state.users);
  const posts = useSelector((state) => state.posts);
  const myPost = posts.filter((post) => post?.ownerId == userData?.id);
  const dispatch = useDispatch();
  var name;

  const [visiblePosts, setVisiblePosts] = useState(10); // Number of initially visible posts
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenCommentBox = async (postId, userId) => {
    try {
      dispatch({
        type: "OPEN_COMMENT_MODAL",
        payload: {
          comment_modal: {
            show: true,
            postId: postId,
            userId: userId,
          },
        },
      });
    } catch (error) {
      console.log("handleOpenCommentBox -> error", error);
    }
  };

  var postOwner;

  useEffect(() => {
    if (myPost.some((val) => userData.id == val.ownerId)) {
      TokenHandler();
      const unsubscribe = onMessageListener().then((payload) => {
        console.log(
          "🚀 ~ file: Layout.jsx:72 ~ onMessageListener ~ payload:",
          payload
        );
        console.log(payload);
      });

      return () => {
        unsubscribe.catch((err) => console.log("failed", err));
      };
    }
  }, []);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 50 && !isLoading) {
      setIsLoading(true);
      fetchAllPost(visiblePosts + 10).finally(() => setIsLoading(false));
      setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 10);
    }
  };

  useEffect(() => {
    fetchAllPost();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchAllPost = async (limit = visiblePosts) => {
    if (posts.length < limit) {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts",
          {
            params: {
              _start: posts.length,
              _limit: limit,
            },
          }
        );

        response.data.forEach((post) => {
          const user = allUsers.find((user) => user.id === post.userId);
          dispatch({
            type: "STORE_POST",
            payload: {
              postId: post.id || "",
              ownerId: post.userId || "",
              title: post.title || "",
              body: post.body || "",
              userName: name?.userName || "",
              likes: [],
              token: user?.token || "",
            },
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLikeClick = async (postId, userId, token) => {
    postOwner = allUsers.find((user) => user.id === userId);

    try {
      dispatch({
        type: "ADD_LIKES",
        payload: {
          postId,
          likerId: userData.id,
        },
      });
      if (token && userId !== userData.id) {
        const notificationMessage = {
          notification: {
            title: "New Like",
            body: `${userData.userName} is like your post!`,
          },
          to: token,
        };

        const response = await sendNotificationToUser(notificationMessage);
        console.log("Notification sent:", response);
      }
    } catch (error) {
      console.log("handleLikeClick -> error", error);
    }
  };

  const sendNotificationToUser = async (notificationMessage) => {
    try {
      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "key=AAAALdFrKTQ:APA91bH4XtLn9z3J0sARNeaTaNN9Hax9jE8gBUgYk0CVK6BoabyZeeIZZNxknXvaUt6DQVQqJ3_HtOufBUnRCWNOjBgNrJsdK7caoLQKxYLcLwKbV9-3gM61Db3EeM_1gyem_mflRuas",
        },
        body: JSON.stringify(notificationMessage),
      });

      if (!response.ok) {
        throw new Error(`FCM request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error sending FCM notification:", error);
    }
  };

  const deleteHandler = (postId) => {
    try {
      if (window.confirm("Are you sure want to delete?") == true) {
        dispatch({
          type: "DELETE_POST",
          payload: {
            postId,
          },
        });
      }
    } catch (error) {
      console.log("deleteHandler -> error", error);
    }
  };

  return (
    <div>
      {posts
        ? posts.slice(0, visiblePosts).map((post) => {
            const headerBackgroundColor = getRandomLightColor();
            const bodyBackgroundColor = getRandomLightColor();
            name = allUsers.find((user) => user.id === post.ownerId);
            const isLikedByUser = post?.likes?.includes(userData.id);

            return (
              <Card
                style={{ width: "18rem" }}
                className="main-card mb-2 mx-auto mt-2 w-50"
                key={post.postId}
              >
                <Card.Header
                  className="card-header"
                  style={{ backgroundColor: headerBackgroundColor }}
                >
                  {name?.userName || "userName"}
                </Card.Header>
                <Card.Body
                  className="card-body"
                  style={{ backgroundColor: bodyBackgroundColor }}
                >
                  <Card.Title>{post.title}</Card.Title>
                  <Card.Text>{post.body}</Card.Text>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip>{isLikedByUser ? "Undo" : "Like"}</Tooltip>
                    }
                  >
                    <img
                      src={isLikedByUser ? like : unLike}
                      width={50}
                      alt="like"
                      className="mt-1"
                      onClick={() =>
                        handleLikeClick(post.postId, post.ownerId, post.token)
                      }
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
                      onClick={() =>
                        handleOpenCommentBox(post.postId, post.ownerId)
                      }
                    />
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Want to Delete?</Tooltip>}
                  >
                    <img
                      src={remove}
                      width={30}
                      alt="Delete"
                      className="ms-2"
                      onClick={() => deleteHandler(post.postId)}
                    />
                  </OverlayTrigger>
                </Card.Body>
              </Card>
            );
          })
        : "Loading.."}
    </div>
  );
};

export default Feed;
