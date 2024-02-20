import { ITask, ITaskResult, TTaskStatus } from '../TInvoker';

export default class TaskStatus {
    static get default(): TTaskStatus {
        return TTaskStatus.idle;
    }

    static setPending(task: ITask): void {
        // eslint-disable-next-line no-param-reassign
        task.status = TTaskStatus.pending;
    }

    static setFromResult(task: ITask, result?: ITaskResult): void {
        // eslint-disable-next-line no-param-reassign
        task.status = result?.error ? TTaskStatus.rejected : TTaskStatus.fulfilled;
    }

    static isFinalStatus(status?: TTaskStatus): boolean {
        return status === TTaskStatus.fulfilled || status === TTaskStatus.rejected;
    }

    static cancelTasks(tasks: ITask[]): void {
        tasks
            .filter((task) => !TaskStatus.isFinalStatus(task.status))
            .forEach((task) => TaskStatus.setFromResult(task, task.result));
    }
}
