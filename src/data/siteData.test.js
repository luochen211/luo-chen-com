import { describe, expect, it } from 'vitest'
import { findColumn, getPublicColumns } from './siteData'

describe('public writing columns', () => {
  it('excludes columns without published articles', () => {
    expect(getPublicColumns().map((column) => column.slug)).toEqual([
      'where-do-we-go',
      'expression-review',
      'after-watching',
      'project-reviews',
    ])
  })

  it('still allows populated columns to be found by slug', () => {
    expect(findColumn('after-watching')?.series[0].articles).toHaveLength(1)
  })
})
