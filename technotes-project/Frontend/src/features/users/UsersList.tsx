import { PulseLoader } from "react-spinners";
import User from "./User";
import { useGetUsersQuery } from "./usersApiSlice";
export default function UsersList() {
  const {
    data: users,
    isError,
    isSuccess,
    isLoading,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  let content;
  if (isLoading) content = <PulseLoader color="#FFF" />;
  if (isError) content = <p className="errMsg">{error?.data?.message}</p>;
  if (isSuccess) {
    const { ids } = users;
    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <table className="table table--user">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }
  return content;
}
