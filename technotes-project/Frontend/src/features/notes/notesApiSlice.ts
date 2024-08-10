import { apiSlice } from "../../app/api/apiSlice";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

type TResponse = {
  _id: string;
  id: string;
  notename: string;
};

const initialState = notesAdapter.getInitialState();

export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: `/notes`,
        validateStatus: (response, result) =>
          response.status === 200 && !result.isError,
      }),
      transformResponse: (responseData: TResponse[]) => {
        const loadedNotes = responseData.map((note: TResponse) => {
          note.id = note._id;
          // console.log(note);
          return note;
        });
        return notesAdapter.setAll(initialState, loadedNotes);
      },
      providesTags: (result, error, msg) => {
        if (result?.ids) {
          return [
            { type: "note", id: "LIST" },
            ...result.ids.map((id) => ({ type: "note", id })),
          ];
        } else {
          return [{ type: "note", id: "LIST" }];
        }
      },
    }),
    addNewNote: builder.mutation({
      query: (initialUserData) => ({
        url: "/notes",
        method: "POST",
        body: { ...initialUserData },
      }),
      invalidatesTags: [{ id: "LIST", type: "Note" }],
    }),
    updateNote: builder.mutation({
      query: (initialUserData) => ({
        url: "/notes",
        method: "PATCH",
        body: { ...initialUserData },
      }),
      invalidatesTags: (result, err, arg) => [{ id: arg.id, type: "Note" }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: "/notes",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, err, arg) => [{ id: arg.id, type: "Note" }],
    }),
  }),
});
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
} = notesApiSlice;

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(
  (state) => selectNotesData(state) ?? initialState
);
