const electron = require('electron')

const ipc = electron.ipcRenderer

ipc.on('save', _ => {
  var strText=document.getElementById('contenteditor').value 
  console.log(strText)
  ipc.send('gettext', strText)
})

ipc.on('load', (evt, data) => {
  document.getElementById('contenteditor').value = data
})

ipc.on('settitle', (evt, strTitle) => {
  this.title = strTitle
})

document.getElementById('contenteditor').addEventListener('keypress', _ => {
    var strText=document.getElementById('contenteditor').value 
    ipc.send('setDirty')
})

document.getElementById('contenteditor').addEventListener('change', _ => {
    var strText=document.getElementById('contenteditor').value 
    ipc.send('setDirty')
})