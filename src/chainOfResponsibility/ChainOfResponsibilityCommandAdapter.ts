import ChainOfResponsibilityStep from './ChainOfResponsibilityStep';
import ICommand from '../command/ICommand';
import executeCommand from '../core/executeCommand';

export default class ChainOfResponsibilityCommandAdapter extends ChainOfResponsibilityStep {
    constructor(readonly command: ICommand) {
        super();
    }

    async execute(...args: any[]): Promise<any> {
        await executeCommand(this.command, ...args);

        return await super.execute(...args);
    }
}
