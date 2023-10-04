import IChainOfResponsibilityStep, {
    IConditionalChainOfResponsibility,
    TChainOfResponsibility,
} from '../IChainOfResponsibilityStep';
import ChainOfResponsibilityConditionalStep from '../ChainOfResponsibilityConditionalStep';
import { IChainOfResponsibilityStepFactory } from './IChainOfResponsibilityStepFactory';
import EmptyStepFactory from './EmptyStepFactory';

export default class ConditionalChainStepFactory implements IChainOfResponsibilityStepFactory {
    private lastStep = new EmptyStepFactory().create();

    constructor(
        readonly step: IConditionalChainOfResponsibility,
        readonly createChain
        : (steps: TChainOfResponsibility) => IChainOfResponsibilityStep | undefined,
    ) {}

    create(): IChainOfResponsibilityStep {
        const { lastStep } = this;
        const { chain, canExecute } = this.step;

        const newChain = this.createChainArray(chain);
        newChain.push(lastStep);
        const conditionalChain = this.createChain(newChain);
        const conditionalStep = new ChainOfResponsibilityConditionalStep(
            canExecute,
            lastStep,
        );
        conditionalStep.setNext(conditionalChain as IChainOfResponsibilityStep);
        return conditionalStep;
    }

    // eslint-disable-next-line class-methods-use-this
    createChainArray(chain: TChainOfResponsibility) {
        return Array.isArray(chain) ? [...chain] : [chain];
    }
}
