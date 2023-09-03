interface IExecuteFunc {
    (...args: any[]): void;
}

export default interface IExecutable {
    execute: IExecuteFunc;
}
