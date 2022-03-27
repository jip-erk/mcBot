const socket = io('http://localhost:3001')
socket.on('connection')

let dropList = [];

var Inv;

function toggle(button) {
    if (document.getElementById("1").value == "OFF") {
        document.getElementById("1").value = "ON";
    } else if (document.getElementById("1").value == "ON") {
        document.getElementById("1").value = "OFF";
    }
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
    dropitem = but.name;
    dropitemcount = but.id;
};

const drop = () => {
    socket.emit('drop', dropitem, dropitemcount);
    console.log(dropitem);
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

const Follow = () => {
    socket.emit('follow', 'follow')
}

const Stop = () => {
    socket.emit('stop', 'stop')
}