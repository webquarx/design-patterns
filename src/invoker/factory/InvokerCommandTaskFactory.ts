import { ITask, TTask } from '../TInvoker';
import TaskStatus from '../tasks/TaskStatus';
import TaskResult from '../tasks/TaskResult';
import TaskKey from '../tasks/TaskKey';

export default class InvokerCommandTaskFactory {
    create(item: TTask): ITask {
        const task = this.getTask(item);
        if (!task.key) {
            task.key = TaskKey.generate();
        }
        if (!task.status) {
            task.status = TaskStatus.default;
        }
        if (!task.result) {
            task.result = TaskResult.default;
        }
        if (!task.retries) {
            task.retries = undefined;
        }
        if (!task.timeout) {
            task.timeout = undefined;
        }

        return task;
    }

    // eslint-disable-next-line class-methods-use-this
    private getTask(item: TTask): ITask {
        if (item && 'command' in item) {
            return item;
        }
        return { command: item };
    }
}
