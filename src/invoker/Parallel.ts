import { InvokerTask } from './TInvoker';
import TaskExecutor from './TaskExecutor';
import TaskResults from './TaskResults';

export default class Parallel {
    private currentIndex: number = 0;

    private runningTasks: number = 0;

    private results = new TaskResults();

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
            !this.results.hasError()
            && this.currentIndex < this.tasks.length
            && (this.limit === undefined || this.runningTasks < this.limit)
        ) {
            const index = this.currentIndex++;
            this.executeTask(index);
        }

        if (this.results.hasError()) {
            this.currentIndex = 0;
            this.limit = undefined;

            this.promiseReject(this.results.error);
            return;
        }

        if (this.runningTasks === 0 && this.currentIndex === this.tasks.length) {
            this.currentIndex = 0;
            this.limit = undefined;

            this.promiseResolve(this.results.successful);
        }
    }

    private async executeTask(index: number): Promise<void> {
        this.runningTasks++;

        const task = this.tasks[index];
        const res = await new TaskExecutor(task).execute(...this.args);
        this.results.setIfNoError(index, res);

        this.runningTasks--;
        this.runNextTask();
    }
}
