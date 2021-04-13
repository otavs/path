var nPoints = 3, m = 5, n = 5, gap, radius, state = [], path = [], showVertexColors = false
first = {i: 0, j: 0}, last = {i: 0, j: 3}

function setup_() {
    restart()
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
    document.getElementById('isPossible').innerHTML = isPossible()
}

function restart() {
    state = Array(m).fill().map(() => Array(n).fill())
    path = [{...first}]
}

function draw_() {
    update()
    background('#fffdc7')
    for(let i = 0; i < m; i++) {
        for(let j = 0; j < n; j++) {
            let x = (width - (2*radius + gap) * n + gap)/2 + radius + (2*radius + gap) * j
            let y = (height - (2*radius + gap) * m + gap)/2 + radius + (2*radius + gap) * i
            strokeWeight(5)
            if(path.find((c, idx) => c.i == i && c.j == j && path[idx+1]?.j == j+1 && path[idx+1]?.i  == i))
                line(x + radius, y, x + radius + gap, y)
            if(path.find((c, idx) => c.i == i && c.j == j && path[idx+1]?.i == i+1 && path[idx+1]?.j  == j))
                line(x, y + radius, x, y +  radius + gap)
            if(path.find((c, idx) => c.i == i && c.j == j && path[idx-1]?.j == j+1 && path[idx-1]?.i  == i))
                line(x + radius, y, x + radius + gap, y)
            if(path.find((c, idx) => c.i == i && c.j == j && path[idx-1]?.i == i+1 && path[idx-1]?.j  == j))
                line(x, y + radius, x, y +  radius + gap)
            if(mouseIsPressed && dist(x, y, mouseX, mouseY) < radius && !(i == first.i && j == first.j) && canGoTo(i, j) && !(i == last.i && j == last.j && path.length != gridSize() - 1)) {
                state[i][j] = 1
                if(!path.find(c => c.i == i && c.j == j))
                    path.push({i, j})
            }
            fill(!showVertexColors ? '#FFFFFF' : vertexColor({i, j}) ? '#ffc7c7' : '#c7eaff')
            if(i == first.i && j == first.j)
                fill('#000000')
            else if(i == last.i && j == last.j && path.length != gridSize()-1)
                fill('#000000')
            else if(dist(x, y, mouseX, mouseY) < radius && !showVertexColors) {
                if(canGoTo(i, j))
                    fill('#e6f7ff')
                else
                    fill('#ffe8e8')
            }
            if(state[i][j])
                fill('#616161')
            strokeWeight(1)
            circle(x, y, radius * 2)
            if(i == first.i && j == first.j) {
                fill('#FFFFFF')
                circle(x, y, radius * 2 / 18)
            }
        }
    }
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

        m == 3 && n % 2 == 0 && vertexColor(first) == 1 && vertexColor(last) == 0 && (first.j < last.j - 1 || first.i == 1 && first.j < last.j) ||
        m == 3 && n % 2 == 0 && vertexColor(firstR) == 1 && vertexColor(lastR) == 0 && (firstR.j < lastR.j - 1 || firstR.i == 1 && firstR.j < lastR.j) ||
        n == 3 && m % 2 == 0 && vertexColor(first) == 1 && vertexColor(last) == 0 && (first.i < last.i - 1 || first.j == 1 && first.i < last.i) ||
        n == 3 && m % 2 == 0 && vertexColor(firstR) == 1 && vertexColor(lastR) == 0 && (firstR.i < lastR.i - 1 || firstR.j == 1 && firstR.i < lastR.i)
    )
}

function reflectOverY({i, j}) {
    return {
        i: m-1-i,
        j: n-1-j 
    }
}

function canGoTo(i, j) {
    if(path.length == 0)
        return false
    const i_ = path[path.length-1].i
    const j_ = path[path.length-1].j
    return (
        i == i_+1 && j == j_ ||
        i == i_-1 && j == j_ ||
        i == i_ && j == j_+1 ||
        i == i_ && j == j_-1
    )
}