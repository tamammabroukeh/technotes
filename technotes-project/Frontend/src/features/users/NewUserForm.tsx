import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../config/roles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;
export default function NewUserForm() {
  const [addNewUser, { isError, isLoading, isSuccess, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [roles, setRoles] = useState(["Employee"]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    }
  }, [navigate, isSuccess]);

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

  const canSave =
    [roles.length, validPassword, validUsername].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, password, roles });
    }
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const errClass = isError ? "errMsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPasswordClass = !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !roles.length ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <form onSubmit={onSaveUserClicked} className="form">
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
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
          Password:{" "}
          <span className="nowrap">[4-12 letters include(!@#$%)]</span>
        </label>
        <input
          value={password}
          onChange={handleChangePassword}
          id="password"
          type="password"
          name="password"
          className={`form__input ${validPasswordClass}`}
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
