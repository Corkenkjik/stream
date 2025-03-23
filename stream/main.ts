import { logger } from "@logger"
logger.setLogLevel(5)

import { GameController } from "./src/game-controller.ts"
import { GameRepository } from "./src/repository/game-repository.ts"
import { createEmptyLogFile } from "./src/helper/log.ts"
import { vmixController } from "./src/vmix/vmixController.ts"

await createEmptyLogFile()

await vmixController.init()
const gameRepository = new GameRepository(vmixController)
const gameController = new GameController(gameRepository)

const id = "871241548029476787"

gameController.createGameSource(id)
gameController.startStream()
