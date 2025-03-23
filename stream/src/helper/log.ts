import { formatLogTime } from "./fmt.ts"

export const createEmptyLogFile = async () => {
  const path = `${Deno.cwd()}/log.csv`
  await Deno.writeTextFile(path, "")
}

export interface Log {
  time: Date
  origin: string
  type: "input" | "output"
  url: string
  status: "success" | "fail"
  message: string
}

export const writeToLog = async (log: Log) => {
  const logFilePath = Deno.cwd() + "/log.csv"
  const logEntry = `${
    formatLogTime(log.time)
  },${log.type},${log.origin},${log.url},${log.status},${log.message}\n`
  await Deno.writeTextFile(logFilePath, logEntry, { append: true })
}

export const wrapErrorMessage = (message: string) => {
  return `"${String(message || "Unknown error").replace(/"/g, '""')}"`
}

// TODO: Implement readLog function
/* export const readLog = async () => {
  const logFilePath = Deno.cwd() + "/log.csv"
  const fileContent = await Deno.readTextFile(logFilePath)
  const lines = fileContent.split("\n")
  const result: Log[] = []

  for (const line of lines) {
    const columns = line.split(",")
    if (columns.length === 5) {
      const row = {
        time: columns[0],
        type: columns[1],
        url: columns[1],
        status: columns[2],
        message: columns[3],
      }
      result.push(row)
    }
  }
  return result
} */

export const displayLog = (data: Log[]) => {
  let str = ""
  data.forEach((row) => {
    str = str +
      `${row.time}, ${row.type},${row.url}, ${row.status}, ${row.message}\n`
  })
  return str
}
