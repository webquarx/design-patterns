import { ITask, TRetries, TTaskLimits } from '../TInvoker';
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
        const timeoutExecutor = this.isTimeout()
            ? new TimeoutExecutor(this.task, this.limits?.timeout)
            : undefined;

        if (this.isRetries()) {
            return new RetriesExecutor(
                this.task,
                timeoutExecutor,
                this.limits?.retries,
            );
        }

        return timeoutExecutor || new FunctionExecutor(this.task);
    }

    private isRetries(): boolean {
        return this.checkRetries(this.limits?.retries) || this.checkRetries(this.task.retries);
    }

    // eslint-disable-next-line class-methods-use-this
    private checkRetries(retries?: TRetries): boolean {
        if (typeof retries === 'number' && retries === 1) {
            return false;
        }
        return typeof retries !== 'undefined';
    }

    private isTimeout(): boolean {
        return typeof this.limits?.timeout !== 'undefined' || typeof this.task.timeout !== 'undefined';
    }
}
