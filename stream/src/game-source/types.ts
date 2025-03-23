import { BattleState } from "../types.ts"

export interface BattleResponse {
  code: number
  message: string
  dataid: number
  data: BattleData
}

export interface BattleData {
  battleid: string
  start_time: string
  win_camp: number
  roomname: string
  state: BattleState
  state_left_time: number
  game_time: number
  dataid: number
  tortoise_left_time: number
  lord_left_time: number
  kill_lord_money_advantage: number
  paused: boolean
  camp_list: Camp[]
  incre_event_list: any | null
  rune_2023: boolean
  banpick_paused: boolean
}

export interface Camp {
  campid: 1 | 2 | 5
  team_name: string
  team_simple_name: string
  team_id: number
  score: number
  kill_lord: number
  kill_tower: number
  total_money: number
  player_list: Player[]
  ban_hero_list: number[] | null
  kill_lord_advantage: any | null
  enemy_area_get: any | null
  kill_tortoise: number
}

export interface Player {
  roleid: number //
  name: string
  campid: number
  banning: boolean
  picking: boolean
  ban_heroid: number
  heroid: number
  skillid: number //
  gold: number
  exp: number
  level: number
  total_hurt: number //
  total_damage: number //
  dead: boolean
  rune_id: number //
  kill_num: number
  dead_num: number
  assist_num: number
  rune_map: any | null
  equip_list: any | null
  ban_order: number
  pick_order: number
  // [key: string]: any
}

export interface PostBattleResponse {
  code: number
  message: string
  data: PostBattleData
}

export interface PostBattleData {
  battleid: string
  start_time: string
  win_camp: number
  hero_list: PostBattleHero[]
  camp_list: PostBattleCamp[]
  event_list: any[]
  game_time: number
  rune_2023: boolean
}

interface PostBattleHero {
  mvp: boolean
  name: string
  [key: string]: any
}

export interface PostBattleCamp {
  red_buff_num: number
  blue_buff_num: number
  campid: number
  [key: string]: any
}
