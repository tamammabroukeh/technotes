import { PulseLoader } from "react-spinners";
import { useGetUsersQuery } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

export default function NewNote() {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <PulseLoader color="#FFF" />;

  const content = <NewNoteForm users={users} />;

  return content;
}
