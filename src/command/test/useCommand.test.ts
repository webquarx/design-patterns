import { useCommand } from '../useCommand';

describe('useCommand', () => {
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

    it('should return command for object with props in this', async () => {
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
});
