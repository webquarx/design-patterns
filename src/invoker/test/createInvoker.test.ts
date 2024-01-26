import Invoker from '../Invoker';
import ICommand from '../../command/ICommand';

class MockCommand implements ICommand {
    constructor(readonly val: number = 0) {
    }

    async execute() {
        return this.val;
    }
}

describe('create Invoker', () => {
    it('should initialize with a single command', () => {
        const command = new MockCommand();
        const invoker = new Invoker(command);

        // @ts-expect-error tasks is private
        expect(invoker.tasks).toEqual([
            {
                command,
                status: 'idle',
                result: { error: undefined, value: undefined },
            },
        ]);
    });

    it('should initialize with an array of commands', () => {
        const commands = [new MockCommand(), new MockCommand()];
        const invoker = new Invoker(commands);

        // @ts-expect-error tasks is private
        invoker.tasks.forEach((task, index) => {
            expect(task.command).toEqual(commands[index]);
        });
    });

    it('should initialize with an array of items and an iteratee', () => {
        const items = [1, 2, 3];
        const invoker = new Invoker(items, (item) => new MockCommand(item));

        // @ts-expect-error tasks is private
        const { tasks } = invoker;
        expect(tasks).toHaveLength(items.length);
        expect(tasks[0].command).toBeInstanceOf(MockCommand);
        const { val } = tasks[0].command as MockCommand;
        expect(val).toEqual(items[0]);
    });

    it('should initialize with an array from one item', () => {
        const invoker = new Invoker(5 as any, (item) => new MockCommand(item));

        // @ts-expect-error tasks is private
        expect(invoker.tasks[0].command.val).toEqual(5);
    });

    it('should initialize invoker with InvokerTask', () => {
        const invoker = new Invoker(
            5 as any,
            (item) => ({ command: new MockCommand(item) }),
        );

        // @ts-expect-error tasks is private
        expect(invoker.tasks[0].command.val).toEqual(5);
    });
});
