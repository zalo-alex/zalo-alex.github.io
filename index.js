const maskClass = {
    "A": [1, 0, 0, 0],
    "B": [1, 1, 0, 0],
    "C": [1, 1, 1, 0],
    "D": [0, 0, 0, 0],
    "E": [0, 0, 0, 0],
}
const typeBase = {
    "dec": 10,
    "bin": 2,
    "hex": 16
}
const padLen = {
    "dec": 0,
    "bin": 8,
    "hex": 2
}

var boxInner = null
var boxType = null

function getClass(ip) {
    if(ip[0] >= 0 && ip[0] <= 127) {
        return "A"
    } else if (ip[0] >= 128 && ip[0] <= 191) {
        return "B"
    } else if (ip[0] >= 192 && ip[0] <= 223) {
        return "C"
    } else if (ip[0] >= 224 && ip[0] <= 239) {
        return "D"
    } else if (ip[0] >= 240 && ip[0] <= 255) {
        return "E"
    }
}

function display(type, _class, ip, box, multi = false) {
    if(maskClass[_class][0] != 0) {
        var mask = maskClass[_class].map(oct => oct == 1 ? 255 : 0);
        var net_ip = maskClass[_class].map((oct, i) => oct == 1 ? ip[i] : 0)
        var brd_ip = maskClass[_class].map((oct, i) => oct == 1 ? ip[i] : 255)
        var first_ip = net_ip.map((oct, i) => i == 3 ? 1 : oct)
        var last_ip = brd_ip.map((oct, i) => i == 3 ? 254 : oct)

        ip = ip.map(oct => oct.toString(typeBase[type]).padStart(padLen[type], '0'))
        mask = mask.map(oct => oct.toString(typeBase[type]).padStart(padLen[type], '0'))
        net_ip = net_ip.map(oct => oct.toString(typeBase[type]).padStart(padLen[type], '0'))
        brd_ip = brd_ip.map(oct => oct.toString(typeBase[type]).padStart(padLen[type], '0'))
        first_ip = first_ip.map(oct => oct.toString(typeBase[type]).padStart(padLen[type], '0'))
        last_ip = last_ip.map(oct => oct.toString(typeBase[type]).padStart(padLen[type], '0'))

        box.innerHTML += `<span class="result">
            <span class="result-key">Class:</span> ${_class}<br>
            <span class="result-key">IP Address:</span> ${ip.join(".")}<br>
            <span class="result-key">Net Mask:</span> ${mask.join(".")}<br>
            <span class="result-key">Network IP:</span> ${net_ip.join(".")}<br>
            <span class="result-key">Broadcast IP:</span> ${brd_ip.join(".")}<br>
            <span class="result-key">First IP:</span> ${first_ip.join(".")}<br>
            <span class="result-key">Last IP:</span> ${last_ip.join(".")}<br>
        </span>`
        if (multi && type == "hex") {
            box.innerHTML += '<button class="button" onclick="back()">Back</button>'
        } else if(!multi) {
            box.innerHTML += '<button class="button" onclick="back()">Back</button>'
        }
        return true
    } else {
        box.innerHTML += `<span class="result">
            <span class="result-key">Class:</span> ${_class}<br>
            <span class="result-key">IP Address:</span> ${ip.join(".")}<br>
            <span class="result-key">Net Mask:</span> Undefined<br>
        </span>
        <button class="button" onclick="back()">Back</button>`
        return false
    }
}

function convert(type) {
    if (type == "all") {
        document.querySelector(".line-content").classList.add("hide")
    }
    boxType = type
    var box = document.getElementById(`${type}-convert`)
    boxInner = box.innerHTML
    Array.prototype.slice.call(document.getElementsByClassName("box")).map(_box => _box != box ? _box.classList.add("notselected") : null)
    box.classList.add("selected")
    var ip = document.getElementById(`${type}-ip`).value.split(".").map(oct => parseInt(oct))
    var _class = getClass(ip)
    box.innerHTML = ""
    if (type == "all") {
        Object.keys(typeBase).every(type => {    
            return display(type, _class, ip, box, true)
        });
    } else {
    display(type, _class, ip, box)
    }
}

function back() {
    if (boxType == "all") {
        document.querySelector(".line-content").classList.remove("hide")
    }
    Array.prototype.slice.call(document.getElementsByClassName("notselected")).map(box => box.classList.remove("notselected"))
    var box = document.getElementById(`${boxType}-convert`)
    box.classList.remove("selected")
    box.innerHTML = boxInner
}

var theme = false

function themeChange(){
	if(theme) {
        document.body.classList.remove("dark")
        document.body.classList.add("light")
	} else {
        document.body.classList.add("dark")
        document.body.classList.remove("light")
	}
	theme = !theme
}