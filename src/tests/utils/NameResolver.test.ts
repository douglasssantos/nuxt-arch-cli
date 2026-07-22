import { describe, it, expect } from 'vitest'
import { NameResolver } from '../../utils/NameResolver.js'

describe('NameResolver', () => {
  it('resolves User correctly', () => {
    const names = NameResolver.resolve('User')
    expect(names.pascal).toBe('User')
    expect(names.camel).toBe('user')
    expect(names.kebab).toBe('user')
    expect(names.snake).toBe('user')
  })

  it('resolves LoginRequest correctly', () => {
    const names = NameResolver.resolve('LoginRequest')
    expect(names.pascal).toBe('LoginRequest')
    expect(names.camel).toBe('loginRequest')
    expect(names.kebab).toBe('login-request')
    expect(names.snake).toBe('login_request')
  })

  it('resolves kebab-case input', () => {
    const names = NameResolver.resolve('user-profile')
    expect(names.pascal).toBe('UserProfile')
    expect(names.camel).toBe('userProfile')
    expect(names.kebab).toBe('user-profile')
  })

  it('resolves snake_case input', () => {
    const names = NameResolver.resolve('user_profile')
    expect(names.pascal).toBe('UserProfile')
    expect(names.camel).toBe('userProfile')
  })
})
