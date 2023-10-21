// eslint-disable-next-line max-classes-per-file
import Command from '../Command';

describe('Command', () => {
    it('should define command without props in constructor', async () => {
        const value = 'test';

        class TestCommand extends Command {
            // eslint-disable-next-line class-methods-use-this
            async execute() {
                return value;
            }
        }

        const cmd = new TestCommand();
        const res = await cmd.execute();
        expect(res).toEqual(value);
    });

    it('should define command with props in constructor', async () => {
        class TestCommand extends Command<{
            foo: string,
            bar: number,
            baz: object,
        }> {
            async execute() {
                // eslint-disable-next-line prefer-destructuring
                const foo: string = this.foo;
                // eslint-disable-next-line prefer-destructuring
                const bar: number = this.bar;
                // eslint-disable-next-line prefer-destructuring
                const baz: object = this.baz;

                return { foo, bar, baz };
            }
        }
        const value = { foo: 'test', bar: 123, baz: {} };
        const cmd = new TestCommand(value);
        const res = await cmd.execute();
        expect(res).toEqual(value);
    });

    it('should use default values from class members', async () => {
        type Props = { foo?: string, bar: number };
        class TestCommand<T extends Props> extends Command<T> {
            public foo: string = 'default value';

            async execute() {
                return {
                    foo: this.foo,
                    bar: this.bar,
                };
            }
        }
        const props = { bar: 123, baz: {} };
        const cmd = new TestCommand(props);
        const res = await cmd.execute();
        expect(res).toEqual({ foo: 'default value', bar: 123 });
    });

    it('should override Command constructor correctly', async () => {
        type Props = { foo: string, bar: number };
        class TestCommand extends Command<Props> {
            constructor(props: Props) {
                super(props);
                this.foo += '!';
            }

            async execute() {
                return this.foo;
            }
        }
        const props = { foo: 'test', bar: 123 };
        const cmd = new TestCommand(props);
        const res = await cmd.execute();
        expect(res).toEqual('test!');
    });

    it('should return true for default canExecute method', () => {
        class TestCommand extends Command {
            // eslint-disable-next-line class-methods-use-this
            async execute() {
                return '';
            }
        }
        const cmd = new TestCommand();
        expect(cmd.canExecute()).toEqual(true);
    });
});
