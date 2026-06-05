import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { threadAPI } from "../../services/api";
import type { Thread } from "../../types/thread.types";

interface ThreadState {
  threads: Thread[];
  loading: boolean;
  error: string | null;
}

const initialState: ThreadState = {
  threads: [],
  loading: false,
  error: null,
};

export const fetchThreads = createAsyncThunk(
  "threads/lists",
  async (_, { rejectWithValue }) => {
    try {
      const res = await threadAPI.getThreads();

      return res.data.data.formattedThreadLists;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch threads",
      );
    }
  },
);

export const likeThread = createAsyncThunk(
  "threads/like",
  async (id: number, { rejectWithValue }) => {
    try {
      await threadAPI.likeThread(id);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to like thread",
      );
    }
  },
);

const threadSlice = createSlice({
  name: "thread",
  initialState,

  reducers: {
    toggleLike: (state, action) => {
      const thread = state.threads.find((t) => t.id === action.payload);
      //  console.log("toggleLike reducer", action.payload);

      console.log("before",thread?.like, thread?.isLiked);

      if (!thread) return;

      const wasLiked = thread.isLiked;

      thread.like = wasLiked ? thread.like - 1 : thread.like + 1;
      thread.isLiked = !wasLiked;
      console.log("before",thread?.like, thread?.isLiked);

    },
    hydrateThreads: (state, action) => {
      state.threads = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default threadSlice.reducer;
export const { toggleLike, hydrateThreads } = threadSlice.actions;
