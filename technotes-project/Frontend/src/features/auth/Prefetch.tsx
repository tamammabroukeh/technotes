import { useEffect } from "react";
import { usersApiSlice } from "../users/usersApiSlice";
import { notesApiSlice } from "../notes/notesApiSlice";
import { Outlet } from "react-router-dom";
import { store } from "../../app/store";

export default function Prefetch() {
  useEffect(() => {
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
    store.dispatch(
      notesApiSlice.util.prefetch("getNotes", "notesList", { force: true })
    );
  }, []);

  return <Outlet />;
}
