import { ITask, ITaskResult } from '../TInvoker';

export default class ResultCollector {
    private firstFailedTask?: ITask;

    constructor(private readonly tasks: ReadonlyArray<ITask>) {
    }

    setIfNoError(task: ITask, result: ITaskResult): void {
        if (!this.hasError()) {
            this.set(task, result);
        }
    }

    hasError(): boolean {
        return !!this.firstFailedTask;
    }

    set(task: ITask, result: ITaskResult): void {
        const item = task;
        item.result = result;

        if (result.error && !this.hasError()) {
            this.firstFailedTask = item;
        }
    }

    get successful(): any[] {
        return this.tasks.map((item) => item.result?.value);
    }

    get error(): unknown {
        return this.firstFailedTask?.result?.error;
    }
}
