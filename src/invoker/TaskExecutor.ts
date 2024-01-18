import { InvokerTask, InvokerTaskResult, TRetries } from './TInvoker';
import executeCommand from '../core/executeCommand';
import IExecutable from '../core/IExecutable';

export default class TaskExecutor implements IExecutable {
    constructor(
        private readonly task: InvokerTask,
        private readonly retries: TRetries = 1,
    ) {
    }

    async execute(...args: any[]): Promise<InvokerTaskResult> {
        return await this.tryExecute(1, args);
    }

    private async tryExecute(attempt: number, args: any[]): Promise<InvokerTaskResult> {
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
