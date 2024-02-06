import IExecutable from '../../core/IExecutable';
import executeCommand from '../../core/executeCommand';
import { ITask, ITaskResult } from '../TInvoker';

export default class FunctionExecutor implements IExecutable {
    constructor(private readonly task: ITask) {
    }

    async execute(...args: any[]): Promise<ITaskResult> {
        try {
            const value = await executeCommand(this.task.command, ...args);
            return { value };
        } catch (error) {
            return { error };
        }
    }
}
