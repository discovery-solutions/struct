import { NextRequest } from "next/server"

export type StructConfig = {
  database?: {
    startConnection: (...args: any) => Promise<any>;
    closeConnection: () => Promise<any>;
  }
  auth?: {
    getSession?: (req?: NextRequest, context?: { params: Promise<any> }) => Promise<any>
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
