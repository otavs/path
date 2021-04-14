var m = 5, n = 5, gap, radius, state = [], path = [], showVertexColors = false
first = {i: 0, j: 0}, last = {i: 0, j: 3},
bgColor = '#fffdc7'

function setup_() {
    restart()
}

function restart() {
    state = Array(m).fill().map(() => Array(n).fill())
    path = []
}

function update() {
    radius = min(width, height) / 3 / max(n, m)
    gap = radius / 2
    if(first.i > m-1) first.i = m-1
    if(first.j > n-1) first.j = n-1
    if(last.i > m-1) last.i = m-1
    if(last.j > n-1) last.j = n-1
    if(first.i < 0) first.i = 0
    if(first.j < 0) first.j = 0
    for(let i = 0; i < m; i++) {
        for(let j = 0; j < n; j++) {
            const {x, y} = coords(i, j)
            const isMouseOver = mouseIsPressed && dist(x, y, mouseX, mouseY) < radius
            if(isMouseOver && canGoTo(i, j) && !(path.length != gridSize()-1 && i == last.i && j == last.j)) {
                state[i][j] = 1
                if(!path.find(c => c.i == i && c.j == j))
                    path.push({i, j})
            }
        }
    }
    document.getElementById('isPossible').innerHTML = isPossible()
}

function draw_() {
    update()
    background(bgColor)
    drawCircles()
    drawLines()
}

function drawCircles() {
    for(let i = 0; i < m; i++) {
        for(let j = 0; j < n; j++) {
            drawCircle(i, j)
        }
    }
}

function drawCircle(i, j) {
    push()
    const {x, y} = coords(i, j)
    const isMouseOver = dist(x, y, mouseX, mouseY) < radius
    let circleColor = !showVertexColors ? '#FFFFFF' : vertexColor({i, j}) ? '#ffc7c7' : '#c7eaff'
    if(!state[i][j] && isMouseOver && !showVertexColors)
        circleColor = canGoTo(i, j) ? '#e6f7ff' : '#ffe8e8'
    if(i == first.i && j == first.j && !isMouseOver || i == last.i && j == last.j && path.length != gridSize()-1)
        circleColor = '#000000'
    if(state[i][j])
        circleColor = '#616161'
    fill(circleColor)
    circle(x, y, radius * 2)
    if(i == first.i && j == first.j && !state[i][j]) {
        fill('#FFFFFF')
        circle(x, y, radius * 2 / 20)
    }
    pop()
}

function drawLines() {
    push()
    strokeWeight(5)
    path.forEach(({i, j}, idx) => {
        const next = path[idx+1]
        if(!next) 
            return
        const {x, y} = coords(i, j)
        if(next.j == j+1 && next.i  == i)
            line(x + radius, y, x + radius + gap, y)
        if(next.i == i+1 && next.j  == j)
            line(x, y + radius, x, y +  radius + gap)
        if(next.j == j-1 && next.i  == i)
            line(x - radius, y, x - radius - gap, y)
        if(next.i == i-1 && next.j  == j)
            line(x, y - radius, x, y - radius - gap)
    })
    pop()
}

function gridSize() {
    return n * m
}

function vertexColor({i, j}) {
    return (i + j) % 2
}

function isPossible() {
    return isColorCompatible() && !isForbidden()
}

function isColorCompatible() {
    return (
        gridSize() % 2 == 0 && vertexColor(first) != vertexColor(last) || 
        gridSize() % 2 == 1 && vertexColor(first) == 0 && vertexColor(last) == 0
    )
}

function isForbidden() {
    const firstR = reflectOverY(first)
    const lastR = reflectOverY(last)
    return (
        m == 1 && !(first.j == 0 && last.j == n-1 || first.j == n-1 && last.j == 0) ||
        n == 1 && !(first.i == 0 && last.i == m-1 || first.i == m-1 && last.i == 0) ||

        m == 2 && first.j == last.j && first.j != 0 && first.j != n-1 ||
        n == 2 && first.i == last.i && first.i != 0 && first.i != m-1 ||

        m == 3 && n % 2 == 0 && vertexColor(first ) == 1 && vertexColor(last ) == 0 && (first.j  < last.j  - 1 || first.i  == 1 && first.j  < last.j ) ||
        m == 3 && n % 2 == 0 && vertexColor(firstR) == 1 && vertexColor(lastR) == 0 && (firstR.j < lastR.j - 1 || firstR.i == 1 && firstR.j < lastR.j) ||
        n == 3 && m % 2 == 0 && vertexColor(first ) == 1 && vertexColor(last ) == 0 && (first.i  < last.i  - 1 || first.j  == 1 && first.i  < last.i ) ||
        n == 3 && m % 2 == 0 && vertexColor(firstR) == 1 && vertexColor(lastR) == 0 && (firstR.i < lastR.i - 1 || firstR.j == 1 && firstR.i < lastR.i)
    )
}

function reflectOverY({i, j}) {
    return {
        i: m-1-i,
        j: n-1-j 
    }
}

function coords(i, j) {
    return {
        x: (width - (2*radius + gap) * n + gap)/2 + radius + (2*radius + gap) * j,
        y: (height - (2*radius + gap) * m + gap)/2 + radius + (2*radius + gap) * i
    }
}

function canGoTo(i, j) {
    if(path.length == 0)
        return i == first.i && j == first.j
    const i_ = path[path.length-1].i
    const j_ = path[path.length-1].j
    return (
        i == i_+1 && j == j_ ||
        i == i_-1 && j == j_ ||
        i == i_ && j == j_+1 ||
        i == i_ && j == j_-1
    )
}