const sleep=(ms)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, ms);
    })
}

const mainTest = async()=>{
    await reconnect()
}

let reconnecting = false

const reconnect = async()=>{
    console.log('start reconnect');
    if(reconnecting) {
        console.log('reconnect failed');
        return
    }
    console.log('reconnect success');
    reconnecting = true
    await sleep(1000)
    reconnecting = false
    await reconnect()
}

mainTest()