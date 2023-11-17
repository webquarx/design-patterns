import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import ICommand from '../command/ICommand';

export default class ChainOfResponsibilityCommandAdapter extends ChainOfResponsibilityStep {
    constructor(readonly command: ICommand) {
        super();
    }

    async execute(...args: any[]): Promise<any> {
        if (typeof this.command.canExecute !== 'function'
            || await this.command.canExecute(...args)
        ) {
            await this.command.execute(...args);
        }

        return await super.execute(...args);
    }
}
