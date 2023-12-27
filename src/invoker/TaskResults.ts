import { InvokerTaskResult } from './TInvoker';

export default class TaskResults {
    private readonly results: InvokerTaskResult[] = [];

    private firstFailedTask?: InvokerTaskResult;

    setIfNoError(index: number, result: InvokerTaskResult): void {
        if (!this.hasError()) {
            this.set(index, result);
        }
    }

    hasError(): boolean {
        return !!this.firstFailedTask;
    }

    set(index: number, result: InvokerTaskResult): void {
        this.results[index] = result;

        if (result.error && !this.hasError()) {
            this.firstFailedTask = result;
        }
    }

    get successful(): any[] {
        return this.results.map((item) => item.value);
    }

    get error(): unknown {
        return this.firstFailedTask?.error;
    }
}
