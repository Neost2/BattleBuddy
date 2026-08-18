export type ActorRole = 'veteran' | 'caregiver' | 'admin' | 'system'

export type AuditEvent = {
  userId?: string
  actorRole: ActorRole
  action: string
  resourceType?: string
  resourceId?: string
  correlationId: string
  metadata?: Record<string, unknown>
  timestamp: string
}

export function createCorrelationId(prefix = 'BB') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`
}

export function createAuditEvent(
  event: Omit<AuditEvent, 'correlationId' | 'timestamp'> & {
    correlationId?: string
  }
): AuditEvent {
  return {
    ...event,
    correlationId: event.correlationId ?? createCorrelationId(),
    timestamp: new Date().toISOString(),
  }
}
