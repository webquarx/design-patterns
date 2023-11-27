import ICommand from '../command/ICommand';

export interface InvokerTask {
    command: ICommand,
}

export type TInvokerTask = ICommand | InvokerTask;

export interface ICreateCommandFunc {
    (item: any): TInvokerTask;
}
