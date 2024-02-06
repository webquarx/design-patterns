import RetriesExecutor from '../executor/RetriesExecutor';
import { useCommand } from '../../command/useCommand';
import FunctionExecutor from '../executor/FunctionExecutor';

describe('RetriesExecutor', () => {
    it('should run successfully with one simple command', async () => {
        const command = useCommand(async () => 'test');
        const task = { command };
        const executor = new RetriesExecutor(new FunctionExecutor(task), task);
        const res = await executor.execute();

        expect(res).toEqual({ value: 'test' });
    });

    it('should fail with error command', async () => {
        const command = useCommand(async () => {
            throw new Error('test error');
        });
        const task = { command };
        const executor = new RetriesExecutor(new FunctionExecutor(task), task);
        const res = await executor.execute();

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

        const task = { command, retries: 3 };
        const executor = new RetriesExecutor(new FunctionExecutor(task), task);
        const res = await executor.execute();

        expect(res).toEqual({ value: 'test' });
    });

    it('should fail even on third retry', async () => {
        let retry = 0;
        const command = useCommand(async () => {
            retry++;
            throw new Error(`retry: ${retry}`);
        });

        const task = { command, retries: 3 };
        const executor = new RetriesExecutor(new FunctionExecutor(task), task);
        const res = await executor.execute();

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

        const task = { command, retries };
        const executor = new RetriesExecutor(new FunctionExecutor(task), task);
        const res = await executor.execute();

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

        const task = { command, retries };
        const executor = new RetriesExecutor(new FunctionExecutor(task), task);
        const res = await executor.execute();

        expect(res).toEqual({ error: new Error('error') });
        expect(retry).toEqual(3);
    });
});
