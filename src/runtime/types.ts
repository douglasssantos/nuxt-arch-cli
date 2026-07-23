// Type augmentations for the Event Bus.
// Applied automatically when the nuxt-arch-cli module is installed.
export interface IEventBusBase {
  emit(event: string, payload: unknown): Promise<void>
  on(event: string, handler: (payload: unknown) => void | Promise<void>): void
  once(event: string, handler: (payload: unknown) => void | Promise<void>): void
  off(event: string, handler: (payload: unknown) => void | Promise<void>): void
  clear(event?: string): void
}

export {}
