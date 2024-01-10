export default class PromiseResolvers<T> {
    resolve!: (value: (T | PromiseLike<T>)) => void;

    reject!: (reason?: any) => void;

    create(execute: () => any): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            execute();
        });
    }
}
