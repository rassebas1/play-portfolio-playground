import { describe, it, expect, vi } from 'vitest'

const mockClient = { from: vi.fn(), auth: { signUp: vi.fn(), signIn: vi.fn() } }

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockClient),
}))

describe('supabase client', () => {
  it('creates a client and exports it', async () => {
    const { supabase } = await import('./supabase')

    expect(supabase).toBeDefined()
    expect(supabase).toBe(mockClient)
  })
})
