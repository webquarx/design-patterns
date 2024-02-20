export default abstract class OperationError extends Error {
    public readonly details = { code: '' };

    protected constructor(error: string, details? : object) {
        super(error);
        Object.setPrototypeOf(this, OperationError.prototype);

        if (details) {
            this.details = { ...this.details, ...details };
        }
    }
}
