import IExecutable from '../../core/IExecutable';
import { ITask, ITaskResult } from '../TInvoker';

export default class TimeoutExecutor implements IExecutable {
    constructor(
        private readonly executor: IExecutable,
        private readonly task: ITask,
        private readonly timeout: number = 0,
    ) {
    }

    async execute(...args: any[]): Promise<ITaskResult> {
        const { command, timeout = this.timeout } = this.task;

        return await Promise.race([
            this.executor.execute(command, ...args),
            new Promise((resolve) => {
                setTimeout(resolve, timeout, { error: new Error('Operation reached timeout') });
            }),
        ]);
    }
}
