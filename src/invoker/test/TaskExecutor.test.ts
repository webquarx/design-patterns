import TaskExecutor from '../TaskExecutor';
import { useCommand } from '../../command/useCommand';

describe('TaskExecutor', () => {
    it('should run successfully with one simple command', async () => {
        const command = useCommand(async () => 'test');
        const taskExecutor = new TaskExecutor({ command });
        const res = await taskExecutor.execute();

        expect(res).toEqual({ value: 'test' });
    });

    it('should fail with error command', async () => {
        const command = useCommand(async () => {
            throw new Error('test error');
        });
        const taskExecutor = new TaskExecutor({ command });
        const res = await taskExecutor.execute();

        expect(res).toEqual({ error: new Error('test error') });
    });

    it('should run successfully on third retry', async () => {
        let retry = 0;
        const command = useCommand(async () => {
            retry++;
            if (retry === 3) {
                return 'test';
            }
            throw new Error(`retry: ${retry}`);
        });

        const taskExecutor = new TaskExecutor({ command, retries: 3 });
        const res = await taskExecutor.execute();

        expect(res).toEqual({ value: 'test' });
    });

    it('should fail even on third retry', async () => {
        let retry = 0;
        const command = useCommand(async () => {
            retry++;
            throw new Error(`retry: ${retry}`);
        });

        const taskExecutor = new TaskExecutor({ command, retries: 3 });
        const res = await taskExecutor.execute();

        expect(res).toEqual({ error: new Error('retry: 3') });
        expect(retry).toEqual(3);
    });
});
