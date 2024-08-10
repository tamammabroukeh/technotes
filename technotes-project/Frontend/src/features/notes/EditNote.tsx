import { useParams } from "react-router-dom";
import EditNoteForm from "./EditNoteForm";
import useAuth from "../../hooks/useAuth";
import { useGetNotesQuery } from "./notesApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import { useGetUsersQuery } from "../users/usersApiSlice";
export default function EditNote() {
  const { id } = useParams();
  const { isAdmin, isManager, username } = useAuth();

  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[id],
    }),
  });
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data.entities[id]),
    }),
  });

  if (!note || !users?.length) return <PulseLoader color="#FFF" />;

  if (!isManager && !isAdmin) {
    if (note.username !== username) {
      return <p className="errMsg">No access</p>;
    }
  }
  const content = <EditNoteForm {...{ note, users }} />;
  return content;
}
