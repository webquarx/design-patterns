import { ITask, TTaskLimits } from './TInvoker';
import RetriesExecutor from './tasks/RetriesExecutor';
import ResultCollector from './tasks/ResultCollector';
import ParallelIterator from './tasks/ParallelIterator';
import PromiseResolvers from './PromiseResolvers';

export default class Parallel {
    private readonly promise = new PromiseResolvers<any[]>();

    private readonly iterator: ParallelIterator;

    private readonly results: ResultCollector;

    private args: any[] = [];

    constructor(
        tasks: ReadonlyArray<ITask>,
        private readonly limits?: TTaskLimits,
    ) {
        this.results = new ResultCollector(tasks);
        this.iterator = new ParallelIterator(tasks, this.limits?.concurrent);
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
        const task = this.iterator.current;

        const res = await new RetriesExecutor(task, this.limits?.retries).execute(...this.args);

        this.results.setIfNoError(task, res);
        this.iterator.complete();
        this.runNextTask();
    }
}
