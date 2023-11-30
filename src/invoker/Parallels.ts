import { InvokerTask } from './TInvoker';

export default class Parallels {
    private limit?: number;

    private currentIndex: number = 0;

    private runningTasks: number = 0;

    private results: any[] = [];

    private resolvePromise!: (value: (any[] | PromiseLike<any[]>)) => void;

    constructor(private readonly tasks: InvokerTask[]) {
    }

    execute(limit?: number): Promise<any[]> {
        this.limit = limit;

        return new Promise<any[]>((resolve) => {
            this.resolvePromise = resolve;
            this.runNextTask();
        });
    }

    private runNextTask(): void {
        while (
            this.currentIndex < this.tasks.length
            && (this.limit === undefined || this.runningTasks < this.limit)
        ) {
            const index = this.currentIndex++;
            this.runningTasks++;
            this.executeTask(index);
        }

        if (this.runningTasks === 0 && this.currentIndex === this.tasks.length) {
            this.currentIndex = 0;
            this.limit = undefined;
            this.resolvePromise(this.results);
        }
    }

    private async executeTask(index: number): Promise<void> {
        const task = this.tasks[index];

        try {
            this.results[index] = await task.command.execute();
        } finally {
            this.runningTasks--;
            this.runNextTask();
        }
    }
}
