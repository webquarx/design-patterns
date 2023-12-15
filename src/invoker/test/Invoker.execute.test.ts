import Invoker from '../Invoker';

describe('Invoker.execute', () => {
    it('should execute empty invoker', async () => {
        const invoker = new Invoker([]);
        const res = await invoker.parallel(1);

        expect(res).toEqual([]);
    });
});
