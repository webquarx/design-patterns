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

    it('should run successfully after several retries with a function', async () => {
        let success = false;
        const command = useCommand(async () => {
            if (success) {
                return 'test';
            }
            throw new Error('error');
        });
        const retries = async (cmd: any, index: number) => {
            success = index === 3;
            return true;
        };

        const taskExecutor = new TaskExecutor({ command, retries });
        const res = await taskExecutor.execute();

        expect(res).toEqual({ value: 'test' });
    });

    it('should fail after several retries with a function', async () => {
        let retry = 0;
        const command = useCommand(async () => {
            throw new Error('error');
        });
        const retries = async (cmd: any, index: number) => {
            retry++;
            return index !== 3;
        };

        const taskExecutor = new TaskExecutor({ command, retries });
        const res = await taskExecutor.execute();

        expect(res).toEqual({ error: new Error('error') });
        expect(retry).toEqual(3);
    });
});
