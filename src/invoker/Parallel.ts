import { InvokerTask } from './TInvoker';
import executeCommand from '../core/executeCommand';

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
            !this.errors.length
            && this.currentIndex < this.tasks.length
            && (this.limit === undefined || this.runningTasks < this.limit)
        ) {
            const index = this.currentIndex++;
            this.executeTask(index);
        }

        if (this.errors.length) {
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
        const task = this.tasks[index];

        try {
            this.runningTasks++;
            const res = await executeCommand(task.command, ...this.args);
            if (!this.errors.length) {
                this.results[index] = res;
            }
        } catch (error) {
            if (!this.errors.length) {
                this.errors[index] = error;
            }
        } finally {
            this.runningTasks--;
            this.runNextTask();
        }
    }
}
