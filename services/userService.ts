import { UserRepository } from "../repositories/userRepository";
import { AppError } from "../middleware/errorHandler";
import { UserModel, UserModelZodSchema } from "../models/userModel";
import { FilterQuery } from "mongoose";
import { validateBody } from "@/helpers/validateBody";

// Purpose: This service class is responsible for handling the business logic of the user entity. It interacts with the user repository to perform CRUD operations on the user entity.
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUser(id: string): Promise<UserModel | null> {
    const user = await this.userRepository.getUser(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getUsers(): Promise<UserModel[]> {
    return this.userRepository.getUsers();
  }

  async createUser(userData: Partial<UserModel>): Promise<UserModel> {
    // Validates the request body first before doing a db queries
    const parsedUserData = validateBody(userData, UserModelZodSchema);
    // You can add hashing here to hash the password of the user. Feel free to modify base on your needs.
    const existingUser = await this.userRepository.searchAndUpdate({
      email: parsedUserData.email,
    });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }
    return this.userRepository.createUser(parsedUserData);
  }

  async updateUser(updateData: Partial<UserModel>): Promise<UserModel | null> {
    if (!updateData._id) {
      throw new AppError("User ID is required", 400);
    }

    const user = await this.userRepository.updateUser(
      updateData._id,
      updateData,
    );
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async deleteUser(id: string): Promise<UserModel | null> {
    const user = await this.userRepository.deleteUser(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async searchUser(query: FilterQuery<UserModel>): Promise<UserModel | null> {
    const user = await this.userRepository.searchUser(query);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
}
