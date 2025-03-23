import { Query } from "mongoose";
import { paginationResult } from "./types";

class ApiFeatures<T> {
  public paginationResult:paginationResult;
  constructor(
    public query: Query<T[], T>,
    public queryString: Record<string, any>
  ) {}

  filter(): this {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr) );

    return this;
  }

  sort(): this {
    if (this.queryString.sort) {
      const sortBy:string = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      const fields:string = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate(countDocuments:number): this {
    const page:number = this.queryString.page || 1;
    const limit:number = this.queryString.limit  || 5;
    const skip:number = (page - 1) * limit;
    const endIndex:number = page * limit; // end index of the current page
    this.paginationResult.currentPage = page;
    this.paginationResult.limit = limit;
    this.paginationResult.numbersOfPages = Math.ceil(countDocuments / limit);
    if (endIndex < countDocuments) {
      this.paginationResult.nextPage= page + 1;
    }
    if (skip > 0) {
      this.paginationResult.previousPage = page - 1;
    }

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
