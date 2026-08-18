Security changes to apply to the existing sync service:

1. Generate correlationId at sync start.
2. Verify consent before writing data.
3. Write audit event:
   - VA_SYNC_REQUEST
   - actorRole=veteran
   - resourceType=WellnessData
4. Denied consent should create an audit event and stop processing.

The existing syncConsentedWellnessData service remains the integration point.
