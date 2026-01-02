import { BaseEntity } from './base.entity';

class TestEntity extends BaseEntity {}

describe('BaseEntity', () => {
  it('should be constructible through subclasses', () => {
    const entity = new TestEntity();
    expect(entity).toBeInstanceOf(TestEntity);
    expect(entity).toBeInstanceOf(BaseEntity);
  });

  it('should define base properties', () => {
    const entity = new TestEntity();
    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('createdAt');
    expect(entity).toHaveProperty('updatedAt');
  });

  it('should have undefined audit fields before persistence', () => {
    const entity = new TestEntity();
    expect(entity.id).toBeUndefined();
    expect(entity.createdAt).toBeUndefined();
    expect(entity.updatedAt).toBeUndefined();
  });

  it('should allow assigning values', () => {
    const entity = new TestEntity();
    entity.id = 10;
    entity.createdAt = new Date('2024-01-01T00:00:00Z');
    entity.updatedAt = new Date('2024-01-01T10:00:00Z');
    expect(entity.id).toBe(10);
    expect(entity.createdAt).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(entity.updatedAt).toEqual(new Date('2024-01-01T10:00:00Z'));
  });
});
