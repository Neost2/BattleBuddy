import { createAuditEvent } from '../../services/audit'

test('creates audit event with correlation id', () => {
  const event = createAuditEvent({
    actorRole: 'veteran',
    action: 'UPDATE_SAFETY_PLAN'
  })

  expect(event.correlationId).toBeTruthy()
  expect(event.timestamp).toBeTruthy()
})
