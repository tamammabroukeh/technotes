import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
export default function EditUser() {
  const { id } = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  console.log(user);
  if (!user) return <PulseLoader color="#FFF" />;

  const content = <EditUserForm user={user} />;

  return content;
}
