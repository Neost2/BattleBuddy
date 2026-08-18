import { createTripRequest, requestAssistance } from '../../services/mobility/tripService';

test('creates assistance trip request', () => {
  const trip = createTripRequest({
    userId: 'user1',
    destination: 'VA Clinic',
    tripDate: new Date().toISOString(),
    assistanceRequested: true,
  });

  expect(trip.status).toBe('requested');
});

test('can request assistance later', () => {
  const trip = createTripRequest({
    userId: 'user1',
    destination: 'Home',
    tripDate: new Date().toISOString(),
    assistanceRequested: false,
  });

  expect(requestAssistance(trip).assistanceRequested).toBe(true);
});
