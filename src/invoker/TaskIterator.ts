export default class TaskIterator {
    private currentIndex: number = 0;

    private runningTasks: number = 0;

    constructor(
        private readonly length: number,
        private readonly limit?: number,
    ) {}

    get index(): number {
        return this.currentIndex - 1;
    }

    get done(): boolean {
        return this.runningTasks === 0 && this.currentIndex === this.length;
    }

    next(): boolean {
        if (this.currentIndex < this.length
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
