import IChainOfResponsibilityStep, {
    TChainOfResponsibility,
    TChainOfResponsibilityStep,
} from '../IChainOfResponsibilityStep';
import { IChainOfResponsibilityStepFactory } from './IChainOfResponsibilityStepFactory';
import ExecuteFuncStepFactory from './ExecuteFuncStepFactory';
import ConditionalChainStepFactory from './ConditionalChainStepFactory';
import ExistingChainStepFactory from './ExistingChainStepFactory';

export default class ChainStepFactory {
    constructor(
        readonly createChain?
        : (steps: TChainOfResponsibility) => IChainOfResponsibilityStep | undefined,
    ) {}

    create(step: TChainOfResponsibilityStep): IChainOfResponsibilityStep | undefined {
        const factory = this.createStepFactory(step);
        return factory?.create();
    }

    private createStepFactory(step: TChainOfResponsibilityStep)
        : IChainOfResponsibilityStepFactory | undefined {
        if (typeof step === 'function') {
            return new ExecuteFuncStepFactory(step);
        }
        if (step && 'chain' in step && this.createChain) {
            return new ConditionalChainStepFactory(
                step,
                this.createChain,
            );
        }
        if (step && 'setNext' in step && 'execute' in step) {
            return new ExistingChainStepFactory(step);
        }
        return undefined;
    }
}
