import { useCommand } from '../useCommand';

describe('useCommand', () => {
    it('should define command from function without props', async () => {
        const cmd = useCommand(
            async () => 'test',
        );
        const res = await cmd.execute();
        expect(res).toEqual('test');
    });

    it('should define command from function with props as param', async () => {
        const cmd = useCommand<{ foo: string }>(
            async function (this: { foo: string }, value: string) {
                return this.foo + value;
            },
            { foo: 'test' },
        );
        const res = await cmd.execute('!');
        expect(res).toEqual('test!');
    });

    it('should return command for object without canExecute', async () => {
        const cmd = useCommand({
            execute: async () => 'test',
        });
        const res = await cmd.execute();
        expect(res).toEqual('test');
    });

    it('should return command for object with canExecute', async () => {
        const cmd = useCommand({
            execute: async () => 'test',
            canExecute: () => false,
        });
        const res = cmd.canExecute && cmd.canExecute() ? await cmd.execute() : '!';
        expect(res).toEqual('!');
    });

    it('should return command for object with literal props in this', async () => {
        const obj = {
            foo: 'test',
            async execute() {
                return this.foo;
            },
        };
        const cmd = useCommand(obj);
        const res = await cmd.execute();
        expect(res).toEqual('test');
    });

    it('should return command for object without using this from command', async () => {
        const obj = {
            foo: 'test',
            async execute() {
                return this.foo;
            },
        };
        const cmd = useCommand<{ bar: string }>(obj);
        const res = await cmd.execute();
        expect(res).toEqual('test');
    });

    it('should return command for object which using command props in this', async () => {
        type Foo = { foo: string };
        type Bar = { bar: string };
        const obj = {
            foo: 'default',
            async execute(this: Foo & Bar) {
                return this.foo + this.bar;
            },
        };
        const props = { bar: '!' };
        const cmd = useCommand<Bar>(obj, props);
        const res = await cmd.execute();
        expect(res).toEqual('default!');
    });
});
