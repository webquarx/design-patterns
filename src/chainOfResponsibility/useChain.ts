import { IExecuteFuncCallback } from '../core/IExecutable';
import IChainOfResponsibilityStep, { TChainOfResponsibilityStep } from './IChainOfResponsibilityStep';
import ChainOfResponsibilityStepFactory from './ChainOfResponsibilityStepFactory';
import ChainOfResponsibility from './ChainOfResponsibility';

type TUseChainSteps = TChainOfResponsibilityStep[] | IExecuteFuncCallback;
export default function useChain(steps: TUseChainSteps): IChainOfResponsibilityStep {
    if (Array.isArray(steps)) {
        return new ChainOfResponsibility(steps);
    }
    return ChainOfResponsibilityStepFactory.createStep(steps);
}
