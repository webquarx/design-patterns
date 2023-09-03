interface IExecuteFunc {
    (...args: any[]): void;
}

export interface IExecuteFuncCallback {
    (execute: IExecuteFunc, ...args: any[]): void;
}

export default interface IExecutable {
    execute: IExecuteFunc;
}
