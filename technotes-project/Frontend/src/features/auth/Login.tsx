import { useEffect, useRef, useState } from "react";
import { useLoginMutation } from "./authApiSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { PulseLoader } from "react-spinners";
import usePersist from "../../hooks/usePersist";
export default function Login() {
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userRef.current) {
      userRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const errClass = errMsg ? "errMsg" : "offscreen";

  if (isLoading) return <PulseLoader color="#FFF" />;

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleCheck = () => setPersist((prev: boolean) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (error) {
      if (!error?.status) {
        setErrMsg("No Server Response");
      } else if (error?.status === 400) {
        setErrMsg("Missing username or password");
      } else if (error?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(error?.status?.message);
      }
      errRef?.current?.focus();
    }
  };

  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            value={username}
            onChange={handleUsername}
            id="username"
            name="username"
            ref={userRef}
            required
            autoComplete="off"
            className="form__input"
          />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            value={password}
            onChange={handlePassword}
            id="password"
            name="password"
            required
            className="form__input"
          />
          <button className="form__submit-button">Sign in</button>
          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleCheck}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );
  return content;
}
