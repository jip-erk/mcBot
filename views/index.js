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

    //follow
    if (but.classList.contains('off') && but.id == 'follow') {
        Follow();
    } else if (but.id == 'follow') {
        console.log('stop');
        socket.emit('stop', 'stop')
    }
    //defend
    if (but.classList.contains('off') && but.id == 'defend') {
        var off = true;

        socket.emit('defend', off);
    } else if (but.id == 'defend') {
        var on = false;
        socket.emit('defend', on);
    }

    //kill  
    if (but.classList.contains('off') && but.id == 'kill') {
        var off = true;
        var player = document.getElementById('players').value;
        socket.emit('kill', off, player);
    } else if (but.id == 'kill') {
        var on = false;
        var player = document.getElementById('players').value;
        socket.emit('kill', on, player);
    }

    if (but.classList.contains('off') && but.id == 'bed') {
        socket.emit('bed', 'sleep');
    };

    if (but.classList.contains('off') && but.id == 'farm') {
        socket.emit('farm', 'farm');
    } else if (but.id == 'farm') {
        socket.emit('farmStop', 'farm');
    }

    //move to cords
    var cords = [];
    //const b = new THREE.Vector3(document.getElementById('x'), document.getElementById('y'), document.getElementById('z'));
    storeCoordinate(document.getElementById('x').value, document.getElementById('y').value, document.getElementById('z').value, cords);



    if (but.classList.contains('off') && but.id == 'moveToCords') {
        socket.emit('moveToCords', cords);
    } else if (but.id == 'moveToCords') {
        socket.emit('StopMoveToCords', cords);
    }


    const toggleClass = (el, className) => el.classList.toggle(className);
    toggleClass(but, 'off');
    //document.getElementById('follow').classList.toggle('off');
    // document.getElementById('defend').classList.toggle('off');
}

function storeCoordinate(xVal, yVal, zVal, array) {
    array.push({ x: xVal, y: yVal, z: zVal });
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
var dropItems = [];

function invSlot(but) {
    const toggleClass = (el, className) => el.classList.toggle(className);
    toggleClass(but, 'border');

    // dropList.push(but.id);
    //  dropitem = but.name;
    dropitemcount = but.id;
    if (!dropItems.includes(but.id)) {
        dropItems.push(but.id);
    }
};

const drop = () => {


    socket.emit('drop', dropItems);
    for (let i = 0; i < dropItems.length; i++) {
        document.getElementById(dropItems[i]).classList.toggle('border');
    }

    dropItems = [];
}


const chestdrop = () => {
    socket.emit('chestdrop', dropItems);
    for (let i = 0; i < dropItems.length; i++) {
        document.getElementById(dropItems[i]).classList.toggle('border');
    }

    dropItems = [];
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

socket.on('chat', (username, message) => {
    console.log(username, message);
    document.getElementById('chatbox').innerHTML += `<div>[${username}] ${message}</div> <br>`;
})

socket.on('cords', (data) => {
    document.getElementById('X').textContent = Math.round(data.x);
    document.getElementById('Y').textContent = Math.round(data.y);
    document.getElementById('Z').textContent = Math.round(data.z);
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




const sendmessage = () => {
    var input = document.getElementById('chatInput').value;
    socket.emit('sendmessage', input);
    document.getElementById('chatInput').value = null;
    console.log(input);
}