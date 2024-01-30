import { InvokerTask, InvokerTaskResult } from '../TInvoker';

export default class ResultCollector {
    private firstFailedTask?: InvokerTask;

    constructor(private readonly tasks: ReadonlyArray<InvokerTask>) {
    }

    setIfNoError(task: InvokerTask, result: InvokerTaskResult): void {
        if (!this.hasError()) {
            this.set(task, result);
        }
    }

    hasError(): boolean {
        return !!this.firstFailedTask;
    }

    set(task: InvokerTask, result: InvokerTaskResult): void {
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
