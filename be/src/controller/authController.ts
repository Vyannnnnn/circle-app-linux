import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { generateToken, TokenPayload } from "../utils/jwt";
import {
  isValidEmail,
  isValidUsername,
  isValidPassword,
  isValidFullName,
  sanitizeInput,
} from "../utils/validation";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, full_Name } = req.body;

    if (!username || !email || !password || !full_Name) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedFullName = sanitizeInput(full_Name);

    if (!isValidEmail(sanitizedEmail)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    if (!isValidUsername(sanitizedUsername)) {
      res.status(400).json({
        success: false,
        message:
          "Username must be 3-20 characters, alphanumeric, underscore, or hyphen",
      });
      return;
    }

    if (!isValidFullName(sanitizedFullName)) {
      res.status(400).json({
        success: false,
        message:
          "Full name must be 2-50 characters with letters and spaces only",
      });
      return;
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
      return;
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email: sanitizedEmail }, { username: sanitizedUsername }],
      },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message:
          existingUser.email === sanitizedEmail
            ? "Email already registered"
            : "Username already taken",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username: sanitizedUsername,
        email: sanitizedEmail,
        password: hashedPassword,
        full_Name: sanitizedFullName,
      },
    });

    const tokenPayload: TokenPayload = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
    const token = generateToken(tokenPayload);

    res.status(200).json({
      success: true,
      message: "Registration successful",
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_Name: newUser.full_Name,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    const user = await prisma.users.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const tokenPayload: TokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      photo_profile: user.photo_profile,
    };
    const token = generateToken(tokenPayload);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_Name: user.full_Name,
        photo_profile: user.photo_profile,
        bio: user.bio,
      },
      token,
    });

    console.log("user:", user);
    console.log("password input:", password);
    console.log("hashed password:", user?.password);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        full_Name: user.full_Name,
        photo_profile: user.photo_profile,
        bio: user.bio,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

export const editProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const { full_Name, username, bio } = req.body;
    let photo_profile = undefined;

    if (req.file) {
      photo_profile = `/uploads/${req.file.filename}`;
    }

    const dataToUpdate: any = {};
    if (full_Name) dataToUpdate.full_Name = sanitizeInput(full_Name);
    if (username) dataToUpdate.username = sanitizeInput(username);
    if (bio !== undefined) dataToUpdate.bio = sanitizeInput(bio);
    if (photo_profile) dataToUpdate.photo_profile = photo_profile;

    const updatedUser = await prisma.users.update({
      where: { id: req.user.id },
      data: dataToUpdate,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        full_Name: updatedUser.full_Name,
        photo_profile: updatedUser.photo_profile,
        bio: updatedUser.bio,
      },
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const getFollows = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const type = req.query.type;

    if (type !== "followers" && type !== "following") {
      res.status(400).json({
        success: false,
        message: "Invalid type. Use followers or following",
      });
      return;
    }

    let data;

    if (type === "followers") {
      const followers = await prisma.following.findMany({
        where: {
          followingId: req.user.id,
        },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              full_Name: true,
              photo_profile: true,
              bio: true,
            },
          },
        },
      });

      data = followers.map((item) => item.follower);
    }

    if (type === "following") {
      const following = await prisma.following.findMany({
        where: {
          followerId: req.user.id,
        },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              full_Name: true,
              photo_profile: true,
              bio: true,
            },
          },
        },
      });

      data = following.map((item) => item.following);
    }

    res.status(200).json({
      success: true,
      data,
    });
    
  } catch (error) {
    console.error("Get follows error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get follows",
    });
  }
};
