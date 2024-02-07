import { ITask, ITaskResult } from '../TInvoker';
import FunctionExecutor from './FunctionExecutor';

export default class TimeoutExecutor extends FunctionExecutor {
    constructor(
        task: ITask,
        private readonly timeout: number = 0,
    ) {
        super(task);
    }

    async execute(...args: any[]): Promise<ITaskResult> {
        const { timeout = this.timeout } = this.task;

        return await Promise.race([
            super.execute(...args),
            new Promise<ITaskResult>((resolve) => {
                setTimeout(resolve, timeout, { error: new Error('Operation reached timeout') });
            }),
        ]);
    }
}
