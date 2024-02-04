import InvokerCommandTaskFactory from './factory/InvokerCommandTaskFactory';
import { ITask, TTask } from './TInvoker';

export default function useTask(item: TTask): ITask {
    return new InvokerCommandTaskFactory().create(item);
}
