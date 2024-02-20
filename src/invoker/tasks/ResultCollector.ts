import { ITask, ITaskResult } from '../TInvoker';
import OperationCanceledError from '../error/OperationCanceledError';

export default class ResultCollector {
    private firstFailedTask?: ITask;

    private firstFailedTaskIndex = -1;

    constructor(private readonly tasks: ReadonlyArray<ITask>) {
    }

    hasError(): boolean {
        return !!this.firstFailedTask;
    }

    set(task: ITask, result: ITaskResult): void {
        const item = task;
        item.result = result;

        if (result.error && !this.hasError()) {
            this.firstFailedTask = item;
            this.firstFailedTaskIndex = this.tasks.indexOf(item);
        }
    }

    get successful(): any[] {
        return this.tasks.map((item) => item.result?.value);
    }

    get error(): unknown {
        return this.firstFailedTask?.result?.error;
    }

    cancelTasksAfterError(): ITask[] {
        const res = this.tasks.slice(this.firstFailedTaskIndex + 1);
        res.forEach((task) => this.set(task, {
            error: new OperationCanceledError({
                description: `The task with '${task.key}' key was canceled`,
                task,
            }),
        }));
        return res;
    }
}
