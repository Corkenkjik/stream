import { logger } from "@logger"

export async function updateJsonFile(
  filename: string,
  newData: Record<string, unknown>,
): Promise<void> {
  try {
    let jsonData: Record<string, unknown> = {}

    // Check if file exists
    try {
      const fileContent = await Deno.readTextFile(filename)
      jsonData = JSON.parse(fileContent)
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        logger.log("File not found, creating a new one.", "INFO")
      } else {
        throw error
      }
    }

    // Merge existing data with new data
    jsonData = { ...jsonData, ...newData }

    // Write updated JSON back to file
    await Deno.writeTextFile(filename, JSON.stringify(jsonData, null, 2))

    logger.log(`JSON updated successfully in ${filename}`, "SUCCESS")
  } catch (error) {
    logger.log("Error updating JSON: " + error, "ERROR")
  }
}

async function fileExistsAsync(path: string): Promise<boolean> {
  try {
    const fileInfo = await Deno.stat(path)
    return fileInfo.isFile
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false
    }
    throw error // Re-throw other unexpected errors
  }
}

export async function checkResetStatus(
  key: "player" | "team",
) {
  const filename = Deno.cwd() + "/is_reset.json"
  try {
    // Check if file exists
    const fileExists = await fileExistsAsync(filename)
    if (!fileExists) {
      return false
    }

    // Read file contents
    const fileContent = await Deno.readTextFile(filename)
    const jsonData = JSON.parse(fileContent) as Record<string, boolean>

    if (key === "player") {
      return jsonData.player ?? false
    } else if (key === "team") {
      return jsonData.team ?? false
    }
    return false
  } catch (error) {
    console.error("Error reading file:", error)
    return false
  }
}
