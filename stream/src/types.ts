export interface TeamData {
  name: string
  score: number
  gold: number
  tortoise: number
  lord: number
  tower: number
  blueBuff: number
  redBuff: number
}

export interface PlayerData {
  name: string
  pos: number
  ban: number
  pick: number
  gold: number
  kill: number
  death: number
  assist: number
  level: number
  roleid: number
  skillid: number
  dmgTaken: number // total_hurt
  dmgDealt: number // total_damage
  rune: number
  runeMap: { "1": number; "2": number; "3": number }
  item_list: number[]
  mvp: boolean
}

export type IScoreboard = Omit<TeamData, "name">

export type BattleState =
  | "init"
  | "ban"
  | "pick"
  | "adjust"
  | "loading"
  | "play"
  | "end"
