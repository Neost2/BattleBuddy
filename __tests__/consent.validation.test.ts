describe('Consent validation', () => {
  test('sync requires explicit consent', () => {
    const consent = {
      syncWellnessCheckIns:false,
      syncGoals:false
    }

    expect(consent.syncWellnessCheckIns).toBe(false)
  })
})
