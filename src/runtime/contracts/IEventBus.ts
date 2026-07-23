/**
 * EventHandler — callback genérico para qualquer evento.
 */
export type EventHandler<TPayload = unknown> = (
  payload: TPayload,
) => void | Promise<void>

/**
 * IEventBus — contrato público do barramento de eventos.
 */
export interface IEventBus {
  emit<K extends string>(event: K, payload: unknown): Promise<void>
  on<K extends string>(event: K, handler: EventHandler): void
  once<K extends string>(event: K, handler: EventHandler): void
  off<K extends string>(event: K, handler: EventHandler): void
  clear(event?: string): void
}
