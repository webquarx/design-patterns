import { InvokerTask, InvokerTaskResult } from './TInvoker';
import executeCommand from '../core/executeCommand';
import IExecutable from '../core/IExecutable';

export default class TaskExecutor implements IExecutable {
    constructor(private readonly task: InvokerTask) {
    }

    async execute(...args: any[]): Promise<InvokerTaskResult> {
        try {
            const value = await executeCommand(this.task.command, ...args);
            return { value };
        } catch (error: unknown) {
            return { error };
        }
    }
}
