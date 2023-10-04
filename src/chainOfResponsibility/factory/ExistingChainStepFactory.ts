import { IChainOfResponsibilityStepFactory } from './IChainOfResponsibilityStepFactory';
import IChainOfResponsibilityStep from '../IChainOfResponsibilityStep';

export default class ExistingChainStepFactory implements IChainOfResponsibilityStepFactory {
    constructor(readonly step: IChainOfResponsibilityStep) {
    }

    create(): IChainOfResponsibilityStep {
        return this.step;
    }
}
