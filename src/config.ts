import { NextRequest } from "next/server"

export type StructLogger = {
  info?: (...args: any[]) => void;
  error?: (...args: any[]) => void;
  warn?: (...args: any[]) => void;
}

export type StructConfig = {
  database?: {
    startConnection: (dbName?: string) => Promise<any>;
    closeConnection?: (dbName?: string) => Promise<any>;
  }
  auth?: {
    getSession?: (req?: NextRequest, context?: { params: Promise<any> }) => Promise<any>
    getUser?: () => Promise<any>
  }
  logger?: StructLogger;
}

let config: StructConfig = {}

export const Struct = {
  configure: (cfg: StructConfig) => {
    config = cfg

    if (cfg.database?.startConnection)
      Promise.resolve(cfg.database.startConnection()).catch(console.error)
  },
  get config() {
    return config
  }
}

export const getLogger = (): Required<StructLogger> => ({
  info: config.logger?.info ?? console.log,
  error: config.logger?.error ?? console.error,
  warn: config.logger?.warn ?? console.warn,
})
