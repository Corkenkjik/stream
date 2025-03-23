import { logger } from "@logger"
import { GameRepository } from "../repository/game-repository.ts"
import { BattleData, Camp, PostBattleCamp, PostBattleData } from "./types.ts"
import { PlayerData } from "../types.ts"
import { getPosition } from "../../player-position.ts"

export class SourceDataProcess {
  gameRepository: GameRepository
  constructor(gameRepository: GameRepository) {
    this.gameRepository = gameRepository
  }

  private getTeam = (data: BattleData) => {
    let blueTeam = {} as Camp
    let redTeam = {} as Camp

    data.camp_list.forEach((camp) => {
      if (camp.campid === 1) {
        blueTeam = camp
      } else if (camp.campid === 2) {
        redTeam = camp
      }
    })

    return { blueTeam, redTeam }
  }

  private getTeamPostGame(data: PostBattleData) {
    let blueTeam = {} as PostBattleCamp
    let redTeam = {} as PostBattleCamp

    data.camp_list.forEach((camp) => {
      if (camp.campid === 1) {
        blueTeam = camp
      } else if (camp.campid === 2) {
        redTeam = camp
      }
    })

    return { blueTeam, redTeam }
  }

  private onPostGameHandler(data: BattleData) {
    logger.log("Running end game analysis", "SUCCESS")
    const { blueTeam, redTeam } = this.getTeam(data)

    this.gameRepository.reducers["updatePostGameTeam"]({
      blue: {
        score: blueTeam.score,
        lord: blueTeam.kill_lord,
        tortoise: blueTeam.kill_tortoise,
        tower: blueTeam.kill_tower,
        gold: blueTeam.total_money,
        blueBuff: 0,
        redBuff: 0,
      },
      red: {
        score: redTeam.score,
        lord: redTeam.kill_lord,
        tortoise: redTeam.kill_tortoise,
        tower: redTeam.kill_tower,
        gold: redTeam.total_money,
        blueBuff: 0,
        redBuff: 0,
      },
    })

    const bluePlayers: Omit<PlayerData, "ban">[] = blueTeam
      .player_list.map(
        (player) => {
          return {
            assist: player.assist_num,
            death: player.dead_num,
            kill: player.kill_num,
            gold: player.gold,
            item_list: player.equip_list,
            level: player.level,
            name: player.name,
            pick: player.heroid,
            pos: getPosition(player.name),
            dmgDealt: player.total_damage,
            dmgTaken: player.total_hurt,
            roleid: player.roleid,
            rune: player.rune_id,
            skillid: player.skillid,
            runeMap: player.rune_map,
            mvp: false,
          }
        },
      )
    const redPlayers: Omit<PlayerData, "ban">[] = redTeam
      .player_list.map(
        (player) => {
          return {
            assist: player.assist_num,
            death: player.dead_num,
            kill: player.kill_num,
            gold: player.gold,
            item_list: player.equip_list,
            level: player.level,
            name: player.name,
            pick: player.heroid,
            pos: getPosition(player.name),
            dmgDealt: player.total_damage,
            dmgTaken: player.total_hurt,
            roleid: player.roleid,
            rune: player.rune_id,
            skillid: player.skillid,
            runeMap: player.rune_map,
            mvp: false,
          }
        },
      )

    this.gameRepository.reducers["updatePostGamePlayers"]([
      ...bluePlayers,
      ...redPlayers,
    ])
  }

  private onBanHandler(data: BattleData) {
    const { blueTeam, redTeam } = this.getTeam(data)

    const banMap = new Map()

    blueTeam.player_list.forEach((player) => {
      banMap.set(getPosition(player.name), player.ban_heroid)
    })
    redTeam.player_list.forEach((player) => {
      banMap.set(getPosition(player.name), player.ban_heroid)
    })
    this.gameRepository.reducers["updateBan"](banMap)
  }

  private onPickHandler(data: BattleData) {
    const { blueTeam, redTeam } = this.getTeam(data)

    const pickMap = new Map()
    blueTeam.player_list.forEach((player) => {
      pickMap.set(getPosition(player.name), player.heroid)
    })
    redTeam.player_list.forEach((player) => {
      pickMap.set(getPosition(player.name), player.heroid)
    })
    this.gameRepository.reducers["updatePick"](pickMap)
  }

  private onIngameHandler(data: BattleData) {
    const { blueTeam, redTeam } = this.getTeam(data)

    this.gameRepository.reducers["updateIngame"]({
      blue: {
        gold: blueTeam.total_money,
        score: blueTeam.score,
        lord: blueTeam.kill_lord,
        tortoise: blueTeam.kill_tortoise,
        tower: blueTeam.kill_tower,
        blueBuff: 0,
        redBuff: 0,
      },
      red: {
        gold: redTeam.total_money,
        score: redTeam.score,
        lord: redTeam.kill_lord,
        tortoise: redTeam.kill_tortoise,
        tower: redTeam.kill_tower,
        blueBuff: 0,
        redBuff: 0,
      },
    })
  }

  process(data: BattleData) {
    this.gameRepository.reducers["updateGameState"](data.state)
    if (data.state === "end") {
      this.onPostGameHandler(data)
      return "end"
    } else if (data.state === "ban") {
      this.onBanHandler(data)
    } else if (data.state === "pick") {
      this.onPickHandler(data)
    } else if (data.state === "play") {
      this.onIngameHandler(data)
      return "play"
    }
  }
  processPostGame(data: PostBattleData) {
    const { blueTeam, redTeam } = this.getTeamPostGame(data)

    const mvpName = data.hero_list.find((hero) => hero.mvp)!.name
    const winTeam = data.win_camp

    this.gameRepository.reducers["updateWinCamp"](winTeam)

    this.gameRepository.reducers["updateBuff"]({
      blue: {
        blueBuff: blueTeam.blue_buff_num,
        redBuff: blueTeam.red_buff_num,
      },
      red: { blueBuff: redTeam.blue_buff_num, redBuff: redTeam.red_buff_num },
    })

    this.gameRepository.reducers["updateMvp"](mvpName)
  }
}
