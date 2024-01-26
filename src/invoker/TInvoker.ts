import ICommand from '../command/ICommand';

export interface IRetriesFunc {
    (command: ICommand, attempt: number, error: unknown, ...args: any[]): Promise<boolean>;
}

export type TRetries = number | IRetriesFunc;

export enum InvokerTaskStatus {
    idle = 'idle',
    pending = 'pending',
    fulfilled = 'fulfilled',
    rejected = 'rejected',
}

export interface InvokerTask {
    command: ICommand,
    status?: InvokerTaskStatus,
    retries?: TRetries,
    result?: InvokerTaskResult,
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
