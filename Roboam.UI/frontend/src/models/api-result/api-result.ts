export type IApiResult = IApiResultSuccess | IApiResultError;

export interface IApiResultBase {
    readonly isSuccessful: boolean;
}

export interface IApiResultSuccess extends IApiResultBase {
    readonly isSuccessful: true;
}

export interface IApiResultError extends IApiResultBase {
    readonly isSuccessful: false;
    readonly error: string;
    readonly warnings: string[];
}

export class ApiResult {
    constructor(
        public readonly isSuccessful: boolean,
        public readonly error?: string,
        public readonly warnings?: string[],
    ) {}

    public static Success(_?: unknown): IApiResultSuccess {
        return new ApiResult(true) as IApiResultSuccess;
    }

    public static Error(error: string = "unexpected error", warnings: string[] = []): IApiResultError {
        return new ApiResult(false, error, warnings) as IApiResultError;
    }

    public static IsSuccess(result: IApiResult): result is IApiResultSuccess {
        return result.isSuccessful;
    }

    public static IsError(result: IApiResult): result is IApiResultError {
        return !ApiResult.IsSuccess(result);
    }
}
