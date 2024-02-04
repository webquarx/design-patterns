import { ITask, ITaskResult, TTaskStatus } from '../TInvoker';

export default class TaskStatus {
    static get default(): TTaskStatus {
        return TTaskStatus.idle;
    }

    static setPending(task: ITask): void {
        // eslint-disable-next-line no-param-reassign
        task.status = TTaskStatus.pending;
    }

    static setFromResult(task: ITask, result: ITaskResult): void {
        // eslint-disable-next-line no-param-reassign
        task.status = result.error ? TTaskStatus.rejected : TTaskStatus.fulfilled;
    }
}
