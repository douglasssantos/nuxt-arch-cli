import readline from 'node:readline'
import pc from 'picocolors'

export class Prompt {
  static async confirm(message: string): Promise<boolean> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    return new Promise((resolve) => {
      rl.question(`${pc.yellow('?')} ${message} ${pc.gray('(y/N)')} `, (answer) => {
        rl.close()
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
      })
    })
  }

  static async input(message: string, defaultValue?: string): Promise<string> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const hint = defaultValue ? pc.gray(` (${defaultValue})`) : ''

    return new Promise((resolve) => {
      rl.question(`${pc.cyan('?')} ${message}${hint}: `, (answer) => {
        rl.close()
        resolve(answer || defaultValue || '')
      })
    })
  }
}
