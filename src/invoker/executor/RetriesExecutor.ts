import { ITask, ITaskResult, TRetries } from '../TInvoker';
import IExecutable from '../../core/IExecutable';

export default class RetriesExecutor implements IExecutable {
    constructor(
        private readonly executor: IExecutable,
        private readonly task: ITask,
        private readonly retries: TRetries = 1,
    ) {
    }

    async execute(...args: any[]): Promise<ITaskResult> {
        return await this.tryExecute(1, args);
    }

    private async tryExecute(attempt: number, args: any[]): Promise<ITaskResult> {
        const { command, retries = this.retries } = this.task;

        const result = await this.executor.execute(command, ...args);

        if (result.error) {
            if (typeof retries === 'number' && attempt >= retries) {
                return result;
            }
            if (typeof retries === 'function' && !await retries(command, attempt, result.error, ...args)) {
                return result;
            }
            return await this.tryExecute(attempt + 1, args);
        }

        return result;
    }
}
