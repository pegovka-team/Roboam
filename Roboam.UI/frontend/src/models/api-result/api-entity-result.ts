import { ApiResult, IApiResultError, IApiResultSuccess } from "./api-result";

export type IApiEntityResult<T> = IApiEntityResultSuccess<T> | IApiEntityResultError;

export interface IApiEntityResultSuccess<T> extends IApiResultSuccess {
    readonly result: T;
}

// tslint:disable-next-line:no-empty-interface
export interface IApiEntityResultError extends IApiResultError {}

export class ApiEntityResult<T> extends ApiResult {
    constructor(isSuccessful: boolean, error?: string, warnings?: string[], public readonly result?: T) {
        super(isSuccessful, error, warnings);
    }

    public static Success<T>(result: T): IApiEntityResultSuccess<T> {
        return new ApiEntityResult<T>(true, "", [], result) as IApiEntityResultSuccess<T>;
    }

    public static Error(error: string = "unexpected error", warnings: string[] = []): IApiEntityResultError {
        return new ApiEntityResult(false, error, warnings) as IApiEntityResultError;
    }
}
