import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/roles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
export default function EditUserForm({ user }) {
  const [updateUser, { isError, isLoading, isSuccess, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isError: isDelError, isSuccess: isDelSuccess, error: delError },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();
  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(user.roles);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [navigate, isSuccess, isDelSuccess]);

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleChangeRoles = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRoles(values);
  };

  const handleActiveUser = () => setActive((prev: boolean) => !prev);

  const onSaveUserClicked = async () => {
    if (password) {
      await updateUser({ id: user.id, username, password, roles, active });
    } else {
      await updateUser({ id: user.id, username, roles, active });
    }
  };
  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  let canSave;
  if (password) {
    canSave =
      [roles.length, validPassword, validUsername].every(Boolean) && !isLoading;
  } else {
    canSave = [roles.length, validUsername].every(Boolean) && !isLoading;
  }

  const errClass = isError || isDelError ? "errMsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPasswordClass =
    password && !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !roles.length ? "form__input--incomplete" : "";
  const errContent = (error?.date?.message || delError?.date?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
        className="form"
      >
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          value={username}
          onChange={handleChangeUserName}
          id="username"
          type="text"
          autoComplete="off"
          name="username"
          className={`form__input ${validUserClass}`}
        />
        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[empty = no change]</span>
        </label>
        <input
          value={password}
          onChange={handleChangePassword}
          id="password"
          type="password"
          name="password"
          className={`form__input ${validPasswordClass}`}
        />
        <label
          className="form__label form__checkbox-container"
          htmlFor="user-active"
        >
          Active:
        </label>
        <input
          checked={active}
          onChange={handleActiveUser}
          id="user-active"
          type="checkbox"
          name="user-active"
          className={`form__checkbox`}
        />
        <label className="form__label" htmlFor="roles">
          Assigned Roles:
        </label>
        <select
          className={`form__select ${validRolesClass}`}
          size={3}
          value={roles}
          id="roles"
          name="roles"
          multiple={true}
          onChange={handleChangeRoles}
        >
          {options}
        </select>
      </form>
    </>
  );
  return content;
}
