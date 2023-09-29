export interface ICanExecuteFunc {
    (...args: any[]): boolean;
}

export interface ICanExecutable {
    canExecute: ICanExecuteFunc | boolean,
}

export interface IExecuteFunc {
    (...args: any[]): Promise<any>;
}

export interface IExecuteFuncCallback {
    (execute: IExecuteFunc, ...args: any[]): Promise<any>;
}

export default interface IExecutable {
    execute: IExecuteFunc;
}
