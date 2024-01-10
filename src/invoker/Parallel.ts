import { InvokerTask } from './TInvoker';
import TaskExecutor from './TaskExecutor';
import TaskResults from './TaskResults';
import TaskIterator from './TaskIterator';
import PromiseResolvers from './PromiseResolvers';

export default class Parallel {
    private readonly promise = new PromiseResolvers<any[]>();

    private readonly iterator: TaskIterator;

    private results = new TaskResults();

    private args: any[] = [];

    constructor(
        private readonly tasks: InvokerTask[],
        limit?: number,
    ) {
        this.iterator = new TaskIterator(this.tasks.length, limit);
    }

    execute(...args: any[]): Promise<any[]> {
        this.args = args;

        return this.promise.create(
            () => this.runNextTask(),
        );
    }

    private runNextTask(): void {
        while (
            !this.results.hasError()
            && this.iterator.next()
        ) {
            this.executeTask();
        }

        if (this.results.hasError()) {
            this.promise.reject(this.results.error);
            return;
        }

        if (this.iterator.done) {
            this.promise.resolve(this.results.successful);
        }
    }

    private async executeTask(): Promise<void> {
        const { index } = this.iterator;
        const task = this.tasks[index];

        const res = await new TaskExecutor(task).execute(...this.args);

        this.results.setIfNoError(index, res);
        this.iterator.complete();
        this.runNextTask();
    }
}
