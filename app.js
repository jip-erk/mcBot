const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin;
const GoalFollow = goals.GoalFollow
const armorManager = require('mineflayer-armor-manager')
const readline = require('readline');
const autoeat = require("mineflayer-auto-eat")


const express = require("express");
const app = express()
const server = require("http").createServer(app)
const io = require('socket.io')(server, { cors: { origin: "*" } })

let interval;
var isfollowing = false;

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.render("index");

})


server.listen(3001, () => {
    console.log("server running...")
})

var i;
io.on("connection", (socket) => {
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 500);

    var i = socket;

    socket.on('follow', (data) => {
        isfollowing = true;
        findplayers();
    });

    socket.on('stop', (data) => {
        isfollowing = false;
    });

    socket.on('drop', (data, val) => {

        //   bot.toss(data, null, val);

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
    // Emitting a new message. Will be consumed by the client
    socket.emit("health", response);
    socket.emit("name", bot.username);
    socket.emit("hunger", bot.food);
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


//const mineflayerViewer = require('prismarine-viewer').mineflayer
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

var inpvp = false;
var stop = false;



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

        if (bot.food === 20) bot.autoEat.disable()
            // Disable the plugin if the bot is at 20 food points
        else bot.autoEat.enable() // Else enable the plugin again

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



    })
    //function hand (){bot.unequip('hand')}


function defend() {
    const entity = bot.nearestEntity(filter)
    if (entity) {
        setTimeout(() => {
            const sword = bot.inventory.items().find(item => item.name.includes('sword'))
            if (sword) bot.equip(sword, 'hand')
        })

        bot.pvp.attack(entity)

        //setTimeout(hand, 8000)
    }
}


function findplayers() {

    if (!isfollowing) {
        bot.pathfinder.setGoal(null);
        return;
    }


    const playerFilter2 = (entity) => entity.type === 'player'
    const target = bot.nearestEntity(playerFilter2)

    if (!target) {
        setTimeout(findplayers, 300);
        return
    }



    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)

    defaultMove.canDig = false

    bot.pathfinder.setMovements(defaultMove)

    const goal = new GoalFollow(target, 4)
    bot.pathfinder.setGoal(goal, true)

    if (!bot.pathfinder.isMoving()) {
        lookat();
    }


    setTimeout(findplayers, 700);


}



bot.once('spawn', chat, )


function lookat() {
    const playerFilter = (entity) => entity.type === 'player'
    const playerEntity = bot.nearestEntity(playerFilter)

    if (!playerEntity) return

    const pos = playerEntity.position.offset(0, playerEntity.height, 0)
    bot.lookAt(pos)
}