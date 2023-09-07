interface IExecuteFunc {
    (...args: any[]): void;
}

export interface ICanExecuteFunc {
    (...args: any[]): boolean;
}

export interface IExecuteFuncCallback {
    (execute: IExecuteFunc, ...args: any[]): void;
}

export default interface IExecutable {
    execute: IExecuteFunc;
}
