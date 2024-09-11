const banker = 0b1
const player = 0b10
const tie = 0b100
const banker_pair = 0b1000
const player_pair = 0b10000
const big = 0b100000
const small = 0b1000000
const banker_natural = 0b10000000
const player_natural = 0b100000000
const super_six = 0b1000000000
const any_pair = 0b10000000000
const perfect_pair = 0b100000000000
const banker_dragon_bouns = 0b1000000000000
const player_dragon_bouns = 0b10000000000000


const result = banker + banker_pair + super_six + any_pair + player_pair + newValue + banker_dragon_bouns
const result2 = banker + small + newValue

// react
const test = () => {
    let result = 0
    if(isWin) {
        result += banker
    }
    if(isPlayerPair) {
        result += player_pair
    }
    if(isBankerPair) {
        result += banker_pair
    }
    if(isSix) {
        result += super_six
    }
    // ...
    return result
}

const resultArr = [result,result2]
console.log(resultArr)


const bacResultImgData2 = {
    // banker
    [banker]: "resources/game_icons/type61.png",
    [banker+banker_pair]: "resources/game_icons/type62.png",
    [banker+player_pair]: "resources/game_icons/type63.png",
    [banker+banker_pair+player_pair]: "resources/game_icons/type64.png",
    // player
    [player]: "resources/game_icons/type65.png",
    [player+banker_pair]: "resources/game_icons/type66.png",
    [player+player_pair]: "resources/game_icons/type67.png",
    [player+banker_pair+player_pair]: "resources/game_icons/type68.png",
    // tie
    [tie]: "resources/game_icons/type69.png",
    [tie+banker_pair]: "resources/game_icons/type70.png",
    [tie+player_pair]: "resources/game_icons/type71.png",
    [tie+banker_pair+player_pair]: "resources/game_icons/type72.png",
}


const newImagesArray = resultArr.map(row => {
    let result = 0;
    if (row & banker) {
        result += banker
    }
    if (row & player){
        result += player
    }
    if (row & tie){
        result += tie
    }
    if (row & banker_pair) {
        result += banker_pair
    }
    if (row & player_pair) {
        result += player_pair
    }
    console.log(result)
    return bacResultImgData2[result]
})

console.log(newImagesArray)