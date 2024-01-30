import { InvokerTask, InvokerTaskResult, InvokerTaskStatus as TaskStatus } from '../TInvoker';

export default class InvokerTaskStatus {
    static get default(): TaskStatus {
        return TaskStatus.idle;
    }

    static setPending(task: InvokerTask): void {
        // eslint-disable-next-line no-param-reassign
        task.status = TaskStatus.pending;
    }

    static setFromResult(task: InvokerTask, result: InvokerTaskResult): void {
        // eslint-disable-next-line no-param-reassign
        task.status = result.error ? TaskStatus.rejected : TaskStatus.fulfilled;
    }
}
