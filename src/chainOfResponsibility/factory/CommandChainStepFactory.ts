import { IChainOfResponsibilityStepFactory } from './IChainOfResponsibilityStepFactory';
import ICommand from '../../command/ICommand';
import IChainOfResponsibilityStep from '../IChainOfResponsibilityStep';
import ChainOfResponsibilityCommandAdapter from '../ChainOfResponsibilityCommandAdapter';

export default class CommandChainStepFactory implements IChainOfResponsibilityStepFactory {
    constructor(readonly command: ICommand) {
    }

    create(): IChainOfResponsibilityStep {
        return new ChainOfResponsibilityCommandAdapter(this.command);
    }
}
