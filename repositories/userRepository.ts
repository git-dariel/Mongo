import { User, UserModel } from "../models/userModel";
import { FilterQuery, UpdateQuery } from "mongoose";
import { ParsedQueryOptions } from "../helpers/queryBuilder";
import { sanitizeSelect } from "../helpers/common";

// Purpose: This file is responsible for handling all the database operations related to the user model.
export class UserRepository {


  async getUser(id: string, options?: ParsedQueryOptions): Promise<UserModel | null> {
    let query: any = User.findById(id);

    if (options?.select) {
      const sanitizedSelect = sanitizeSelect(options.select);
      query = query.select(sanitizedSelect);
    } else {
      query = query.select("-password");
    }

    if (options?.populate && options.populate.length > 0) {
      options.populate.forEach((path) => {
        query = query.populate(path);
      });
    }

    return query.exec();
  }

  async getUsers(options?: ParsedQueryOptions): Promise<UserModel[]> {
    let query: any = User.find(options?.filter || {});

    if (options?.select) {
      const sanitizedSelect = sanitizeSelect(options.select);
      query = query.select(sanitizedSelect);
    } else {
      query = query.select("-password");
    }

    if (options?.sort) query = query.sort(options.sort);
    

    if (options?.limit) query = query.limit(options.limit);
    

    if (options?.populate && options.populate.length > 0) {
      options.populate.forEach((path) => {
        query = query.populate(path);
      });
    }

    return query.exec();
  }

  async createUser(userData: Partial<UserModel>): Promise<UserModel> {
    return User.create(userData);
  }

  async updateUser(id: string, userData: Partial<UserModel>): Promise<UserModel | null> {
    return (User.findByIdAndUpdate(id, userData, { new: true }).select("-password") as any).exec();
  }

  async deleteUser(id: string): Promise<UserModel | null> {
    return User.findByIdAndDelete(id);
  }


  async searchUser(query: FilterQuery<UserModel>): Promise<UserModel | null> {
    return (User.findOne(query).select("-password") as any).exec();
  }

  async searchAndUpdate(
    query: FilterQuery<UserModel>,
    update?: UpdateQuery<UserModel>,
    options?: { multi?: boolean }
  ): Promise<UserModel | null | { modifiedCount: number }> {
    if (!update) {
      return (User.findOne(query).select("-password") as any).exec();
    }

    if (options?.multi) {
      const result = await User.updateMany(query, update);
      return { modifiedCount: result.modifiedCount };
    }

    return (User.findOneAndUpdate(query, update, { new: true }).select("-password") as any).exec();
  }
}
