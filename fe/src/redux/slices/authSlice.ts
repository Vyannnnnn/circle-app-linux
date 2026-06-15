import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";
import type { AuthState } from "../../types/auth.types";

const initialState: AuthState = {
  user: (() => {
    try {
      const user = localStorage.getItem("user");
      if (user && user !== "undefined" && user !== "null") {
        return JSON.parse(user);
      }
      return null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  })(),
  token: (() => {
    try {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined" && token !== "null") {
        return token;
      }
      return null;
    } catch (error) {
      console.error("Failed to get token from localStorage:", error);
      return null;
    }
  })(),
  loading: false,
  error: null,
  isAuthenticated: (() => {
    const token = localStorage.getItem("token");
    return !!(token && token !== "undefined" && token !== "null");
  })(),
  follows: [],
  suggestions: [],
  searchResults: [],
  viewedProfile: null,
};

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: {
      username: string;
      full_Name: string;
      email: string;
      password: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await authAPI.register(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(data);
      const token = response.data.token;
      const userData = response.data.data;

      if (!token || token === "undefined") {
        return rejectWithValue("Invalid token received");
      }

      if (!userData) {
        return rejectWithValue("Invalid user data received");
      }

      const user = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        photo_profile: userData.photo_profile,
        full_Name: userData.full_Name,
        bio: userData.bio,
        followersCount: userData.followersCount,
        followingCount: userData.followingCount,
      };
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("threads");
});

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const getProfileById = createAsyncThunk(
  "auth/getProfileById",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfileById(userId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);





export const followUser = createAsyncThunk(
  "auth/follow",
  async (userId: number, { rejectWithValue }) => {
    try {
      await authAPI.follow(userId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to follow user",
      );
    }
  },
);

export const unfollowUser = createAsyncThunk(
  "auth/unfollow",
  async (userId: number, { rejectWithValue }) => {
    try {
      await authAPI.unfollow(userId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unfollow user",
      );
    }
  },
);

export const getFollows = createAsyncThunk(
  "auth/getFollows",
  async (type: "followers" | "following", { rejectWithValue }) => {
    try {
      const response = await authAPI.getFollows(type);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch follows",
      );
    }
  },
);

export const getSuggestions = createAsyncThunk(
  "auth/getSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getSuggestions();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch suggestions",
      );
    }
  },
);

export const searchUsers = createAsyncThunk(
  "auth/searchUsers",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.searchUsers(query);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search users",
      );
    }
  },
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.searchResults = [];
      state.follows = [];
      state.suggestions = [];

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("threads");
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.searchResults = [];
      state.follows = [];
      state.suggestions = [];
    });

    // Get Profile By Id
    builder.addCase(getProfileById.fulfilled, (state, action) => {
      state.viewedProfile = action.payload;
    });
    
    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // search users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // get follow
    builder
      .addCase(getFollows.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFollows.fulfilled, (state, action) => {
        state.loading = false;
        state.follows = action.payload;
      })
      .addCase(getFollows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // follow/unfollow user
    builder
      .addCase(followUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(unfollowUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    // get suggestions
    builder
      .addCase(getSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSuggestions.fulfilled, (state, action) => {
        state.loading = false;

        state.suggestions = action.payload;
      })
      .addCase(getSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
