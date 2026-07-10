/* @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'
import WritingPage from './WritingPage'
import { siteContent } from '../data/siteContent'

describe('redesigned page purposes', () => {
  it('limits the homepage to three proof items', () => {
    render(<MemoryRouter><HomePage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect(screen.getAllByTestId('proof-item')).toHaveLength(3)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('does not list unpublished columns on Writing', () => {
    render(<MemoryRouter><WritingPage t={siteContent.zh} locale="zh" /></MemoryRouter>)
    expect(screen.queryByText('Agent Harness 实践')).not.toBeInTheDocument()
    expect(screen.queryByText('项目复盘')).not.toBeInTheDocument()
  })
})
