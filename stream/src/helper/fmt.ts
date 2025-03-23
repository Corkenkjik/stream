export const formatLogTime = (time: Date) => {
  return `${String(time.getHours()).padStart(2, "0")}:${
    String(time.getMinutes()).padStart(2, "0")
  }:${String(time.getSeconds()).padStart(2, "0")}`
}
