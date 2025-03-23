import { GameSource } from "./game-source/index.ts"
import { SourceDataProcess } from "./game-source/processor.ts"
import { GameRepository } from "./repository/game-repository.ts"
import { logger } from "@logger"
import { vmixController } from "./vmix/vmixController.ts"

export class GameController {
  private gameSource: GameSource | undefined
  private sourceDataProcessor: SourceDataProcess
  private interval: number | undefined

  constructor(gameRepository: GameRepository) {
    this.sourceDataProcessor = new SourceDataProcess(gameRepository)
  }

  public createGameSource(matchId: string) {
    this.gameSource = new GameSource(matchId)
  }

  public stopStream() {
    clearInterval(this.interval)
  }

  public startStream() {
    /*
    This variable control the game start
    if the var is 0, the game is not started
    as the game start, the value is set to 1
    a function start the game when the value hits 1,
    and will not start again as the interval is running
     */
    let isGameStart = 0
    logger.log("starting", "SUCCESS")
    this.interval = setInterval(async () => {
      const data = await this.gameSource!.fetchData()
      console.log("State", data.data.state)
      const currentState = this.sourceDataProcessor.process(data.data)
      if (currentState === "end") {
        vmixController.endClock()
        this.stopStream()
        const postGameData = await this.gameSource!.fetchPostGameData()
        this.sourceDataProcessor.processPostGame(postGameData.data)
      } else if (currentState === "play" && isGameStart === 0) {
        vmixController.startClock()
        isGameStart++
      }
    }, 500)
  }
}
