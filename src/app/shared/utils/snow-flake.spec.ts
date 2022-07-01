import { SnowFlake } from './snow-flake';

describe('SnowFlake', () => {
  it('should create an instance', () => {
    expect(new SnowFlake()).toBeTruthy();
  });
});
