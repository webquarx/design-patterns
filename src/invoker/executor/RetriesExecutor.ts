import { ITask, ITaskResult, TRetries } from '../TInvoker';
import IExecutable from '../../core/IExecutable';
import FunctionExecutor from './FunctionExecutor';

export default class RetriesExecutor extends FunctionExecutor {
    constructor(
        task: ITask,
        private readonly executor?: IExecutable,
        private readonly retries: TRetries = 1,
    ) {
        super(task);
    }

    async execute(...args: any[]): Promise<ITaskResult> {
        return await this.tryExecute(1, args);
    }

    private async tryExecute(attempt: number, args: any[]): Promise<ITaskResult> {
        const { command, retries = this.retries } = this.task;

        const result = await this.executeCommand(args);

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

    private executeCommand(args: any[]): Promise<ITaskResult> {
        if (this.executor) {
            return this.executor.execute(...args);
        }
        return super.execute(...args);
    }
}
