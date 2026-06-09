import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { threadAPI } from "../../services/api";
import type { Thread } from "../../types/thread.types";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Replie } from "@/types/replie.types";

interface ThreadState {
  threads: Thread[];
  selectedThread: Thread | null;
  replies: Replie[];
  loading: boolean;
  error: string | null;
}

const initialState: ThreadState = {
  threads: [],
  selectedThread: null,
  replies: [],
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

export const fetchThreadById = createAsyncThunk(
  "threads/:threadId",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await threadAPI.getThreadById(id);
      return res.data.data.formattedThread;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch thread details",
      );
    }
  },
);

export const fetchRepliesByThreadId = createAsyncThunk(
  "threads/:threadId/replies",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await threadAPI.getRepliesByThreadId(id);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch thread details",
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

export const unlikeThread = createAsyncThunk(
  "threads/unlike",
  async (id: number, { rejectWithValue }) => {
    try {
      await threadAPI.unlikeThread(id);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to unlike thread",
      );
    }
  },
);

export const createThread = createAsyncThunk(
  "threads/create",
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await threadAPI.createThread(payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create thread",
      );
    }
  },
);

export const createReply = createAsyncThunk(
  "threads/createReply",
  async (
    { threadId, payload }: { threadId: number; payload: FormData },
    { rejectWithValue },
  ) => {
    try {
      const res = await threadAPI.createReply(threadId, payload);
      console.log("createReply response:", res.data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create reply",
      );
    }
  },
);

const threadSlice = createSlice({
  name: "thread",
  initialState,

  reducers: {
    toggleLike: (state, action: PayloadAction<number>) => {
      const thread = state.threads.find((t) => t.id === action.payload);

      if (!thread) return;

      const wasLiked = thread.isLiked;

      thread.like = wasLiked ? thread.like - 1 : thread.like + 1;
      thread.isLiked = !wasLiked;
    },
    toggleLikeSelected: (state) => {
      if (!state.selectedThread) return;

      const wasLiked = state.selectedThread.isLiked;

      state.selectedThread.like = wasLiked
        ? state.selectedThread.like - 1
        : state.selectedThread.like + 1;
      state.selectedThread.isLiked = !wasLiked;
    },
    hydrateThreads: (state, action: PayloadAction<Thread[]>) => {
      state.threads = action.payload;
    },
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.unshift(action.payload);
    },
    clearSelectedThread: (state) => {
      state.selectedThread = null;
    },
    updateThreadLike: (state, action: PayloadAction<number>) => {
      if (state.selectedThread) {
        state.selectedThread.like = action.payload;
      }
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
      })
      .addCase(createThread.fulfilled, (state, action) => {
        // state.threads.unshift(action.payload);
      })
      .addCase(fetchThreadById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThreadById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedThread = action.payload;
      })
      .addCase(fetchThreadById.rejected, (state) => {
        state.loading = false;
        // state.error = action.payload as string;
      })
      .addCase(fetchRepliesByThreadId.fulfilled, (state, action) => {
        // state.loading = false;
        state.replies = action.payload;
      })
      .addCase(createReply.fulfilled, (state, action) => {
        state.replies.unshift(action.payload.reply);
        if (state.selectedThread) {
          state.selectedThread.replies += 1;
        }
      });
    // .addCase(createThread.rejected, (state, action) => {
    //   state.error = action.payload as string;
    // })

    //  .addCase(likeThread.rejected, (state, action) => {
    //   state.error = action.payload as string;
    // });
  },
});

export default threadSlice.reducer;
export const {
  toggleLike,
  hydrateThreads,
  addThread,
  toggleLikeSelected,
  clearSelectedThread,
  updateThreadLike,
} = threadSlice.actions;
