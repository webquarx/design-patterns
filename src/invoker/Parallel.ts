import { InvokerTask, TaskLimits } from './TInvoker';
import TaskExecutor from './TaskExecutor';
import InvokerTaskManager from './InvokerTaskManager';
import TaskIterator from './TaskIterator';
import PromiseResolvers from './PromiseResolvers';

export default class Parallel {
    private readonly promise = new PromiseResolvers<any[]>();

    private readonly iterator: TaskIterator;

    private readonly tasks: InvokerTaskManager;

    private args: any[] = [];

    constructor(
        tasks: InvokerTask[],
        private readonly limits?: TaskLimits,
    ) {
        this.tasks = new InvokerTaskManager(tasks);
        this.iterator = new TaskIterator(tasks.length, this.limits?.concurrent);
    }

    execute(...args: any[]): Promise<any[]> {
        this.args = args;

        return this.promise.create(
            () => this.runNextTask(),
        );
    }

    private runNextTask(): void {
        while (
            !this.tasks.hasError()
            && this.iterator.next()
        ) {
            this.executeTask();
        }

        if (this.tasks.hasError()) {
            this.promise.reject(this.tasks.error);
            return;
        }

        if (this.iterator.done) {
            this.promise.resolve(this.tasks.successful);
        }
    }

    private async executeTask(): Promise<void> {
        const { index } = this.iterator;
        const task = this.tasks.get(index);

        const res = await new TaskExecutor(task, this.limits?.retries).execute(...this.args);

        this.tasks.setResultIfNoError(index, res);
        this.iterator.complete();
        this.runNextTask();
    }
}
