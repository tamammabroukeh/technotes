import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
export default function DashFooter() {
  const { username, status } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate("/dash");

  let GoHomeButton = null;
  if (pathname !== "dash") {
    GoHomeButton = (
      <button
        className="dash-footer__button"
        onClick={onGoHomeClicked}
        title="Home"
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }
  return (
    <footer className="dash-footer">
      {GoHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  );
}
