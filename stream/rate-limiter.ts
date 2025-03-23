import { logger } from "@logger"

class RateLimiter {
  private maxConcurrentRequests: number
  private maxRetries: number
  private baseDelay: number

  constructor(maxConcurrentRequests = 5, maxRetries = 3, baseDelay = 2000) {
    this.maxConcurrentRequests = maxConcurrentRequests
    this.maxRetries = maxRetries
    this.baseDelay = baseDelay // Base delay in milliseconds
  }

  private async fetchWithRetry(url: string, retries = 0): Promise<void> {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }
    } catch (error) {
      if (retries < this.maxRetries) {
        const delay = this.baseDelay * Math.pow(2, retries)
        logger.log(
          `Retrying ${url} in ${delay}ms... (Attempt ${retries + 1})`,
          "WARN",
        )
        await this.sleep(delay)
        return this.fetchWithRetry(url, retries + 1)
      } else {
        logger.log(`Failed after ${this.maxRetries} attempts: ${url}`, "ERROR")
        throw error
      }
    }
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public async execute(urls: string[]) {
    const batches = this.chunkArray(urls, this.maxConcurrentRequests)

    for (const batch of batches) {
      const promises = batch.map((url) => this.fetchWithRetry(url))
      await Promise.all(promises)
    }
  }

  private chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size))
    }
    return result
  }
}

const rateLimiter = new RateLimiter()

export { rateLimiter }
