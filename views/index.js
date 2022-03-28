const socket = io('http://localhost:3001')
socket.on('connection')

let dropList = [];

var Inv;

function toggle(but) {
    //   if (document.getElementById("follow").value == "OFF") {
    //       document.getElementById("follow").value = "ON";
    //   } else if (document.getElementById("follow").value == "ON") {
    //      document.getElementById("follow").value = "OFF";
    //  }
    if (but.classList.contains('off') && but.id == 'follow') {
        Follow();


    } else {
        Stop();
    }

    if (but.classList.contains('off') && but.id == 'defend') {
        var off = true;

        socket.emit('defend', off);
    } else {
        var on = false;
        socket.emit('defend', on);
    }

    if (but.classList.contains('off') && but.id == 'kill') {
        var off = true;
        var player = document.getElementById('players').value;
        socket.emit('kill', off, player);
    } else {
        var on = false;
        var player = document.getElementById('players').value;
        socket.emit('kill', on, player);
    }

    const toggleClass = (el, className) => el.classList.toggle(className);
    toggleClass(but, 'off');
    //document.getElementById('follow').classList.toggle('off');
    // document.getElementById('defend').classList.toggle('off');
}


socket.on('inventory', (data) => {
    // document.getElementById('inv').innerHTML = null;
    var arr = Array.from(data);

    for (let i = 9; i < 45; i++) {
        document.getElementById(i).innerHTML = null;
    }

    for (let i = 0; i < arr.length; i++) {
        // console.log(data[i].slot);

        document.getElementById(arr[i].slot).innerHTML = `<img src="/textures/${data[i].name}.png"><a>${data[i].count}</a></img>`;
        document.getElementById(arr[i].slot).name = data[i].name;
        // document.getElementById(data[i].slot).innerHTML = `<a>${data[i].name}</a>`
        //   if (data[i] == null) {
        //    document.getElementById('inv').innerHTML += `<div class='inv'></div>`
        //    } else {

        //      document.getElementById('inv').innerHTML += `<div class='inv'>${data[i].name}</div>`
        //      console.log(data[i].slot);

        //  }

        //  if (data[i].slot != null || data[i].slot === i) {
        //     document.getElementById('inv').innerHTML += `<div class='inv'>${data[i].name}</div>`
        //      console.log(data[i].slot);
        //  } else {
        //      document.getElementById('inv').innerHTML += `<div class='inv'></div>`
        // }

    }

});

for (let i = 9; i < 45; i++) {

    if (i > 35) {
        document.getElementById('inv').innerHTML += `<button style="margin-top: 20px" class="inv" id="${i}" onclick="invSlot(this);"></button>`
    } else {
        document.getElementById('inv').innerHTML += `<button class="inv" id="${i}" onclick="invSlot(this);"></button>`
    }
}

var dropitem;
var dropitemcount;

function invSlot(but) {
    const toggleClass = (el, className) => el.classList.toggle(className);
    toggleClass(but, 'border');

    // dropList.push(but.id);
    //  dropitem = but.name;
    dropitemcount = but.id;
};

const drop = () => {
    socket.emit('drop', dropitemcount);
    document.getElementById(dropitemcount).classList.toggle('border');
}


const chestdrop = () => {
    socket.emit('chestdrop', dropitemcount);
    document.getElementById(dropitemcount).classList.toggle('border');
}

socket.on('health', (data) => {
    document.getElementById('health').textContent = Math.round(data);
})
socket.on('hunger', (data) => {
    document.getElementById('hunger').textContent = Math.round(data);
})

socket.on('name', (data) => {

    document.getElementById('name').textContent = data;
    document.getElementById('img').src = 'https://minotar.net/armor/body/' + data;
})

var playerList = [];
socket.on('players', (data) => {
    // var arr = JSON.parse(data);
    // console.log(data['tigy']);

    for (let i = 0; i < data.length; i++) {
        if (!playerList.includes(data[i])) {
            playerList.push(data[i])
            document.getElementById('players').innerHTML += `<option value="${data[i]}">${data[i]}</option>`;
        }


        //  document.getElementById('players').innerHTML += `<option value="${data[i].username}">${data[i].username}</option>`;
        //console.log(data[i].username);
    }

    if (playerList.length != data.length) {
        document.getElementById('players').innerHTML = null;
        playerList = [];

    }


})

const Follow = () => {
    var player = document.getElementById('players').value;
    socket.emit('follow', player);
}

const Stop = () => {
    socket.emit('stop', 'stop')
}


const sendmessage = () => {
    var input = document.getElementById('chatInput').value;
    socket.emit('sendmessage', input);
    document.getElementById('chatInput').value = null;
    console.log(input);
}