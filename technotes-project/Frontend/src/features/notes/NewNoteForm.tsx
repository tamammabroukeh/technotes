import { useAddNewNoteMutation } from "./notesApiSlice";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
export default function NewNoteForm({ users }) {
  const [addNewNote, { isError, isLoading, isSuccess, error }] =
    useAddNewNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(users[0].id);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);

  const handleUserId = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const saveNoteClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      await addNewNote({ text, title, user: userId });
    }
  };

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {user.username}
      </option>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form onSubmit={saveNoteClicked} className="form">
        <div className="form__title-row">
          <h2>New Note</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="title">
          Title:
        </label>
        <input
          value={title}
          onChange={handleTitle}
          id="title"
          type="text"
          autoComplete="off"
          name="title"
          className={`form__input ${validTitleClass}`}
        />
        <label className="form__label" htmlFor="text">
          Text:
        </label>
        <textarea
          value={text}
          onChange={handleText}
          id="text"
          name="text"
          className={`form__input  form__input--text ${validTextClass}`}
        />
        <label
          className="form__label form__checkbox-container"
          htmlFor="username"
        >
          Assigned TO:
        </label>
        <select
          className={`form__select`}
          size={3}
          value={userId}
          id="username"
          name="username"
          onChange={handleUserId}
        >
          {options}
        </select>
      </form>
    </>
  );
  return content;
}
