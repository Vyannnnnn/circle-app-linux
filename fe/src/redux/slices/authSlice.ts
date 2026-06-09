import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";

interface User {
  id?: string;
  username?: string;
  email?: string;
  photo_profile?: string;
  full_Name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  selectedThread?: {
    id: number;
    like: number;
  } | null;
}

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
};

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: {
      username: string;
      full_Name?: string;
      email?: string;
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
      console.log("LOGIN THUNK START");
      const response = await authAPI.login(data);
      console.log("LOGIN RESPONSE", response);
      console.log("Login response:", response.data);
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
  authAPI.logout();
});

// export const getProfile = createAsyncThunk(
//   "auth/getProfile",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await authAPI.getProfile();
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch profile"
//       );
//     }
//   }
// );

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authAPI.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateThreadLikes: (state, action) => {
      if (state.selectedThread) {
        state.selectedThread.like = action.payload;
      } 
    }
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
        // User will be redirected to login after successful registration
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

    // Get Profile
    // builder
    //   .addCase(getProfile.pending, (state) => {
    //     state.loading = true;
    //   })
    //   .addCase(getProfile.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.user = action.payload;
    //   })
    //   .addCase(getProfile.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
