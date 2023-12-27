import { InvokerTask } from './TInvoker';
import TaskExecutor from './TaskExecutor';

export default class Parallel {
    private currentIndex: number = 0;

    private runningTasks: number = 0;

    private results: any[] = [];

    private errors: any[] = [];

    private args: any[] = [];

    private promiseResolve!: (value: (any[] | PromiseLike<any[]>)) => void;

    private promiseReject!: (reason?: any) => void;

    constructor(
        private readonly tasks: InvokerTask[],
        private limit?: number,
    ) {}

    execute(...args: any[]): Promise<any[]> {
        this.args = args;

        return new Promise<any[]>((resolve, reject) => {
            this.promiseResolve = resolve;
            this.promiseReject = reject;
            this.runNextTask();
        });
    }

    private runNextTask(): void {
        while (
            !this.hasError()
            && this.currentIndex < this.tasks.length
            && (this.limit === undefined || this.runningTasks < this.limit)
        ) {
            const index = this.currentIndex++;
            this.executeTask(index);
        }

        if (this.hasError()) {
            this.currentIndex = 0;
            this.limit = undefined;

            const error = this.errors.find((item) => !!item);
            this.promiseReject(error);
            return;
        }

        if (this.runningTasks === 0 && this.currentIndex === this.tasks.length) {
            this.currentIndex = 0;
            this.limit = undefined;

            this.promiseResolve(this.results);
        }
    }

    private async executeTask(index: number): Promise<void> {
        this.runningTasks++;

        const task = this.tasks[index];
        const res = await new TaskExecutor(task).execute(...this.args);
        if (!this.hasError()) {
            if (res.error) {
                this.errors[index] = res.error;
            } else {
                this.results[index] = res.value;
            }
        }
        this.runningTasks--;
        this.runNextTask();
    }

    private hasError(): boolean {
        return this.errors.length > 0;
    }
}
