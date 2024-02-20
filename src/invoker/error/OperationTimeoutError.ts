import OperationError from './OperationError';

export default class OperationTimeoutError extends OperationError {
    constructor(details? : object) {
        super('Operation Timeout', details);
        this.details.code = 'ETIME';
    }
}
