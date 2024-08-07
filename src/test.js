// this.identityDictionary = {
//     b: 'banker', // banker
//     p: 'player', // player
//     t: 'tie', // tie
//     q: 'banker', // banker banker-pair
//     w: 'banker', // banker banker-pair player-pair
//     e: 'banker', // banker player-pair
//     f: 'player', // player banker-pair
//     g: 'player', // player banker-pair player-pair
//     h: 'player', // player player-pair
//     i: 'tie', // tie banker-pair
//     j: 'tie', // tie banker-pair player-pair
//     k: 'tie', // tie player-pair
//     l: 'banker', // banker
//     m: 'banker', // banker banker-pair
//     n: 'banker', // banker banker-pair player-pair
//     o: 'banker' // banker player-pair
// };


const banker = 0b1
const player = 0b10
const tie = 0b100
const bankerPair =  0b1000
const playerPair = 0b10000
// ......


const result = player + bankerPair + playerPair
console.log(result)


if(result & banker) {
    console.log('is banker')
    return 'banker'
}

if(result & player) {
    console.log('is player')
    return 'player'
}

if(result & tie) {
    console.log('is tie')
}
if (result & bankerPair) {
    console.log('is bankerPair')
}
// ...banker

const resultArray = []
resultArray.push(result)