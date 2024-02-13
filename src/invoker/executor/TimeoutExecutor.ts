import { ITask, ITaskResult } from '../TInvoker';
import FunctionExecutor from './FunctionExecutor';
import OperationTimeoutError from '../error/OperationTimeoutError';

export default class TimeoutExecutor extends FunctionExecutor {
    constructor(
        task: ITask,
        private readonly timeout: number = 0,
    ) {
        super(task);
    }

    execute(...args: any[]): Promise<ITaskResult> {
        const { timeout = this.timeout } = this.task;

        return Promise.race([
            super.execute(...args),
            new Promise<ITaskResult>((resolve) => {
                setTimeout(resolve, timeout, {
                    error: new OperationTimeoutError({
                        description: `The task with '${this.task.key}' key has reached timeout`,
                        task: this.task,
                    }),
                });
            }),
        ]);
    }
}
