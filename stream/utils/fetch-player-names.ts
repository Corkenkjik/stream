import { logger } from "@logger"
import { BattleResponse } from "../src/game-source/types.ts"
import { MLBB_SERVER } from "../src/helper/constants.ts"
import { env } from "../src/helper/env.ts"

const matchId = "871241548029476787"

// deno-fmt-ignore
const url = `${MLBB_SERVER}battledata?authkey=${env.api_key}&battleid=${matchId}&dataid=0`

const response = await fetch(
  url,
  {
    method: "GET",
    headers: { "Accept": "application/json" },
  },
)

const data = await response.json() as BattleResponse

const blueTeam = data.data.camp_list.find((x) => x.campid === 1)!.player_list
const redTeam = data.data.camp_list.find((x) => x.campid === 2)!.player_list

logger.log(`Blue team names\n${blueTeam.map((x) => x.name)}`, "INFO")
logger.log(`Red team names\n${redTeam.map((x) => x.name)}`, "INFO")
