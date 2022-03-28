const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin;
const GoalFollow = goals.GoalFollow
const GoalBlock = goals.GoalBlock
const armorManager = require('mineflayer-armor-manager')
const readline = require('readline');
const autoeat = require("mineflayer-auto-eat")


const express = require("express");
const { consumers } = require('stream');
const app = express()
const server = require("http").createServer(app)
const io = require('socket.io')(server, { cors: { origin: "*" } })

var mcData;

let interval;
var canFollow = false;


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.render("index");

})


server.listen(3001, () => {
    console.log("server running...")
})
var chestitem;
var i;
var onOff = false;
var pvpOnOff = false;
var playerTokill;
var playerToFollow;


io.on("connection", (socket) => {
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 500);


    //on defend
    socket.on('defend', (data) => {
        // isfollowing = true;
        onOff = data;
        defend();

    });

    socket.on('kill', (data, player) => {
        // isfollowing = true;
        pvpOnOff = data;
        playerTokill = player;
        killplayer();

    });

    socket.on('follow', (data) => {
        // isfollowing = true;
        //findplayers(data);
        playerToFollow = data;
        findplayers();
    });

    socket.on('stop', (data) => {
        //   isfollowing = false;
        bot.pathfinder.setGoal(null);

    });

    socket.on('sendmessage', (data) => {
        bot.chat(data);

    });


    socket.on('drop', (data) => {

        const itemss = bot.inventory.items();
        var dropitem;
        for (let i = 0; i < itemss.length; i++) {
            if (itemss[i].slot == data) {
                dropitem = itemss[i];
            }
        }
        // console.log(bot.inventory.items());
        // console.log(item, val);
        bot.tossStack(dropitem, test);
        //test();
    });


    socket.on('chestdrop', (data) => {

        const itemss = bot.inventory.items();
        var dropitem;
        for (let i = 0; i < itemss.length; i++) {
            if (itemss[i].slot == data) {
                dropitem = itemss[i];
            }
        }
        // console.log(bot.inventory.items());
        // console.log(item, val);
        //  bot.tossStack(dropitem, test);
        depositLoop();
        //test();
        chestitem = dropitem;
    });


    socket.on("disconnect", () => {
        clearInterval(interval);
    });



    test();
    bot.inventory.on('updateSlot', test);

    function test() {
        socket.emit("inventory", bot.inventory.items());
    }
});

const getApiAndEmit = socket => {
    const response = bot.health;
    let players = [];
    //players.push(Object.keys(bot.players));
    Object.keys(bot.players).forEach(item => {
        if (bot.players[item].entity && item != bot.username) {
            players.push(item);
        }

    });
    //const playerList = Object.keys(bot.players).join(", ")
    // Emitting a new message. Will be consumed by the client
    socket.emit("health", response);
    socket.emit("name", bot.username);
    socket.emit("hunger", bot.food);
    socket.emit("players", players);

};









//minflayerbot
const bot = mineflayer.createBot({
    //host: '51.77.99.151',
    host: 'localhost',
    //port: "25565",
    //host: 'localhost',
    //port: '63873',
    version: '1.18.2',
    //   username: 'erkelensjip@gmail.com',
    //   password: '!lego20044',
    //password: 'Baszus888',       
    auth: 'microsoft'
})



bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
bot.loadPlugin(armorManager)
bot.loadPlugin(autoeat)


bot.once('spawn', () => {
    mcData = require('minecraft-data')(bot.version);

});



//const mineflayerViewer = require('prismarine-viewer').mineflayer
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

var inpvp = false;
var stop = false;

const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 9 &&
    e.mobType !== 'Armor Stand' &&
    e.mobType !== 'Villager' &&
    e.mobType !== 'Chicken' &&
    e.mobType !== 'Cow' &&
    e.mobType !== 'Pig' &&
    e.mobType !== 'Cat' &&
    e.mobType !== 'Wolf' &&
    e.mobType !== 'Parrot' &&
    e.mobType !== 'Bat' &&
    e.mobType !== 'Enderman' &&
    e.mobType !== 'Llama' &&
    e.mobType !== 'Bee' &&
    e.mobType !== 'Donkey' &&
    e.mobType !== 'Squid' &&
    e.mobType !== 'Fox' &&
    e.mobType !== 'Sheep' &&
    e.mobType !== 'Horse' &&
    e.mobType !== 'Salmon' &&
    e.mobType !== 'Iron Golem'

