import IChainOfResponsibilityStep from '../IChainOfResponsibilityStep';
import ChainOfResponsibilityExecuteFuncAdapter from '../ChainOfResponsibilityExecuteFuncAdapter';
import { IExecuteFuncCallback } from '../../core/IExecutable';
import { IChainOfResponsibilityStepFactory } from './IChainOfResponsibilityStepFactory';

export default class ExecuteFuncStepFactory implements IChainOfResponsibilityStepFactory {
    constructor(readonly executeFunc: IExecuteFuncCallback) {
    }

    create(): IChainOfResponsibilityStep {
        return new ChainOfResponsibilityExecuteFuncAdapter(this.executeFunc);
    }
}
