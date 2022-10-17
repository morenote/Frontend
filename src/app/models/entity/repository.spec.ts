import { Repository } from './notes-repository';

describe('NotesRepository', () => {
  it('should create an instance', () => {
    expect(new Repository()).toBeTruthy();
  });
});
