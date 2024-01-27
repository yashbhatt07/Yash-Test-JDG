import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  users: [],
  posts: [],
  comments: [],
  modal: {
    show: false
  },
  comment_modal: {
    show: false
  }
};

const persistConfig = {
  key: "root",
  storage
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "STORE_USER":
      return {
        ...state,
        users: [...state.users, action.payload]
      };

    case "STORE_POST":
      return {
        ...state,
        posts: [...state.posts, action.payload]
      };
    case "DELETE_POST":
      const postIdToDelete = action.payload.postId;
      const updatedPostsAfterDeletion = state.posts.filter(
        post => post.postId !== postIdToDelete
      );

      return {
        ...state,
        posts: updatedPostsAfterDeletion
      };

    case "STORE_COMMENTS":
      return {
        ...state,
        comments: [...state.comments, action.payload]
      };
    case "ADD_LIKES":
      const { postId, likerId } = action.payload;
      const updatedPosts = state.posts.map(post => {
        if (post.postId === postId) {
          const likes = post.likes.includes(likerId)
            ? post.likes.filter(id => id !== likerId)
            : [...post.likes, likerId];

          return {
            ...post,
            likes
          };
        } else {
          return post;
        }
      });

      return {
        ...state,
        posts: updatedPosts
      };

    case "OPEN_MODAL":
      console.log(state)
      return {
        ...state,
        modal: {
          show: true
        }
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        modal: {
          show: false
        }
      };
    case "OPEN_COMMENT_MODAL":
      return {
        ...state,
        comment_modal: {
          show: true,
          postId: action.payload.comment_modal.postId,
          userId:action.payload.comment_modal.userId
        }
      };
    case "CLOSE_COMMENT_MODAL":
      return {
        ...state,
        comment_modal: {
          show: false,
          postId: null
        }
      };
    case "UPDATE_USER_NAME":
      const { userId, newName } = action.payload;
      const updatedUsers = state.users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            userName: newName
          };
        } else {
          return user;
        }
      });
      console.log("updatedUsers:", updatedUsers);

      return {
        ...state,
        users: updatedUsers
      };
      case "UPDATE_USER_TOKEN":
        const { userID, token } = action.payload;
        const updatedUsersWithToken = state.users.map((user) => {
          if (user.id === userID) {
            return {
              ...user,
              token: token,
            };
          } else {
            return user;
          }
        });
  
        return {
          ...state,
          users: updatedUsersWithToken,
        };
    // Inside your reducer
    case "UPDATE_USER_NAME_IN_POSTS":
      const { userIdd, newUserName } = action.payload;
      const updatedPostsWithUserName = state.posts.map(post => {
        if (post.ownerId === userIdd) {
          return {
            ...post,
            userName: newUserName
          };
        } else {
          return post;
        }
      });

      return {
        ...state,
        posts: updatedPostsWithUserName
      };

    default:
      return state;
  }
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
