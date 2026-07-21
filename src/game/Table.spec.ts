import { Table } from './Table';

describe('Table', () => {
  let table: Table;

  beforeEach(async () => {
    // table = new Table()
  });

  it('should return "Hello World!"', () => {
    const table = new Table('1', 'High Rollers', 100_000, 5);
    // expect(appController.getHello()).toBe('Hello World!');
  });
});
