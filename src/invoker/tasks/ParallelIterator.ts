import { ITask } from '../TInvoker';

export default class ParallelIterator {
    private currentIndex: number = 0;

    private runningTasks: number = 0;

    constructor(
        private readonly tasks: ReadonlyArray<ITask>,
        private readonly limit?: number,
    ) {}

    get current(): ITask {
        return this.tasks[this.currentIndex - 1];
    }

    get done(): boolean {
        return this.runningTasks === 0 && this.currentIndex === this.tasks.length;
    }

    next(): boolean {
        if (this.currentIndex < this.tasks.length
            && (this.limit === undefined || this.runningTasks < this.limit)
        ) {
            this.currentIndex++;
            this.runningTasks++;
            return true;
        }
        return false;
    }

    complete(): void {
        this.runningTasks--;
    }
}
