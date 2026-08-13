/* @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { siteContent } from '../data/siteContent'
import AboutPage from './AboutPage'

afterEach(cleanup)

describe('About contact title', () => {
  it('keeps the Chinese title together at semantic phrase boundaries', () => {
    const { container } = render(<AboutPage t={siteContent.zh} locale="zh" />)
    const titleSegments = [...container.querySelectorAll('#contact-title > span')]

    expect(titleSegments.map((segment) => segment.textContent)).toEqual(['一起解决', '值得解决', '的问题'])
    titleSegments.forEach((segment) => {
      expect(segment).toHaveClass('contact-title-segment')
      expect(segment).toHaveStyle({ display: 'inline-block' })
    })
  })

  it('leaves the English contact title unchanged', () => {
    const { container } = render(<AboutPage t={siteContent.en} locale="en" />)

    expect(container.querySelector('#contact-title')).toHaveTextContent(siteContent.en.contact.title)
    expect(container.querySelectorAll('#contact-title > span')).toHaveLength(1)
  })

  it.each([
    ['zh', siteContent.zh],
    ['en', siteContent.en],
  ])('does not repeat the site domain in the %s contact directory', (locale, content) => {
    render(<AboutPage t={content} locale={locale} />)

    expect(screen.queryByText('luo-chen.com')).not.toBeInTheDocument()
  })
})
