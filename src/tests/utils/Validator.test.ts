import { describe, it, expect } from 'vitest'
import { Validator } from '../../utils/Validator.js'

describe('Validator', () => {
  it('accepts valid names', () => {
    expect(Validator.isValidName('User')).toBe(true)
    expect(Validator.isValidName('LoginRequest')).toBe(true)
    expect(Validator.isValidName('A1')).toBe(true)
  })

  it('rejects names starting with a number', () => {
    expect(Validator.isValidName('1User')).toBe(false)
  })

  it('rejects names with spaces', () => {
    expect(Validator.isValidName('Login Request')).toBe(false)
  })

  it('accepts valid layer names', () => {
    expect(Validator.isValidLayerName('auth')).toBe(true)
    expect(Validator.isValidLayerName('my-layer')).toBe(true)
  })

  it('rejects uppercase layer names', () => {
    expect(Validator.isValidLayerName('Auth')).toBe(false)
  })

  it('throws on invalid name', () => {
    expect(() => Validator.assertValidName('1bad')).toThrow()
  })

  it('throws on empty value', () => {
    expect(() => Validator.assertNonEmpty('', 'Name')).toThrow()
  })
})
