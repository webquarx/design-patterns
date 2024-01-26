import useTask from '../useTask';
import Invoker from '../Invoker';
import { useCommand } from '../../command/useCommand';

describe('useTask', () => {
    it('should return a task with the default status', async () => {
        const cmd = useCommand(
            async () => await new Promise((resolve) => {
                setTimeout(resolve, 50);
            }),
        );
        const task = useTask(cmd);
        expect(task.status).toEqual('idle');

        const invoker = new Invoker(task);
        await invoker.parallel();
        expect(task.status).toEqual('fulfilled');
    });
});
