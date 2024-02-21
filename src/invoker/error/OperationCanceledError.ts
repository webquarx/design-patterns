import OperationError from './OperationError';

export default class OperationCanceledError extends OperationError {
    constructor(details? : object) {
        super('Operation Canceled', details);
        this.details.code = 'ECANCEL';
    }
}
