import { InvokerTask, InvokerTaskResult } from './TInvoker';

export default class InvokerTaskManager {
    private firstFailedTask?: InvokerTask;

    constructor(private readonly tasks: InvokerTask[]) {
    }

    get(index: number): InvokerTask {
        return this.tasks[index];
    }

    setResultIfNoError(index: number, result: InvokerTaskResult): void {
        if (!this.hasError()) {
            this.setResult(index, result);
        }
    }

    hasError(): boolean {
        return !!this.firstFailedTask;
    }

    setResult(index: number, result: InvokerTaskResult): void {
        const task = this.tasks[index];
        task.result = result;

        if (result.error && !this.hasError()) {
            this.firstFailedTask = task;
        }
    }

    get successful(): any[] {
        return this.tasks.map((item) => item.result?.value);
    }

    get error(): unknown {
        return this.firstFailedTask?.result?.error;
    }
}
