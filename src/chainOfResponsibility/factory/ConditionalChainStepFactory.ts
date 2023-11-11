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
        const { chain, elseChain } = this.step;

        const newChain = this.createChainArray(chain);
        newChain.push(lastStep);
        const conditionalChain = this.createChain(newChain);
        const conditionalStep = new ChainOfResponsibilityConditionalStep(
            this.step.canExecute,
            lastStep,
        );
        if (elseChain) {
            lastStep.setNext(this.createChain({
                chain: elseChain,
                canExecute: () => !conditionalStep.canExecuteState,
            }));
        }
        conditionalStep.setNext(conditionalChain as IChainOfResponsibilityStep);
        return conditionalStep;
    }

    // eslint-disable-next-line class-methods-use-this
    createChainArray(chain: TChainOfResponsibility) {
        return Array.isArray(chain) ? [...chain] : [chain];
    }
}
