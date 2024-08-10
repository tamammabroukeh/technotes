import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
export default function EditNoteForm({ note, users }) {
  const { isAdmin, isManager } = useAuth();
  const [updateNote, { isError, isLoading, isSuccess, error }] =
    useUpdateNoteMutation();
  console.log(note);
  const [
    deleteNote,
    { isError: isDelError, isSuccess: isDelSuccess, error: delError },
  ] = useDeleteNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [userId, setUserId] = useState(note.user);
  const [completed, setCompleted] = useState(note.completed);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);

  const handleCompleted = () => setCompleted((prev: boolean) => !prev);

  const handleUserId = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const updateNoteClicked = async () => {
    if (canSave) {
      await updateNote({ text, title, user: userId, completed, id: note.id });
    }
  };

  const deleteNoteClicked = async () => {
    await deleteNote({ id: note.id });
  };

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";
  const errContent = (error?.data?.message || delError?.data?.message) ?? "";

  let deleteButton = null;
  if (isAdmin || isManager) {
    deleteButton = (
      <button
        className="icon-button"
        onClick={deleteNoteClicked}
        title="Delete"
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }
  const content = (
    <>
      <p className={errClass}>{errContent}</p>
      <form onSubmit={(e) => e.preventDefault()} className="form">
        <div className="form__title-row">
          <h2>Edit Note #{note.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              onClick={updateNoteClicked}
              title="Save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label className="form__label" htmlFor="note-title">
          Title:
        </label>
        <input
          value={title}
          onChange={handleTitle}
          id="note-title"
          type="text"
          autoComplete="off"
          name="title"
          className={`form__input ${validTitleClass}`}
        />
        <label className="form__label" htmlFor="note-text">
          Text:
        </label>
        <textarea
          value={text}
          onChange={handleText}
          id="note-text"
          name="text"
          className={`form__input  form__input--text ${validTextClass}`}
        />
        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label form__checkbox-container"
              htmlFor="note-completed"
            >
              Work Complete:
              <input
                className="form__checkbox"
                id="note-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={handleCompleted}
              />
            </label>

            <label
              className="form__label form__checkbox-container"
              htmlFor="note-username"
            >
              Assigned To:
            </label>
            <select
              id="note-username"
              name="username"
              className="form__select"
              value={userId}
              onChange={handleUserId}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );
  return content;
}
