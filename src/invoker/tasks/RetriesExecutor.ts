import { ITask, ITaskResult, TRetries } from '../TInvoker';
import executeCommand from '../../core/executeCommand';
import IExecutable from '../../core/IExecutable';
import TaskStatus from './TaskStatus';

export default class RetriesExecutor implements IExecutable {
    constructor(
        private readonly task: ITask,
        private readonly retries: TRetries = 1,
    ) {
    }

    async execute(...args: any[]): Promise<ITaskResult> {
        TaskStatus.setPending(this.task);

        const res = await this.tryExecute(1, args);

        TaskStatus.setFromResult(this.task, res);
        return res;
    }

    private async tryExecute(attempt: number, args: any[]): Promise<ITaskResult> {
        const { command, retries = this.retries } = this.task;
        try {
            const value = await executeCommand(command, ...args);
            return { value };
        } catch (error: unknown) {
            if (typeof retries === 'number' && attempt >= retries) {
                return { error };
            }
            if (typeof retries === 'function' && !await retries(command, attempt, error, ...args)) {
                return { error };
            }
        }
        return await this.tryExecute(attempt + 1, args);
    }
}
