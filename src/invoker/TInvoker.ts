import ICommand from '../command/ICommand';

export interface IRetriesFunc {
    (command: ICommand, attempt: number, error: unknown, ...args: any[]): Promise<boolean>;
}

export type TRetries = number | IRetriesFunc;

export interface InvokerTask {
    command: ICommand,
    retries?: TRetries,
}

export interface InvokerTaskResult {
    error?: unknown,
    value?: any,
}

export type TInvokerTask = ICommand | InvokerTask;

export interface ICreateCommandFunc {
    (item: any): TInvokerTask;
}

export type TaskLimits = {
    concurrent?: number,
    retries?: TRetries,
};
