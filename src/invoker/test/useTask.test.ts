import useTask from '../useTask';
import Invoker from '../Invoker';
import { useCommand } from '../../command/useCommand';
import ICommand from '../../command/ICommand';

describe('useTask', () => {
    let cmd: ICommand;

    beforeEach(() => {
        cmd = useCommand(
            async () => await new Promise((resolve) => {
                setTimeout(resolve, 50);
            }),
        );
    });

    it('should return a task with the default status', async () => {
        const task = useTask(cmd);
        expect(task.status).toEqual('idle');

        const invoker = new Invoker(task);
        await invoker.parallel();
        expect(task.status).toEqual('fulfilled');
    });

    it('should return a task with non-empty keys', async () => {
        const task = useTask(cmd);
        expect(task.key).toContain('-');

        const invoker = new Invoker([task, cmd]);
        await invoker.parallel();

        const { tasks } = invoker;
        expect(tasks[0].key).toEqual(task.key);
        expect(tasks[1].key).toContain('-');
    });
});
