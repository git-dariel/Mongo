import { Document, FilterQuery } from "mongoose";

export interface QueryOptions {
  fields?: string;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  filter?: string;
  populate?: string;
}

export interface ParsedQueryOptions {
  select: string;
  limit: number;
  sort: Record<string, 1 | -1>;
  filter: FilterQuery<any>;
  populate?: string[];
}

// Purpose: Parses and transforms query parameters into Mongoose-compatible query options for filtering, sorting, and field selection.
export class QueryBuilder {
  static parse<T extends Document>(options: QueryOptions, defaultLimit: number = 10): ParsedQueryOptions {
    const select = options.fields ? options.fields.split(",").join(" ") : "_id";

    const limit = options.limit ? parseInt(String(options.limit), 10) : defaultLimit;

    const sortField = options.sort || "createdAt";
    const sortOrder = options.order === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const filter: FilterQuery<T> = this.parseFilter(options.filter || "");

    const populate = options.populate ? options.populate.split(",") : undefined;

    return { select, limit, sort, filter, populate };
  }

  private static parseFilter(filterString: string): FilterQuery<any> {
    if (!filterString) return {};

    const filter: FilterQuery<any> = {};
    const conditions = filterString.split(",");

    conditions.forEach((condition) => {
      const [field, value] = condition.split(":").map((s) => s.trim());
      if (field && value) {
        if (value.startsWith(">=")) {
          filter[field] = { $gte: value.substring(2) };
        } else if (value.startsWith("<=")) {
          filter[field] = { $lte: value.substring(2) };
        } else if (value.startsWith(">")) {
          filter[field] = { $gt: value.substring(1) };
        } else if (value.startsWith("<")) {
          filter[field] = { $lt: value.substring(1) };
        } else if (value.includes("*")) {
          filter[field] = { $regex: value.replace(/\*/g, ".*"), $options: "i" };
        } else {
          filter[field] = value;
        }
      }
    });

    return filter;
  }
}