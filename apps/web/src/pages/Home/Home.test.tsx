import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Home } from './Home'

describe('Home', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows a connected message when the API responds with a valid health payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({ status: 'ok', timestamp: new Date().toISOString() }),
      }),
    )

    render(<Home />)

    expect(await screen.findByText('API connected')).toBeInTheDocument()
  })

  it('shows an unreachable message when the API call fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))

    render(<Home />)

    expect(await screen.findByText('API unreachable')).toBeInTheDocument()
  })

  it('shows an unreachable message when the response fails schema validation', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ status: 'not-ok' }),
      }),
    )

    render(<Home />)

    expect(await screen.findByText('API unreachable')).toBeInTheDocument()
  })
})
