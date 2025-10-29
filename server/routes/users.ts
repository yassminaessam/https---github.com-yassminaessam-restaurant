import { RequestHandler } from "express";
import { getPrisma } from "../lib/prisma";

// Simple password hashing (for development - use bcrypt in production)
const hashPassword = (password: string): string => {
  // This is a very basic hash - replace with bcrypt in production
  return Buffer.from(password).toString('base64');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Get all users
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const prisma = getPrisma();
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
        // Exclude passwordHash from response
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get single user by ID
export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = getPrisma();

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Create new user
export const createUser: RequestHandler = async (req, res) => {
  try {
    const { username, password, fullName, email, role } = req.body;
    const prisma = getPrisma();

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        fullName: fullName || username,
        email,
        role: role || 'CASHIER',
        isActive: true
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Update user
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, isActive, password } = req.body;
    const prisma = getPrisma();

    const updateData: any = {
      fullName,
      email,
      role,
      isActive
    };

    // If password is provided, hash it
    if (password) {
      updateData.passwordHash = hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user (soft delete by deactivating)
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = getPrisma();

    const user = await prisma.user.update({
      where: { id },
      data: {
        isActive: false
      },
      select: {
        id: true,
        username: true,
        isActive: true
      }
    });

    res.json({ message: "User deactivated successfully", user });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Change user password
export const changePassword: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const prisma = getPrisma();

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isValidPassword = verifyPassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const newPasswordHash = hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id },
      data: {
        passwordHash: newPasswordHash
      }
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};

// Get user activity log
export const getUserActivity: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = '50' } = req.query;
    const prisma = getPrisma();

    const activities = await prisma.auditLog.findMany({
      where: {
        userId: id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit as string)
    });

    res.json(activities);
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({ error: "Failed to fetch user activity" });
  }
};
