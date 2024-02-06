import { ITask, TTaskLimits } from '../TInvoker';
import RetriesExecutor from './RetriesExecutor';
import FunctionExecutor from './FunctionExecutor';
import IExecutable from '../../core/IExecutable';

export default class ExecutorFactory {
    constructor(
        private readonly task: ITask,
        private readonly limits?: TTaskLimits,
    ) {}

    create(): IExecutable {
        const defaultExecutor = new FunctionExecutor(this.task);

        if (this.isRetries()) {
            return new RetriesExecutor(
                defaultExecutor,
                this.task,
                this.limits?.retries,
            );
        }
        return defaultExecutor;
    }

    private isRetries(): boolean {
        const retries = this.limits?.retries;
        if (typeof retries === 'number' && retries === 1) {
            return false;
        }
        return typeof retries !== 'undefined';
    }
}
