import Parallel from '../Parallel';
import ICommand from '../../command/ICommand';
import { ITask } from '../TInvoker';

class MockCommand implements ICommand {
    constructor(
        readonly val: number = 0,
        readonly logs: string[] = [],
    ) {}

    async execute() {
        this.logs.push(`start-end: ${this.val}`);
        return this.val;
    }
}

class SlowMockCommand {
    constructor(
        readonly val: number = 0,
        readonly logs: string[] = [],
        readonly timeout: number = 50,
    ) {}

    execute(): Promise<number> {
        return new Promise((resolve) => {
            this.logs.push(`start: ${this.val}`);
            setTimeout(() => {
                this.logs.push(`end: ${this.val}`);
                resolve(this.val);
            }, this.timeout);
        });
    }
}

class SlowRejectMockCommand {
    constructor(
        readonly val: number = 0,
        readonly logs: string[] = [],
        readonly timeout: number = 50,
    ) {}

    execute(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.logs.push(`start: ${this.val}`);
            setTimeout(() => {
                reject(new Error(`reject: ${this.val}`));
            }, this.timeout);
        });
    }
}

describe('Parallel', () => {
    it('should execute tasks in parallel without limiting', async () => {
        const tasks = [
            { command: new MockCommand(1) },
            { command: new MockCommand(2) },
            { command: new MockCommand(3) },
        ];
        const parallels = new Parallel(tasks);

        const results = await parallels.execute();

        expect(results).toEqual([1, 2, 3]);
    });

    it('should execute tasks with arguments', async () => {
        const tasks = [
            { command: { execute: async (val1: number, val2: number) => val1 + val2 } },
            { command: { execute: async (val1: number, val2: number) => val1 + val2 + 1 } },
            { command: { execute: async (val1: number, val2: number) => val1 + val2 + 2 } },
        ];
        const parallels = new Parallel(tasks);

        const results = await parallels.execute(1, 2);

        expect(results).toEqual([3, 4, 5]);
    });

    it('should handle an empty task list', async () => {
        const parallels = new Parallel([]);

        const results = await parallels.execute();

        expect(results).toEqual([]);
    });

    it('should handle tasks with different execution times with limit', async () => {
        const logs: string[] = [];
        const tasks = [
            { command: new MockCommand(1, logs) },
            { command: new SlowMockCommand(2, logs, 100) },
            { command: new SlowMockCommand(3, logs, 50) },
            { command: new MockCommand(4, logs) },
        ];

        const parallels = new Parallel(tasks, { concurrent: 2 });

        const results = await parallels.execute();

        expect(results).toEqual([1, 2, 3, 4]);
        expect(logs).toEqual([
            'start-end: 1',
            'start: 2',
            'start: 3',
            'end: 3',
            'start-end: 4',
            'end: 2',
        ]);
    });

    it('should handle tasks with different execution times with no limit', async () => {
        const logs: string[] = [];
        const tasks = [
            { command: new MockCommand(1, logs) },
            { command: new SlowMockCommand(2, logs, 100) },
            { command: new SlowMockCommand(3, logs, 50) },
            { command: new MockCommand(4, logs) },
        ];

        const parallels = new Parallel(tasks);
        const results = await parallels.execute();

        expect(results).toEqual([1, 2, 3, 4]);
        expect(logs).toEqual([
            'start-end: 1',
            'start: 2',
            'start: 3',
            'start-end: 4',
            'end: 3',
            'end: 2',
        ]);
    });

    it('should throw error if there is command error', async () => {
        const logs: string[] = [];
        const tasks = [
            { command: new SlowRejectMockCommand(1, logs, 10) },
        ];

        const parallels = new Parallel(tasks, { concurrent: 2 });
        await expect(parallels.execute()).rejects.toThrow('reject: 1');
    });

    it('should stop executing commands if there is an exception', async () => {
        const logs: string[] = [];
        const tasks = [
            { command: new SlowMockCommand(1, logs, 10) },
            { command: new SlowRejectMockCommand(2, logs, 10) },
            { command: new SlowRejectMockCommand(3, logs, 10) },
            { command: new SlowMockCommand(4, logs, 10) },
        ];

        const parallels = new Parallel(tasks, { concurrent: 2 });
        await expect(parallels.execute()).rejects.toThrow('reject: 2');

        await new Promise((resolve) => {
            setTimeout(resolve, 50);
        });

        const results = tasks.map((task: ITask) => task.result);
        expect(results).toEqual([
            { value: 1 },
            { error: new Error('reject: 2') },
            { error: new Error('Operation canceled') },
            { error: new Error('Operation canceled') },
        ]);
    });
});
