import { describe, expect, it } from 'vitest'
import { resolveLoginRedirect } from '~/utils/redirect'

describe('resolveLoginRedirect', () => {
  it('allows internal absolute app paths', () => {
    expect(resolveLoginRedirect('/tfp')).toBe('/tfp')
    expect(resolveLoginRedirect('/config?tab=dfp')).toBe('/config?tab=dfp')
    expect(resolveLoginRedirect('/')).toBe('/')
  })

  it('rejects external and protocol-relative URLs', () => {
    expect(resolveLoginRedirect('https://evil.example.com')).toBe('/')
    expect(resolveLoginRedirect('//evil.example.com')).toBe('/')
    expect(resolveLoginRedirect('http://evil.example.com/x')).toBe('/')
    expect(resolveLoginRedirect('javascript:alert(1)')).toBe('/')
  })

  it('falls back to / for relative paths, arrays and missing values', () => {
    expect(resolveLoginRedirect('tfp')).toBe('/')
    expect(resolveLoginRedirect(['/tfp', '/dfp'])).toBe('/')
    expect(resolveLoginRedirect(undefined)).toBe('/')
    expect(resolveLoginRedirect(null)).toBe('/')
    expect(resolveLoginRedirect(42)).toBe('/')
  })
})
