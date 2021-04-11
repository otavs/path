function createGUI() {
    const gui = new dat.GUI()
    let folder = gui

    // add(window, 'restart').name('Restart')
    add(window, 'first_i', 0, 9, 1).name('First x').listen().onChange(restart)
    add(window, 'first_j', 0, 9, 1).name('First y').listen().onChange(restart)
    add(window, 'last_i', 0, 9, 1).name('Last x').listen().onChange(restart)
    add(window, 'last_j', 0, 9, 1).name('Last y').listen().onChange(restart)
    
    setFolder('Params')
    add(window, 'n', 1, 10, 1).name('Width').onChange(restart)
    add(window, 'm', 1, 10, 1).name('Height').onChange(restart)

    setFolder('Stats')
    add(window, 'showStats').name('Show Stats').onChange(() => stats.domElement.style.display = showStats ? 'block' : 'none')

    setFolder('Recording')
    gui.recordingLabel = addPlainText('Status: Inactive')
    gui.onChangeIsRecording = () => {
        if(isRecording) {
            if(gifJs.running) {
                isRecording = false
                return
            }
            gifJs = createGifJs()
            gui.recordingLabel.setText('Status: Recording')
            return
        }
        gifJs.render()
        gui.recordingCheckBox.__li.hidden = true
        gui.abortRenderingController.__li.hidden = false
    }
    gui.recordingCheckBox = add(window, 'isRecording').name('Recording (Alt+S)').onChange(gui.onChangeIsRecording).listen()
    gui.abortRenderingController = add(window, 'abortRendering').name('Abort Rendering')
    gui.abortRenderingController.__li.hidden = true
    add(window, 'downloadScreenshot').name('Take Screenshot')

    // gui.close()
    return gui

    function setFolder(name) {
        folder = (name !== undefined) ? gui.addFolder(name) : gui
        folder.close()
    }

    function add() { // obj, prop, [min], [max], [step]
        return folder.add(...arguments)
    }

    function addColor(obj, prop) {
        return folder.addColor(obj, prop)
    }

    function addPlainText(text) {
        const aux = {aux: ''}
        const controller = add(aux, 'aux')
        controller.domElement.remove()
        const span = controller.__li.getElementsByTagName('span')[0]
        span.innerHTML = text
        span.style.overflow = 'visible'
        span.style.whiteSpace = 'pre'
        controller.setText = text => span.innerHTML = text
        return controller
    }
}