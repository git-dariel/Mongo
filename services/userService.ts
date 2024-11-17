import { UserRepository } from "../repositories/userRepository";
import { AppError } from "../middleware/errorHandler";
import { UserModel } from "../models/userModel";
import { FilterQuery } from "mongoose";

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
    // You can add hashing here to hash the password of the user. Feel free to modify base on your needs.
    const existingUser = await this.userRepository.searchAndUpdate({ email: userData.email });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }
    return this.userRepository.createUser(userData);
  }

  async updateUser(params: Partial<UserModel>): Promise<UserModel | null> {
    const user = await this.userRepository.updateUser(params._id, params);
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
