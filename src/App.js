import "./App.css";
import Login from "./Pages/Login/Login";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PublicRoutes from "./Routes/PublicRoutes";
import PrivateRoutes from "./Routes/PrivateRoutes";
import Header from "./Pages/Header/Header";
import UploadPost from "./Pages/UploadPost/UploadPost";
import CommentBox from "./Pages/CommentBox/CommentBox";

function App() {
  const currentPath = window.location.pathname;
  const hideHeader = ["/login","/user-profile/:id"];
const hideOrShow= currentPath.includes(hideHeader)
  const navigate = useNavigate();
  const auth = localStorage.getItem("auth");

  useEffect(() => {
    if (!auth) {
      navigate("login");
      loginRoute();
    }
  }, [auth]);

  const loginRoute = () => {
    localStorage.clear();
    return <PublicRoutes />;
  };
  return (
    <>
      {!hideOrShow  && <Header />}
      <UploadPost/>
      <CommentBox />
      {auth ? <PrivateRoutes /> : loginRoute()}
    </>
  );
}

export default App;
