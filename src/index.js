var nPoints = 3, m = 5, n = 5, gap, radius, state = [], path = [], 
first_i = 0, first_j = 0, last_i = 3, last_j = 0

function setup_() {
    first = {i: first_i, j: first_j}, last = {i: last_i, j: last_j}
    restart()
}

function update() {
    radius = min(width, height) / 3 / max(n, m)
    gap = radius / 2
    if(first_i > m-1) first_i = m-1
    if(first_j > n-1) first_j = n-1
    if(last_i > m-1) last_i = m-1
    if(last_j > n-1) last_j = n-1
    if(first_i < 0) first_i = 0
    if(first_j < 0) first_j = 0
    first = {i: first_i, j: first_j}, last = {i: last_i, j: last_j}
    document.getElementById('isPossible').innerHTML = (
        n * m % 2 == 0 && (first_i + first_j) % 2 != (last_i + last_j) % 2 || 
        n * m % 2 == 1 && (first_i + first_j) % 2 == (last_i + last_j) % 2
    )
}

function restart() {
    state = Array(m).fill().map(() => Array(n).fill())
    path = [{i: first_i, j: first_j}]
}

function draw_() {
    update()
    background('#fffdc7')
    //circle(0, 0, radius * 2)
    for(let i = 0; i < m; i++) {
        for(let j = 0; j < n; j++) {
            let x = (width - (2*radius + gap) * m + gap)/2 + radius + (2*radius + gap) * i
            let y = (height - (2*radius + gap) * n + gap)/2 + radius + (2*radius + gap) * j
            strokeWeight(5)
            stroke('#000000')
            if(path.find((c, idx) => c.j == j && c.i == i && path[idx+1]?.i == i+1 && path[idx+1]?.j  == j))
                line(x + radius, y, x + radius + gap, y)
            if(path.find((c, idx) => c.j == j && c.i == i && path[idx+1]?.j == j+1 && path[idx+1]?.i  == i))
                line(x, y + radius, x, y +  radius + gap)
            if(path.find((c, idx) => c.j == j && c.i == i && path[idx-1]?.i == i+1 && path[idx-1]?.j  == j))
                line(x + radius, y, x + radius + gap, y)
            if(path.find((c, idx) => c.j == j && c.i == i && path[idx-1]?.j == j+1 && path[idx-1]?.i  == i))
                line(x, y + radius, x, y +  radius + gap)
            if(mouseIsPressed && dist(x, y, mouseX, mouseY) < radius && !(i == first.i && j == first.j) && isPossible(i, j) && !(i == last.i && j == last.j && path.length != m*n - 1)) {
                state[i][j] = 1
                if(!path.find(c => c.i == i && c.j == j))
                    path.push({i, j})
            }
            fill("#FFFFFF")
            stroke('#000000')
            if(i == first.i && j == first.j)
                fill('#000000')
            else if(i == last.i && j == last.j && path.length != n*m-1)
                fill('#000000')
            else if(dist(x, y, mouseX, mouseY) < radius) {
                if(isPossible(i, j))
                    fill('#e6f7ff')
                else
                    fill('#ffe8e8')
            }
            if(state[i][j])
                fill('#616161')
            strokeWeight(1)
            circle(x, y, radius * 2)
            if(i == first.i && j == first.j) {
                fill("#FFFFFF")
                circle(x, y, radius * 2 / 18)
            }
        }
    }
}

function isPossible(i, j) {
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