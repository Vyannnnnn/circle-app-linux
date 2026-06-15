import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { threadAPI } from "../../services/api";
import type { Thread } from "../../types/thread.types";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Replie } from "@/types/replie.types";

interface ThreadState {
  threads: Thread[];
  selectedThread: Thread | null;
  profileThreads: Thread[];
  viewedProfileThreads: Thread[];
  replies: Replie[];
  loading: boolean;
  error: string | null;
}

const initialState: ThreadState = {
  threads: [],
  selectedThread: null,
  profileThreads: [],
  viewedProfileThreads: [],
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

// test
export const fetchThreadById = createAsyncThunk(
  "threads/fetchThreadById",
  async (threadId: number, { rejectWithValue }) => {
    try {
      const res = await threadAPI.getThreadById(threadId);
      return res.data.data.formattedThread;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch thread details",
      );
    }
  },
);
export const fetchUserThreads = createAsyncThunk(
  "threads/fetchUserThreads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await threadAPI.getUserThreads();
      return response.data.data.formattedThreadLists;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user threads",
      );
    }
  },
);

export const fetchThreadsByUserId = createAsyncThunk(
  "thread/fetchThreadsByUserId",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await threadAPI.getThreadsByUserId(id);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch threads by user",
      );
    }
  },
);

export const fetchRepliesByThreadId = createAsyncThunk(
  "threads/fetchRepliesByThreadId",
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
    toggleLikeSelected: (state) => {
      if (!state.selectedThread) return;

      const wasLiked = state.selectedThread.isLiked;

      state.selectedThread.like = wasLiked
        ? state.selectedThread.like - 1
        : state.selectedThread.like + 1;
      state.selectedThread.isLiked = !wasLiked;
    },
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.unshift(action.payload);
    },
    clearSelectedThread: (state) => {
      state.selectedThread = null;
    },
    updateThreadLike: (
      state,
      action: PayloadAction<{ threadId: number; likeCount: number }>,
    ) => {
      const { threadId, likeCount } = action.payload;
      if (state.selectedThread && state.selectedThread.id === threadId) {
        state.selectedThread.like = likeCount;
      }
      const homeThread = state.threads.find((t) => t.id === threadId);
      if (homeThread) {
        homeThread.like = likeCount;
      }
      const profileThread = state.profileThreads.find((t) => t.id === threadId);
      if (profileThread) {
        profileThread.like = likeCount;
      }
    },
    toggleLike: (state, action) => {
      const id = action.payload;

      const homeThread = state.threads.find((t) => t.id === id);

      const profileThread = state.profileThreads.find((t) => t.id === id);

      const update = (thread: Thread) => {
        const wasLiked = thread.isLiked;

        thread.like += wasLiked ? -1 : 1;
        thread.isLiked = !wasLiked;
      };

      if (homeThread) update(homeThread);

      if (profileThread) update(profileThread);
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
      .addCase(fetchUserThreads.fulfilled, (state, action) => {
        state.profileThreads = action.payload;
      })
      // fetchThreadById
      .addCase(fetchThreadById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchThreadById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedThread = action.payload;
      })
      .addCase(fetchThreadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // fetchThreadsByUserId
      .addCase(fetchThreadsByUserId.fulfilled, (state, action) => {
        console.log("PAYLOAD:", action.payload);
        console.log("REDUCER HIT");
        state.viewedProfileThreads = action.payload;
      })

      .addCase(fetchRepliesByThreadId.fulfilled, (state, action) => {
        state.loading = false;
        state.replies = action.payload;
      })
      .addCase(createReply.fulfilled, (state, action) => {
        if (action.payload?.reply) {
          state.replies.unshift(action.payload.reply);
          if (state.selectedThread) {
            state.selectedThread.replies += 1;
          }
        }
      });
  },
});

export default threadSlice.reducer;
export const {
  toggleLike,
  addThread,
  toggleLikeSelected,
  clearSelectedThread,
  updateThreadLike,
} = threadSlice.actions;
