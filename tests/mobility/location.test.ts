import { createSavedLocation } from '../../services/mobility/locationService';

test('creates saved location', () => {
  const location = createSavedLocation(
    'Home',
    'HOME',
    'encrypted-value'
  );

  expect(location.type).toBe('HOME');
});
