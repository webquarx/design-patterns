import ICommand from '../command/ICommand';

export interface InvokerTask {
    command: ICommand,
    retries?: number,
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
    retries?: number,
};
