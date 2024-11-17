import { User, UserModel } from "../models/userModel";
import { FilterQuery, UpdateQuery } from "mongoose";

// Purpose: This file is responsible for handling all the database operations related to the user model.
export class UserRepository {
  // This method returns a user in the database that matches the id.
  async getUser(id: string): Promise<UserModel | null> {
    return User.findById(id);
  }

  // This method returns all the user in the database.
  async getUsers(): Promise<UserModel[]> {
    return User.find();
  }

  // This method creates a bew user in the database.
  async createUser(userData: Partial<UserModel>): Promise<UserModel> {
    return User.create(userData);
  }

  // This method updates a user in the database.
  async updateUser(id: string, userData: Partial<UserModel>): Promise<UserModel | null> {
    return User.findByIdAndUpdate(id, userData, { new: true });
  }

  // This method deletes a user from the database.
  async deleteUser(id: string): Promise<UserModel | null> {
    return User.findByIdAndDelete(id);
  }

  // This method searches for a user in the database that matches the query object.
  async searchUser(query: FilterQuery<UserModel>): Promise<UserModel | null> {
    return User.findOne(query);
  }

  async searchAndUpdate(
    query: FilterQuery<UserModel>,
    update?: UpdateQuery<UserModel>,
    options?: { multi?: boolean }
  ): Promise<UserModel | null | { modifiedCount: number }> {
    // If update is not provided, it simply searches for a user in the database. It returns the user if found, or null if not.
    if (!update) {
      return User.findOne(query);
    }

    // If update is provided, it checks if the multi option is specified in the options object. If multi is true, it updated all users in the database that match the query with the update. It returns an object with the modifiedCount property, which indicated the number of documents that were modified.
    if (options?.multi) {
      const result = await User.updateMany(query, update);
      return { modifiedCount: result.modifiedCount };
    }

    // If multi is not specified or is false, it updates the first user in the database that matches the query with the update. It returns the updated user.
    return User.findOneAndUpdate(query, update, { new: true });
  }
}
