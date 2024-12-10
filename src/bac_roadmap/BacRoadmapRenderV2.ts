enum BaccaratResult {
    Banker = 0b1,                 // 1
    Player = 0b10,                // 2
    Tie = 0b100,                  // 4
    BankerPair = 0b1000,          // 8
    PlayerPair = 0b10000,         // 16
    Big = 0b100000,               // 32
    Small = 0b1000000,            // 64
    BankerNatural = 0b10000000,   // 128
    PlayerNatural = 0b100000000,  // 256
    SuperSix = 0b1000000000,      // 512
    AnyPair = 0b10000000000,      // 1024
    PerfectPair = 0b100000000000, // 2048
    BankerDragonBonus = 0b1000000000000,  // 4096
    PlayerDragonBonus = 0b10000000000000, // 8192
}

class BacRoadmapUtilsV2 {

}