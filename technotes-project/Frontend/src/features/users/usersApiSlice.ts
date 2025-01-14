import { apiSlice } from "../../app/api/apiSlice";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter({});

type TResponse = {
  _id: string;
  id: string;
  username: string;
};

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: `/users`,
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      transformResponse: (responseData: TResponse[]) => {
        const loadedUsers = responseData.map((user: TResponse) => {
          user.id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, msg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else {
          return [{ type: "User", id: "LIST" }];
        }
      },
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "POST",
        body: { ...initialUserData },
      }),
      invalidatesTags: [{ id: "LIST", type: "User" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: "/users",
        method: "PATCH",
        body: { ...initialUserData },
      }),
      invalidatesTags: (result, err, arg) => [{ id: arg.id, type: "User" }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: "/users",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, err, arg) => [{ id: arg.id, type: "User" }],
    }),
  }),
});
export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = usersApiSlice;
// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
