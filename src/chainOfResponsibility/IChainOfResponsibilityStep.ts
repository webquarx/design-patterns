import IExecutable, { ICanExecutable, IExecuteFuncCallback } from '../core/IExecutable';

export default interface IChainOfResponsibilityStep extends IExecutable {
    setNext(nextStep?: IChainOfResponsibilityStep): IChainOfResponsibilityStep;
}

export type TChainOfResponsibilityStep = IChainOfResponsibilityStep | IExecuteFuncCallback;

export interface IConditionalChainOfResponsibility extends ICanExecutable {
    chain: TChainOfResponsibility,
}

export type TChainOfResponsibilitySteps =
    TChainOfResponsibilityStep | IConditionalChainOfResponsibility;

export type TChainOfResponsibility =
    IConditionalChainOfResponsibility
    | TChainOfResponsibilityStep
    | (IConditionalChainOfResponsibility | TChainOfResponsibilityStep)[];
