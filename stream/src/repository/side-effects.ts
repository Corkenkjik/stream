import { logger } from "@logger"
import { checkResetStatus, updateJsonFile } from "../helper/core.ts"
import { GameRepository } from "./game-repository.ts"

abstract class SideEffects {
  protected repository: GameRepository

  constructor(repository: GameRepository) {
    this.repository = repository
  }
}

export class PlayerSideEffects extends SideEffects {
  private get controller() {
    return this.repository.vmixController!
  }

  private get players() {
    return this.repository.players
  }
  public async process() {
    if (this.repository.gameState === "ban") {
      await this.updateBanpickPluginBanIsland()
      await this.updateBanpickPluginPlayerNameIsland()
    } else if (this.repository.gameState === "pick") {
      this.updateBanpickPluginPickIsland()
      this.updateWaitingPlugin()
    } else if (this.repository.gameState === "end") {
      this.updateMvpPlugin()
      this.updatePostgamePluginPlayerStatIsland()
      this.updatePostgamePluginPlayerItemIsland()
    } else if (this.repository.gameState === "init") {
      const hasLayoutReset = await checkResetStatus("player")
      logger.log("Has player reset " + hasLayoutReset, "INFO")
      if (!hasLayoutReset) {
        await this.updateBanpickPluginBanIsland()
        this.updateBanpickPluginPickIsland()
        await this.updateBanpickPluginPlayerNameIsland()
        this.updateWaitingPlugin()
        this.updatePostgamePluginPlayerStatIsland()
        this.updatePostgamePluginPlayerItemIsland()
        this.resetMvpPlugin()
        await updateJsonFile(Deno.cwd() + "/is_reset.json", { player: true })
      } else {
        logger.log("Skip resetting player data", "INFO")
      }
    }
  }

  private async updateBanpickPluginBanIsland() {
    await this.controller.banpickPlugin!.banIsland(
      this.players.map((player) => ({ pos: player.pos, ban: player.ban })),
    )
  }

  private async updateBanpickPluginPlayerNameIsland() {
    await this.controller.banpickPlugin!.playerNameIsland(
      this.players.map((player) => ({
        pos: player.pos,
        name: player.name,
      })),
    )
  }

  private updateBanpickPluginPickIsland() {
    this.controller.banpickPlugin!.pickIsland(
      this.players.map((player) => ({
        pos: player.pos,
        pick: player.pick,
      })),
    )
  }

  private updateMvpPlugin() {
    const mvp = this.players.find((player) => {
      const winTeam = this.repository.teamWin
      if (winTeam === 1) {
        return player.pos < 6 && player.mvp
      } else if (winTeam === 2) {
        return player.pos >= 6 && player.mvp
      } else {
        logger.log(
          "teamWin is not set",
          "ERROR",
          "PlayerSideEffects.updateMvpPlugin",
        )
        throw new Error()
      }
    })

    if (mvp) {
      this.controller.mvpPlugin!.textIsland(
        {
          assist: mvp.assist,
          death: mvp.death,
          dmgDealt: mvp.dmgDealt,
          gold: mvp.gold,
          kill: mvp.kill,
        },
      )
      this.controller.mvpPlugin!.imgIsland(
        {
          item_list: mvp.item_list,
          rune: mvp.rune,
          runeMap: mvp.runeMap,
          skillid: mvp.skillid,
        },
      )
    }
  }

  private resetMvpPlugin() {
    this.controller.mvpPlugin!.textIsland(
      {
        assist: 0,
        death: 0,
        dmgDealt: 0,
        gold: 0,
        kill: 0,
      },
    )
    this.controller.mvpPlugin!.imgIsland(
      {
        item_list: Array(6).fill(0),
        rune: 0,
        runeMap: { "1": 0, "2": 0, "3": 0 },
        skillid: 0,
      },
    )
  }

  private updatePostgamePluginPlayerStatIsland() {
    this.controller.postgamePlugin!.playerStatIsland(
      this.players.map((player) => {
        return {
          assist: player.assist,
          death: player.death,
          gold: player.gold,
          kill: player.kill,
          pos: player.pos,
          name: player.name,
          pick: player.pick,
          skillid: player.skillid,
          level: player.level,
          runeMap: player.runeMap,
        }
      }),
    )
  }

  private updatePostgamePluginPlayerItemIsland() {
    this.controller.postgamePlugin!.playerItemIsland(
      this.players.map((player) => ({
        items: player.item_list,
        pos: player.pos,
      })),
    )
  }

  private updateWaitingPlugin() {
    this.controller.waitingPlugin!.heroIsland(
      this.players.map((player) => ({
        pos: player.pos,
        pick: player.pick,
      })),
    )
  }
}

export class TeamDataSideEffects extends SideEffects {
  private get controller() {
    return this.repository.vmixController!
  }

  private get teamData() {
    return this.repository.teamData
  }

  public async process() {
    if (this.repository.gameState === "play") {
      this.updateIngamePluginSoreboardIsland()
    } else if (this.repository.gameState === "end") {
      this.updatePostgameTeamIsland()
    } else if (this.repository.gameState === "init") {
      const isLayoutReset = await checkResetStatus("team")
      logger.log("Has team reset " + isLayoutReset, "INFO")
      if (!isLayoutReset) {
        this.updateIngamePluginSoreboardIsland()
        this.updatePostgameTeamIsland()
        await updateJsonFile(Deno.cwd() + "/is_reset.json", { team: true })
      } else {
        logger.log("Skip resetting team data", "INFO")
      }
    }
  }

  private updateIngamePluginSoreboardIsland() {
    const { name: _, ...blueStat } = this.teamData.blue
    const { name: __, ...redStat } = this.teamData.red
    this.controller.ingamePlugin!.scoreboardIsland({
      blue: blueStat,
      red: redStat,
    })
  }

  private updatePostgameTeamIsland() {
    this.controller.postgamePlugin!.teamIsland({
      blue: this.teamData.blue,
      red: this.teamData.red,
    })
  }
}
