import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Upload from "../../upload-logs.svg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("userData"));
  var id = userData?.id;

  const navigate = useNavigate();
  const handleUploadClick = () => {
    dispatch({
      type: "OPEN_MODAL",
      payload: {
        modal: {
          show: true
        }
      }
    });
  };

  const goToProfile = () => {
    if (window.location.pathname === `/user-profile/${id}`) {
      navigate(`/feed/${id}`);
    } else {
      navigate(`/user-profile/${id}`);
    }
  };
  const Logout = () => {
    navigate(`/login${id}`);
    localStorage.clear()
  };
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container className="w-100 d-flex justify-content-between">
        <div className="d-flex flex-row gap-3">
          <h3>YKB</h3>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>"Upload Post"</Tooltip>}
          >
            <img
              src={Upload}
              width={30}
              style={{ cursor: "pointer" }}
              onClick={handleUploadClick}
            />
          </OverlayTrigger>
        </div>
        <div className="nav-right">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Go To The Profile</Tooltip>}
            className="me-3 "
          >
            <span className="profile_section" onClick={goToProfile}>
              {window.location.pathname === `/user-profile/${id}`
                ? "Feed"
                : "Profile"}
            </span>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Logout</Tooltip>}
          >
            <span className="profile_section" onClick={Logout}>
              Logout
            </span>
          </OverlayTrigger>
        </div>
      </Container>
    </Navbar>
  );
}

export default Header;
