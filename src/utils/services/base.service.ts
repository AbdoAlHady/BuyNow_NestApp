import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ApiFeatures from '../api-features';

@Injectable()
export class BaseService<T> {
  constructor(@InjectModel('ModelName') private readonly model: Model<T>) {}

  /**
   * find all documents with pagination and filtering
   * @param queryParams - query params for filtering and pagination
   * @return paginated documents from db
   */
  public async findAll(queryParams: any, populationOpt?: string,select?: string) {
    const totalDocuments = await this.model.countDocuments();
    const apiFeatures = new ApiFeatures<T>(this.model.find(), queryParams)
      .filter()
      .sort()
      .limitFields()
      .paginate(totalDocuments);

    const { paginationResult, query } = apiFeatures;
    let documents :T[];
    if (populationOpt) {
      documents = await query.populate(populationOpt).select(select??'');
    } else {
      documents = await query.select(select??'');
    }
    return {
      paginationResult,
      data: documents,
    };
  }

  /**
   * find document by id
   * @param id - id of document to find
   * @param populationOpt - optional population options
   * @return found document from db
   */
  public async findOne(id: string, populationOpt?: string) {
    let query = this.model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    const document = await query;
    if (!document) {
      throw new NotFoundException(`Document not found`);
    }
    return {
      data: document,
    };
  }

  /**
   * create document
   * @param data - data to create document
   * @return created document from db
   */
  public async createOne(data: Partial<T>) {
    const document = await this.model.create(data);
    return {
      data: document,
    };
  }

  /**
   * update document by id
   * @param id
   * @param data
   * @return updated document from db
   */
  public async updateOne(id: string, data: Partial<T>) {
    const newDocument = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!newDocument) {
      throw new NotFoundException(`Document not found`);
    }
    await newDocument.save();
    return {
      data: newDocument,
    };
  }

  /**
   * delete document by id
   * @param id
   */
  public async deleteOne(id: string): Promise<void> {
    const document = await this.model.findById(id);
    if (!document) {
      throw new NotFoundException(`Document not found`);
    }
    await document.deleteOne();
  }
}
