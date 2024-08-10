import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;
export default function DashHeader() {
  const { isManager, isAdmin } = useAuth();
  const [sendLogout, { isError, isLoading, isSuccess, error }] =
    useSendLogoutMutation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const onNewNoteClicked = () => navigate("/dash/notes/new");
  const onNewUserClicked = () => navigate("/dash/users/new");
  const onNotesClicked = () => navigate("/dash/notes");
  const onUsersClicked = () => navigate("/dash/users");

  let dashClass = "";
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }
  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        onClick={onNewNoteClicked}
        className="icon-button"
        title="New Note"
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }
  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        onClick={onNewUserClicked}
        className="icon-button"
        title="New User"
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let usersButton = null;
  if (isAdmin || isManager) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      usersButton = (
        <button onClick={onUsersClicked} className="icon-button" title="Users">
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }
  let notesButton = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <button onClick={onNotesClicked} className="icon-button" title="Notes">
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? "errMsg" : "offscreens";
  let buttonContent;
  if (isLoading) {
    buttonContent = <p>Logging out...</p>;
  } else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {usersButton}
        {logoutButton}
      </>
    );
  }
  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash">
            <h1 className="dash-header__title">techNotes</h1>
          </Link>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header>
    </>
  );
  return content;
}
