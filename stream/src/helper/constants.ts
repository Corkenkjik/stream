import { env } from "./env.ts"

export const API_SERVER = "http://localhost:8000"

export const MLBB_SERVER = env.environment === "dev"
  ? "http://localhost:8000/"
  : "https://esportsdata-sg.mobilelegends.com/"

export const VMIX_SERVER = env.environment === "dev"
  ? "http://localhost:8000/xml"
  : "http://192.168.1.50:8088/api"
