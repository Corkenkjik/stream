import { BattleState, IScoreboard, PlayerData, TeamData } from "../types.ts"
import { VmixController } from "../vmix/vmixController.ts"
import { PlayerSideEffects, TeamDataSideEffects } from "./side-effects.ts"

const initalTeamData: TeamData = {
  name: "",
  score: 0,
  gold: 0,
  tortoise: 0,
  lord: 0,
  tower: 0,
  blueBuff: 0,
  redBuff: 0,
}

const intialPlayerData: PlayerData = {
  assist: 0,
  ban: 0,
  death: 0,
  gold: 0,
  item_list: Array(6).fill(0),
  kill: 0,
  level: 0,
  name: "",
  pick: 0,
  pos: 0,
  dmgDealt: 0,
  dmgTaken: 0,
  roleid: 0,
  rune: 0,
  skillid: 0,
  runeMap: { "1": 0, "2": 0, "3": 0 },
  mvp: false,
}

export class GameRepository {
  public vmixController: VmixController | undefined
  private playerSideEffects: PlayerSideEffects = new PlayerSideEffects(this)
  private teamDataSideEffects: TeamDataSideEffects = new TeamDataSideEffects(
    this,
  )

  private _gameState: BattleState = "init"

  private _teamData = {} as {
    blue: TeamData
    red: TeamData
  }

  public teamWin = 0

  public get gameState() {
    return this._gameState
  }
  private set gameState(data: BattleState) {
    this._gameState = data
    // this.sideEffects["gameState"]()
  }

  public get teamData() {
    return this._teamData
  }
  private set teamData(data: { blue: TeamData; red: TeamData }) {
    this._teamData = data
    this.sideEffects["teamData"]()
  }

  private _players: PlayerData[] = []
  public get players() {
    return this._players
  }
  private set players(data: PlayerData[]) {
    this._players = data
    this.sideEffects["players"]()
  }

  constructor(vmixController: VmixController) {
    this.vmixController = vmixController
    this.init()
  }

  /**
   * On initial this class, Sets all HUDs to the default values
   */
  private init() {
    this.teamData = { blue: initalTeamData, red: initalTeamData }
    this.players = Array(10).fill(intialPlayerData).map((x, index) => {
      return { ...x, pos: index + 1 }
    }) as PlayerData[]
    this.teamWin = 0
  }

  private sideEffects = {
    "teamData": async () => {
      await this.teamDataSideEffects.process()
    },
    "players": async () => {
      await this.playerSideEffects.process()
    },
  }

  reducers = {
    updateGameState: (gameState: BattleState) => {
      this.gameState = gameState
    },
    updateBan: (data: Map<number, number>) => {
      const newPlayers = this.players.map((player) => {
        return { ...player, ban: data.get(player.pos) || player.ban }
      })

      this.players = newPlayers
    },
    updatePick: (data: Map<number, number>) => {
      const newPlayers = this.players.map((player) => {
        return { ...player, pick: data.get(player.pos) || player.pick }
      })
      this.players = newPlayers
    },
    updateIngame: ({ blue, red }: { blue: IScoreboard; red: IScoreboard }) => {
      const newBlueTeamData = { ...this.teamData.blue, ...blue }
      const newRedTeamData = { ...this.teamData.red, ...red }
      this.teamData = { blue: newBlueTeamData, red: newRedTeamData }
    },
    updatePostGamePlayers: (players: Omit<PlayerData, "ban">[]) => {
      this.players = players.map((x) => ({ ...x, ban: 0 }))
    },
    updatePostGameTeam: (
      { blue, red }: { blue: IScoreboard; red: IScoreboard },
    ) => {
      const newBlueTeamData = { ...this.teamData.blue, ...blue }
      const newRedTeamData = { ...this.teamData.red, ...red }
      this.teamData = { blue: newBlueTeamData, red: newRedTeamData }
    },
    updateBuff: (
      { blue, red }: {
        blue: { blueBuff: number; redBuff: number }
        red: { blueBuff: number; redBuff: number }
      },
    ) => {
      const newBlueTeamData: TeamData = {
        ...this.teamData.blue,
        blueBuff: blue.blueBuff,
        redBuff: blue.redBuff,
      }
      const newRedTeamData: TeamData = {
        ...this.teamData.red,
        blueBuff: red.blueBuff,
        redBuff: red.redBuff,
      }
      this.teamData = { blue: newBlueTeamData, red: newRedTeamData }
    },
    updateMvp: (mvpName: string) => {
      const newPlayers = this.players.map((player) => {
        return { ...player, mvp: player.name === mvpName }
      })
      this.players = newPlayers
    },
    updateWinCamp: (winCamp: number) => {
      this.teamWin = winCamp
    },
  }
}
