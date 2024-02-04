import validate = require('uuid-validate');
import createUUID from '../tools/createUUID';

describe('createUUID', () => {
    it('should generate a valid UUID', () => {
        for (let i = 0; i < 1000; i++) {
            const uuid = createUUID();
            expect(validate(uuid)).toEqual(true);
        }
    });

    it('all ids have to be unique in 100K iterations', () => {
        const ids = [];
        for (let i = 0; i < 100000; i++) {
            ids.push(createUUID());
        }
        const uniqueIds = [...new Set(ids)];
        expect(ids.length).toEqual(uniqueIds.length);
    });
});
