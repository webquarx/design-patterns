import InvokerCommandTaskFactory from './factory/InvokerCommandTaskFactory';
import { InvokerTask, TInvokerTask } from './TInvoker';

export default function useTask(item: TInvokerTask): InvokerTask {
    return new InvokerCommandTaskFactory().create(item);
}
