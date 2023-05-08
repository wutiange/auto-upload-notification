/**
* Pgyer Response Class
* @template T The type of the 'data' property
*/
export interface PgyerResponse<T> {
    /**
     * The status code of the response
     */
    code: number;
    /**
     * The message of the response
     */
    message: string;
    /**
     * The data object of the response
     */
    data: T;
}
