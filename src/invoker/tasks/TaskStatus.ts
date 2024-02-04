import { InvokerTask, ITaskResult, TTaskStatus } from '../TInvoker';

export default class TaskStatus {
    static get default(): TTaskStatus {
        return TTaskStatus.idle;
    }

    static setPending(task: InvokerTask): void {
        // eslint-disable-next-line no-param-reassign
        task.status = TTaskStatus.pending;
    }

    static setFromResult(task: InvokerTask, result: ITaskResult): void {
        // eslint-disable-next-line no-param-reassign
        task.status = result.error ? TTaskStatus.rejected : TTaskStatus.fulfilled;
    }
}
