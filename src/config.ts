export type StructConfig = {
  database?: {
    startConnection: (...args: any) => Promise<any>
  }
  auth?: {
    getSession?: () => Promise<any>
    getUser?: () => Promise<any>
  }
}

let config: StructConfig = {}

export const Struct = {
  configure: (cfg: StructConfig) => {
    config = cfg

    if (cfg.database?.startConnection)
      cfg.database.startConnection().catch(console.error)
  },
  get config() {
    return config
  }
}
