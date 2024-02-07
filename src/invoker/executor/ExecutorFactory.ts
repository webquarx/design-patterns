import { ITask, TTaskLimits } from '../TInvoker';
import RetriesExecutor from './RetriesExecutor';
import FunctionExecutor from './FunctionExecutor';
import IExecutable from '../../core/IExecutable';
import TimeoutExecutor from './TimeoutExecutor';

export default class ExecutorFactory {
    constructor(
        private readonly task: ITask,
        private readonly limits?: TTaskLimits,
    ) {}

    create(): IExecutable {
        const defaultExecutor = new FunctionExecutor(this.task);

        let timeoutExecutor;
        if (this.isTimeout()) {
            timeoutExecutor = new TimeoutExecutor(
                defaultExecutor,
                this.task,
                this.limits?.timeout,
            );
        }

        const executor = timeoutExecutor || defaultExecutor;

        if (this.isRetries()) {
            return new RetriesExecutor(
                executor,
                this.task,
                this.limits?.retries,
            );
        }
        return executor;
    }

    private isRetries(): boolean {
        const retries = this.limits?.retries;
        if (typeof retries === 'number' && retries === 1) {
            return false;
        }
        return typeof retries !== 'undefined';
    }

    private isTimeout(): boolean {
        return typeof this.limits?.timeout !== 'undefined' || typeof this.task.timeout !== 'undefined';
    }
}
