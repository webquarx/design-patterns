import { reactive, watchEffect } from 'vue';
import Invoker from '../Invoker';
import { useCommand } from '../../command/useCommand';
import useTask from '../useTask';

describe('Invoker.taskStatus.Vue', () => {
    it('should observe the reactive task when the command status changes or result set', async () => {
        const timeouts = [20, 50, 10];
        const invoker = new Invoker(timeouts, (item) => {
            const command = useCommand(
                async () => await new Promise((resolve) => {
                    setTimeout(resolve, item, item);
                }),
            );
            const task = useTask({ command });
            return reactive(task);
        });

        const log: string[] = [];
        // @ts-expect-error tasks is private
        const { tasks } = invoker;
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            watchEffect(() => {
                const values = [timeouts[i], task.status];
                if (task.result?.value) {
                    values.push(task.result?.value || '');
                }
                log.push(values.join(' - '));
            });
        }

        await invoker.limit({ concurrent: 2 }).parallel();

        expect(log).toEqual([
            '20 - idle',
            '50 - idle',
            '10 - idle',
            '20 - pending',
            '50 - pending',
            '20 - fulfilled',
            '20 - fulfilled - 20',
            '10 - pending',
            '10 - fulfilled',
            '10 - fulfilled - 10',
            '50 - fulfilled',
            '50 - fulfilled - 50',
        ]);
    });
});
