import requests
from dotenv import load_dotenv
from typing import List, Optional
from dataclasses import dataclass
from datetime import datetime
from os import getenv
import requests


load_dotenv()

from enum import Enum

# Enum for BattleState
class BattleState(Enum):
    INIT = "init"
    BAN = "ban"
    PICK = "pick"
    ADJUST = "adjust"
    LOADING = "loading"
    PLAY = "play"
    END = "end"

@dataclass
class MapPosition:
    x: int
    y: int

@dataclass
class Player:
    roleid: int
    zoneid: int
    name: str
    team_name: str
    team_simple_name: str
    team_id: int
    judger: bool
    campid: int
    pos: int
    banning: bool
    picking: bool
    ban_heroid: int
    heroid: int
    skillid: int
    gold: int
    exp: int
    level: int
    total_hurt: int
    total_damage: int
    total_heal: int
    total_damage_tower: int
    dead: bool
    revive_left_time: int
    major_left_time: int
    skill_left_time: int
    rune_id: int
    kill_num: int
    dead_num: int
    assist_num: int
    rune_map: Optional[dict]
    equip_list: Optional[dict]
    map_pos: MapPosition
    xpm: int
    hit_rate: Optional[dict]
    gold_map: Optional[dict]
    ban_order: int
    pick_order: int
    control_time_ms: int
    total_heal_other: int

@dataclass
class Camp:
    campid: int
    team_name: str
    team_simple_name: str
    team_id: int
    score: int
    kill_lord: int
    kill_tower: int
    total_money: int
    player_list: List[Player]
    ban_hero_list: Optional[List[int]]
    kill_lord_advantage: Optional[dict]
    enemy_area_get: Optional[dict]
    kill_tortoise: int

@dataclass
class BattleData:
    battleid: str
    start_time: str
    win_camp: int
    roomname: str
    state: BattleState
    state_left_time: int
    game_time: int
    dataid: int
    tortoise_left_time: int
    lord_left_time: int
    kill_lord_money_advantage: int
    paused: bool
    camp_list: List[Camp]
    incre_event_list: Optional[dict]
    rune_2023: bool
    banpick_paused: bool

@dataclass
class BattleResponse:
    code: int
    message: str
    dataid: int
    data: BattleData


# Function to fetch the data
def fetch_data(match_id: str, api_key: str, mlbb_server: str) -> BattleResponse:
    url = f"{mlbb_server}battledata?authkey={api_key}&battleid={match_id}&dataid=0"
    
    try:
        response = requests.get(url, headers={"Accept": "application/json"})
        
        if response.status_code != 200:
            raise Exception("Cannot connect to MLBB server")

        data = response.json()
        
        if data.get('code') != 0:
            raise Exception(f"Fetch failed: {data.get('message', 'Unknown error')}")

        # Convert the response to BattleResponse type
        battle_data = BattleData(
            battleid=data['data']['battleid'],
            start_time=data['data']['start_time'],
            win_camp=data['data']['win_camp'],
            roomname=data['data']['roomname'],
            state=data['data']['state'],
            state_left_time=data['data']['state_left_time'],
            game_time=data['data']['game_time'],
            dataid=data['data']['dataid'],
            tortoise_left_time=data['data']['tortoise_left_time'],
            lord_left_time=data['data']['lord_left_time'],
            kill_lord_money_advantage=data['data']['kill_lord_money_advantage'],
            paused=data['data']['paused'],
            camp_list=[
                Camp(
                    campid=camp['campid'],
                    team_name=camp['team_name'],
                    team_simple_name=camp['team_simple_name'],
                    team_id=camp['team_id'],
                    score=camp['score'],
                    kill_lord=camp['kill_lord'],
                    kill_tower=camp['kill_tower'],
                    total_money=camp['total_money'],
                    player_list=[
                        Player(
                            roleid=player['roleid'],
                            zoneid=player['zoneid'],
                            name=player['name'],
                            team_name=player['team_name'],
                            team_simple_name=player['team_simple_name'],
                            team_id=player['team_id'],
                            judger=player['judger'],
                            campid=player['campid'],
                            pos=player['pos'],
                            banning=player['banning'],
                            picking=player['picking'],
                            ban_heroid=player['ban_heroid'],
                            heroid=player['heroid'],
                            skillid=player['skillid'],
                            gold=player['gold'],
                            exp=player['exp'],
                            level=player['level'],
                            total_hurt=player['total_hurt'],
                            total_damage=player['total_damage'],
                            total_heal=player['total_heal'],
                            total_damage_tower=player['total_damage_tower'],
                            dead=player['dead'],
                            revive_left_time=player['revive_left_time'],
                            major_left_time=player['major_left_time'],
                            skill_left_time=player['skill_left_time'],
                            rune_id=player['rune_id'],
                            kill_num=player['kill_num'],
                            dead_num=player['dead_num'],
                            assist_num=player['assist_num'],
                            rune_map=player['rune_map'],
                            equip_list=player['equip_list'],
                            map_pos=MapPosition(x=player['map_pos']['x'], y=player['map_pos']['y']),
                            xpm=player['xpm'],
                            hit_rate=player['hit_rate'],
                            gold_map=player['gold_map'],
                            ban_order=player['ban_order'],
                            pick_order=player['pick_order'],
                            control_time_ms=player['control_time_ms'],
                            total_heal_other=player['total_heal_other'],
                        ) for player in camp['player_list']
                    ],
                    ban_hero_list=camp.get('ban_hero_list'),
                    kill_lord_advantage=camp.get('kill_lord_advantage'),
                    enemy_area_get=camp.get('enemy_area_get'),
                    kill_tortoise=camp['kill_tortoise']
                ) for camp in data['data']['camp_list']
            ],
            incre_event_list=data['data'].get('incre_event_list'),
            rune_2023=data['data']['rune_2023'],
            banpick_paused=data['data']['banpick_paused']
        )

        return BattleResponse(
            code=data['code'],
            message=data['message'],
            dataid=data['dataid'],
            data=battle_data
        )

    except Exception as error:
        raise Exception(f"Error fetching data: {str(error)}")


match_id = "620197174819854897"
api_key = getenv("API_KEY")

battle_response = fetch_data(match_id, api_key, "https://esportsdata-sg.mobilelegends.com/")

VMIX_SERVER = ""

def create_text_url(blockId, blockName, value):
    return f""

def postdata_process():
    pos
    name 
    kill
    death
    assist
    gold
    pick
    skillid
    items
    return 


def emblem_process():
    pos
    pick
    skillid
    name
    level
    kill
    death
    assist
    dmgDealt
    dmgTaken
    bigRune
    runes
    return 
