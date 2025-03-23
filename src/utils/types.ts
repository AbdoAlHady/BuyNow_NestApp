export type JwtPayloadType = {
    id: string;
    role: string;
};

export type paginationResult={
    currentPage: number;
    limit: number;
    numbersOfPages: number;
    nextPage?: number;
    previousPage?: number;
}