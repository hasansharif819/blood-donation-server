// type IOptions = {
//     page?: number,
//     limit?: number,
//     sortOrder?: string,
//     sortBy?: string
// }

import { IPaginationOptions } from "../app/interfaces/pagination";

// type IOptionsResult = {
//     page: number,
//     limit: number,
//     skip: number,
//     sortBy: string,
//     sortOrder: string
// }

// const calculatePagination = (options: IOptions): IOptionsResult => {

//     const page: number = Number(options.page) || 1;
//     const limit: number = Number(options.limit) || 10;
//     const skip: number = (Number(page) - 1) * limit;

//     const sortBy: string = options.sortBy || 'createdAt';
//     const sortOrder: string = options.sortOrder || 'desc';

//     return {
//         page,
//         limit,
//         skip,
//         sortBy,
//         sortOrder
//     }
// }


// export const paginationHelper = {
//     calculatePagination
// }

export const paginationHelper = {
  calculatePagination: (options: IPaginationOptions) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  },
};
