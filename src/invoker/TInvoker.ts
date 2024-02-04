import ICommand from '../command/ICommand';

export interface IRetriesFunc {
    (command: ICommand, attempt: number, error: unknown, ...args: any[]): Promise<boolean>;
}

export type TRetries = number | IRetriesFunc;

export enum TTaskStatus {
    idle = 'idle',
    pending = 'pending',
    fulfilled = 'fulfilled',
    rejected = 'rejected',
}

export interface ITaskResult {
    error?: unknown,
    value?: any,
}

export interface ITask {
    command: ICommand,
    retries?: TRetries,
    status?: TTaskStatus,
    result?: ITaskResult,
}

export type TTask = ICommand | ITask;

export interface ICreateCommandFunc {
    (item: any): TTask;
}

export type TaskLimits = {
    concurrent?: number,
    retries?: TRetries,
};
