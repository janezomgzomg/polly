import { describe, expect, it } from 'vitest'
import { healthResponseSchema } from './health.js'

describe('healthResponseSchema', () => {
  it('accepts a valid health response', () => {
    const result = healthResponseSchema.safeParse({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
    expect(result.success).toBe(true)
  })

  it('rejects a status other than "ok"', () => {
    const result = healthResponseSchema.safeParse({
      status: 'down',
      timestamp: new Date().toISOString(),
    })
    expect(result.success).toBe(false)
  })
})
