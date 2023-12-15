import ICommand from '../command/ICommand';

export default async function executeCommand(command: ICommand, ...args: any[]) {
    if (typeof command.canExecute !== 'function'
        || await command.canExecute(...args)
    ) {
        return await command.execute(...args);
    }
    return await Promise.resolve();
}
