const electron = require('electron')

const ipc = electron.ipcRenderer

/*ipc.on('save', _ => {
  var strText=document.getElementById('contenteditor').value 
  console.log(strText)
  ipc.send('gettext', strText)
})*/


ipc.on('update', _ => {
  var strText=document.getElementById('contenteditor').value 
  console.log(strText)
  ipc.send('updateText', strText)
})


ipc.on('load', (evt, data) => {
  document.getElementById('contenteditor').value = data
})

ipc.on('settitle', (evt, strTitle) => {
  this.title = strTitle
})

/*document.getElementById('contenteditor').addEventListener('keypress', _ => {
    var strText=document.getElementById('contenteditor').value 
    ipc.send('setDirty', strText)
})*/

/*document.getElementById('contenteditor').addEventListener('change', _ => {
    var strText=document.getElementById('contenteditor').value 
    ipc.send('setDirty', strText)
})*/


/*$(document).bind('keydown', function(e) {
    if(e.ctrlKey && (e.which == 83)) {
      ipc.send('handleCommand', "Save")
    }    
});*/

/*document.getElementById('contenteditor').addEventListener('keydown', (e) => {
    
    if(e.ctrlKey && (e.which == 83)) {
      if(e.shiftKey)
      {
        ipc.send('handleCommand', "SaveAs")
      }
      else
        ipc.send('handleCommand', "Save")
    }
})*/