import {
  defineNuxtModule,
  addPlugin,
  addImportsDir,
  createResolver,
  addTypeTemplate,
  useLogger,
} from '@nuxt/kit'

export interface ModuleOptions {
  /** Enable the Event Bus plugin. @default true */
  eventBus?: boolean
  /** Show CLI commands hint on Nuxt dev startup. @default true */
  showHint?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-arch-cli',
    configKey: 'nuxtArchCli',
    compatibility: { nuxt: '>=3.0.0' },
  },

  defaults: {
    eventBus: true,
    showHint: true,
  },

  setup(options: ModuleOptions, nuxt: import('@nuxt/schema').Nuxt) {
    const resolver = createResolver(import.meta.url)
    const logger = useLogger('nuxt-arch-cli')

    if (options.eventBus) {
      addPlugin({ src: resolver.resolve('./runtime/plugins/event-bus'), mode: 'all' })
      addImportsDir(resolver.resolve('./runtime/composables'))
      addTypeTemplate({
        filename: 'types/nuxt-arch-cli.d.ts',
        getContents: () =>
          [
            `import type { IEventBus } from 'nuxt-arch-cli/runtime/contracts/IEventBus'`,
            `declare module '#app' { interface NuxtApp { $eventBus: IEventBus } }`,
            `declare module '@vue/runtime-core' { interface ComponentCustomProperties { $eventBus: IEventBus } }`,
            `export {}`,
          ].join('\n'),
      })
    }

    // Show CLI hint in dev mode
    if (options.showHint && nuxt.options.dev) {
      nuxt.hook('listen', () => {
        logger.info('nuxt-arch-cli ready. Available commands:\n')
        const c = (s: string) => `\x1b[36m${s}\x1b[0m`
        const lines = [
          [c('arch init'),                               'Create nuxt-architect.config.ts'],
          [c('arch make:layer <name>'),                  'Create layer or module'],
          [c('arch make:event <name> --layer <target>'), 'Create a domain event'],
          [c('arch make:listener <name> --layer <t>'),   'Create a listener'],
          [c('arch events:install'),                     'Setup Event Bus infrastructure'],
          [c('arch events:list'),                        'List all events and listeners'],
          [c('arch events:sync'),                        'Rebuild EventMap + Registry'],
          [c('arch --help'),                             'Full command reference'],
        ]
        for (const [cmd, desc] of lines) {
          console.log(`  ${cmd.padEnd(60)}${desc}`)
        }
        console.log('')
      })
    }
  },
})
