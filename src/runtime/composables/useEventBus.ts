import { useNuxtApp } from '#app'
import type { IEventBus } from '../contracts/IEventBus.js'

export function useEventBus(): IEventBus {
  const { $eventBus } = useNuxtApp()
  return $eventBus as IEventBus
}
