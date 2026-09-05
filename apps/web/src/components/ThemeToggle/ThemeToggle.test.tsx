import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
    localStorage.clear()
  })

  it('starts in light mode and switches to dark mode on click', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    expect(document.documentElement.classList.contains('dark')).toBe(false)

    await user.click(screen.getByRole('button', { name: /switch to dark mode/i }))

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('reflects dark mode already applied to the document on mount', () => {
    document.documentElement.classList.add('dark')
    render(<ThemeToggle />)

    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
  })
})
