import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Cancel, Canceler } from "axios";
import {
    ApiEntityResult,
    IApiEntityResult,
    IApiEntityResultError,
    IApiEntityResultSuccess
} from "../models/api-result/api-entity-result";
import { RoboamApiError } from "../models/api-result/api-error";

axios.defaults.baseURL = "http://localhost:3001";

export async function get<T>(url: string, config?: AxiosRequestConfig, showErrorMessage: boolean = false): Promise<T | never> {
    const response = await getInternal<T>(url, config);
    if (response instanceof Object) {
        if (response.isSuccessful) {
            return response.result;
        }
        const error = new RoboamApiError(response.error);
        if (showErrorMessage) {
            showApiError(error);
        }
        throw error;
    }
    throw new RoboamApiError();
}

export async function post<T>(url: string, data?: unknown, canceler?: { cancel: Canceler }): Promise<ApiEntityResult<T>> {
    try {
        const response = await axios.post(url, JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
            },
            cancelToken: new axios.CancelToken(c => {
                if (canceler) {
                    canceler.cancel = c;
                }
            }),
        });

        checkResponseCode(response);

        return extractResponse(response, true);
    } catch (error) {
        if (error instanceof AxiosError || (error as Cancel) !== undefined) {
            const thrown: AxiosError | Cancel = error as AxiosError | Cancel;

            if (!axios.isCancel(thrown))
                return ApiEntityResult.Error();
        }
        if (error instanceof Error) {
            return ApiEntityResult.Error(error.message);
        }
        return ApiEntityResult.Error();
    }
}

export async function del<T>(url: string): Promise<IApiEntityResult<T>> {
    try {
        const response = await axios.delete(url);

        checkResponseCode(response);

        return extractResponse(response, true);
    } catch (error) {
        if (error instanceof Error) {
            return ApiEntityResult.Error(error.message);
        }
        return ApiEntityResult.Error();
    }
}

async function getInternal<T>(url: string, config?: AxiosRequestConfig): Promise<IApiEntityResult<T> | void> {
    try {
        const response = await axios.get<IApiEntityResult<T>>(url, config);

        checkResponseCode(response);

        return extractResponse(response, false);
    } catch (error) {
        if (error instanceof AxiosError || (error as Cancel) !== undefined) {
            const thrown: AxiosError | Cancel = error as AxiosError | Cancel;

            if (axios.isCancel(thrown))
                return;
        }
        if (error instanceof Error) {
            return ApiEntityResult.Error(error.message);
        }
        return ApiEntityResult.Error();
    }
}

function checkResponseCode<T>(response: AxiosResponse<T>): void | never {
    if (response.status !== 200) {
        throw new RoboamApiError(`API request failed with status code ${response.status}. ${response.statusText}`);
    }
}

function extractResponse<T>(response: AxiosResponse<IApiEntityResult<T>>, showErrorMessage: boolean): IApiEntityResultError | IApiEntityResultSuccess<T> {
    if (!response.data.isSuccessful) {
        const data = response.data;
        if (showErrorMessage) {
            showApiError(data.error);
        }
        return ApiEntityResult.Error(data.error, data.warnings);
    }
    return response.data;
}

function showApiError(message: RoboamApiError | string) {
    if (message instanceof RoboamApiError) {
        console.log(message.message);
    }
    console.log(message);
}