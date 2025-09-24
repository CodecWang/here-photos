import { thumbHash } from './thumb-hash.js';

describe('thumbHash', () => {
  it('should work', () => {
    expect(thumbHash()).toEqual('thumb-hash');
  });
});
