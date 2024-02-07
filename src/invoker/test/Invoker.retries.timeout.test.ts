import { useCommand } from '../../command/useCommand';
import Invoker from '../Invoker';

describe('Invoker.retries.timeout', () => {
    it('the task should be resolved after encountering several errors due to a timeout', async () => {
        let retry = 0;

        const tasks = [
            {
                command: useCommand(async () => await new Promise((resolve) => {
                    retry++;
                    const timeout = retry === 3 ? 10 : 30;
                    setTimeout(resolve, timeout, 'task resolved');
                })),
                retries: 3,
                timeout: 20,
            },
        ];

        const invoker = new Invoker(tasks);
        const results = await invoker.parallel();

        expect(results).toEqual(['task resolved']);
    });
});
