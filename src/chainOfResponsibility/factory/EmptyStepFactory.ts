import ChainOfResponsibilityExecuteFuncAdapter from '../ChainOfResponsibilityExecuteFuncAdapter';
import { IChainOfResponsibilityStepFactory } from './IChainOfResponsibilityStepFactory';
import IChainOfResponsibilityStep from '../IChainOfResponsibilityStep';

export default class EmptyStepFactory implements IChainOfResponsibilityStepFactory {
    // eslint-disable-next-line class-methods-use-this
    create(): IChainOfResponsibilityStep {
        return new ChainOfResponsibilityExecuteFuncAdapter(
            (execute, ...args) => execute(...args),
        );
    }
}
