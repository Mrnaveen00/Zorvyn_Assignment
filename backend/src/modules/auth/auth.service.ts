import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "../../config/env";
import { prisma } from "../../config/database";
import { ApiError } from "../../utils/api-error";

type LoginInput = {
  email: string;
  password: string;
};

export const authService = {
  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(403, "Your account is inactive");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      env.jwtSecret,
      {
        subject: user.id,
        expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
      },
    );

    return {
      token,
      user: this.serializeUser(user),
    };
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.status !== "ACTIVE") {
      throw new ApiError(403, "Your account is inactive");
    }

    return this.serializeUser(user);
  },

  serializeUser(user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  },
};
