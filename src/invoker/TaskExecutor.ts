import { InvokerTask, InvokerTaskResult } from './TInvoker';
import executeCommand from '../core/executeCommand';
import IExecutable from '../core/IExecutable';

export default class TaskExecutor implements IExecutable {
    constructor(private readonly task: InvokerTask) {
    }

    async execute(...args: any[]): Promise<InvokerTaskResult> {
        return await this.tryExecute(1, args);
    }

    private async tryExecute(attempt: number, args: any[]): Promise<InvokerTaskResult> {
        const { command, retries = 1 } = this.task;
        try {
            const value = await executeCommand(command, ...args);
            return { value };
        } catch (error: unknown) {
            if (attempt >= retries) {
                return { error };
            }
        }
        return await this.tryExecute(attempt + 1, args);
    }
}
