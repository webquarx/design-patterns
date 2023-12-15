import Parallel from '../Parallel';
import ICommand from '../../command/ICommand';

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

    it('should execute tasks with a limit', async () => {
        const tasks = [
            { command: new MockCommand(1) },
            { command: new MockCommand(2) },
            { command: new MockCommand(3) },
        ];
        const parallels = new Parallel(tasks);

        const results = await parallels.execute(2);

        expect(results).toEqual([1, 2, 3]);
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

        const parallels = new Parallel(tasks);

        const results = await parallels.execute(2);

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
});
