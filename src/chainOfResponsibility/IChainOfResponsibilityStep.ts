import IExecutable, { ICanExecutable, IExecuteFuncCallback } from '../core/IExecutable';

export default interface IChainOfResponsibilityStep extends IExecutable {
    setNext(nextStep?: IChainOfResponsibilityStep): IChainOfResponsibilityStep;
}

export interface IConditionalChainOfResponsibility extends ICanExecutable {
    chain: TChainOfResponsibility,
}

export type TChainOfResponsibilityStep =
    IChainOfResponsibilityStep | IExecuteFuncCallback | IConditionalChainOfResponsibility;

export type TChainOfResponsibility =
    TChainOfResponsibilityStep
    | TChainOfResponsibilityStep[];
