export default class OperationTimeoutError extends Error {
    public readonly details = { code: 'ETIME' };

    constructor(details? : object) {
        super('Operation Timeout');
        Object.setPrototypeOf(this, OperationTimeoutError.prototype);

        if (details) {
            this.details = { ...this.details, ...details };
        }
    }
}
