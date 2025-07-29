from enum import Enum


class GameTypeEnum(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    LUCK = "luck"