function chat() {
    rl.question('chat: ', (userInput) => {
        if (userInput === '!kill') {
            rl.question('kill: ', (killplayer) => {

                setTimeout(() => {
                    const sword = bot.inventory.items().find(item => item.name.includes('sword'))
                    if (sword) bot.equip(sword, 'hand')
                }, 150)

                inpvp = true
                const player = bot.players[killplayer]
                bot.pvp.attack(player.entity)
                chat();
                setTimeout(inpvpp, 30000);
                bot.unequip('hand');
            });


        } else if (userInput === '!drop') {

            function tossNext() {
                if (bot.inventory.items().length === 0) return
                const item = bot.inventory.items()[0]
                bot.tossStack(item, tossNext)
            }
            tossNext()

            chat();
        } else if (userInput === '!cords') {
            console.log(bot.entity.position);
            chat();

        } else {
            bot.chat(userInput);
            chat();
        }


    });
};


function inpvpp() {
    inpvp = false;
    bot.pvp.stop()
}


bot.once("spawn", () => {
    bot.autoEat.options = {
        priority: "saturation",
        startAt: 16,
        bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh"],
    }
});


bot.on('physicTick', () => {
        // lookat();
        //if(stop === false) findplayers(); bot.chat('ssss')

        //findplayers();

        // document.getElementById("health").innerHTML == bot.health;

        if (bot.health < 20 && bot.food != 20 && !pvpOnOff) {
            bot.autoEat.eat();
        }
        if (bot.food === 20) bot.autoEat.disable()
            // Disable the plugin if the bot is at 20 food points
        else bot.autoEat.enable() // Else enable the plugin again





    })
    //function hand (){bot.unequip('hand')}


function defend() {

    if (!onOff) return;

    const entity = bot.nearestEntity(filter)
    if (entity) {

        const sword = bot.inventory.items().find(item => item.name.includes('sword'))
        if (sword) bot.equip(sword, 'hand')


        bot.pvp.attack(entity)


    } else {
        findplayers();
    }
    setTimeout(defend, 800);
}

function killplayer() {

    if (!pvpOnOff) {
        bot.pvp.stop();
        return;
    }
    const sword = bot.inventory.items().find(item => item.name.includes('sword'))
        // setTimeout(() => {
    if (sword) bot.equip(sword, 'hand');
    //    if (sword) bot.equip(sword, 'hand')
    // }, 150)


    const player = bot.players[playerTokill]

    if (!player || !player.entity) return;

    bot.pvp.attack(player.entity)


    // bot.unequip('hand');

    setTimeout(killplayer, 200)
}



function findplayers() {

    if (!bot.pathfinder.isMoving()) {
        lookat();
    }

    //  if (!isfollowing) {
    //  bot.pathfinder.setGoal(null);
    //    return;
    // }

    // const playerFilter2 = (entity) => entity.type === 'player'
    const target = bot.players[playerToFollow]; //bot.nearestEntity(playerFilter2)


    if (!target || !target.entity) {
        //  setTimeout(findplayers, 500);
        return;
    }


    canFollow = true;

    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)

    defaultMove.canDig = false

    bot.pathfinder.setMovements(defaultMove)

    const goal = new GoalFollow(target.entity, 4)
    bot.pathfinder.setGoal(goal, true)




    //   setTimeout(findplayers, 700);


}



bot.once('spawn', chat, )


function lookat() {
    const playerFilter = (entity) => entity.type === 'player'
    const playerEntity = bot.nearestEntity(playerFilter)

    if (!playerEntity) return

    const pos = playerEntity.position.offset(0, playerEntity.height, 0)
    bot.lookAt(pos)
}

//chest

async function depositLoop() {


    let chestBlock = bot.findBlock({
        matching: mcData.blocksByName['chest'].id,
    });

    if (!chestBlock) {
        return;
    }

    const defaultMove = new Movements(bot, mcData);
    defaultMove.canDig = false;


    const x = chestBlock.position.x;
    const y = chestBlock.position.y;
    const z = chestBlock.position.z;

    const goal = new GoalBlock(x, y, z)

    var isDefending = false
    if (onOff) isDefending = true;

    onOff = false;
    if (bot.entity.position.distanceTo(chestBlock.position) < 2) {
        // bot.setControlState('forward', false);
        await bot.lookAt(chestBlock.position);
        let chest = await bot.openChest(chestBlock);

        //  for (slot of bot.inventory.slots) {
        //    if (slot && slot.nam e == harvestName) {
        //          await chest.deposit(slot.type, null, slot.count);
        //      }
        // }

        await chest.deposit(chestitem.type, null, chestitem.count);
        chest.close();

        if (canFollow) {
            findplayers();
        }
        if (isDefending) {
            onOff = true;
            defend();
        }

    } else {

        bot.pathfinder.setGoal(goal);
        //  bot.lookAt(chestBlock.position);
        //  bot.setControlState('forward', true);
        setTimeout(depositLoop, 500);
    }
}