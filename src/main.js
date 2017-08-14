const electron = require('electron')
const {dialog} = require('electron')
//var remote = require('remote');
//var dialog = remote.require('dialog');
const fs= require('fs')

const path = require('path')
//require('electron-debug')({showDevTools: true});

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const ipc = electron.ipcMain

const EditorStates = {'NewFile':0, 'Editing':1, 'Save':2}

const windows = []

let mainWindow
var currentFilePath ='NewFile'
var dirtyFlag= false
var strContent= ""


let template = [
  {
    label: 'File',
    submenu: [
    {
      label: 'Open',
            click: function () 
              {  
                  loadFile()
              }
    },
    {
      label: 'New',
      accelerator: 'CmdOrCtrl+N',
      click: function () 
      {  
        if(dirtyFlag)
        {
            // ask the user if first wants to save the current file
            let index= dialog.showMessageBox({type:'question', buttons:['Yes', 'No'], title:'Unsaved changes..', message:'Do want to save changes?'})    
            if (index==0) {
              saveCurrentChanges()
            }
          }
          newDocument()
        }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: function () 
                {  
                    saveCurrentChanges();
                }
      }, 
      {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: function () {
          saveCurrentChangesAs();
        }
      },
    {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Cmd+Q',
      click: function () { 
        if(dirtyFlag)
        {
          // ask the user if first wants to save the current file
          let index= dialog.showMessageBox({type:'question', buttons:['Yes', 'No'], title:'Unsaved changes..', message:'Do want to save changes?'})    
          if (index==0) {
            saveCurrentChanges();
        }
  }
        app.quit() 
      }
    }]
  },
  {
    label: 'About',
    submenu: [{
      label: 'Urdu Editor',
      click: function () { 
        var buttons = ['OK'];
        dialog.showMessageBox({ type: 'info', buttons: buttons, message: 'Urdu Editor' }) 
      }
    }]
  }
]


app.on('ready', _ => {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 800,
  })

  mainWindow.def
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow.loadURL(`file://${__dirname}/editor.html`)
  

  mainWindow.webContents.on('did-finish-load', () => {
   mainWindow.setTitle('NewFile');
  })
  mainWindow.on('closed', _ => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  if(dirtyFlag)
  {
    // ask the user if first wants to save the current file
    let index= dialog.showMessageBox({type:'question', buttons:['Yes', 'No'], title:'Unsaved changes..', message:'Do want to save changes?'})    
    if (index==0) {
      saveCurrentChanges();
    }
  }
  app.quit()
})



ipc.on('gettext', (evt, str) => {

  if(!(currentFilePath == 'NewFile') )
  {
    fs.writeFile(currentFilePath, strContent, 'utf8', (err) => {
          if(err){
              console.log("An error ocurred creating the file "+ err.message)
          }
                      
          console.log("The file has been succesfully saved");
      });
  }
  else
  {
    let filename
    dialog.showSaveDialog((fileName) => {
        if (fileName === undefined){
            console.log("You didn't save the file");
            return;
        }

        // fileName is a string that contains the path and filename created in the save file dialog.  
        fs.writeFile(fileName, strContent, (err) => {
            if(err){
                console.log("An error ocurred creating the file "+ err.message)
            }                        
            console.log("The file has been succesfully saved");
        });
    });
  }
})

ipc.on('setDirty', (evt, str) => {
  dirtyFlag = true
  strContent=str
})

newDocument  = function()
{
  strContent = ""
  currentFilePath = 'NewFile'
  mainWindow.setTitle(currentFilePath)
  mainWindow.webContents.send('load', strContent)
}


saveCurrentChangesAs = function()
{
  let filename
  dialog.showSaveDialog((fileName) => {
      if (fileName === undefined){
          console.log("You didn't save the file");
          return;
      }

      // fileName is a string that contains the path and filename created in the save file dialog.  
      fs.writeFile(fileName, strContent, (err) => {
          if(err){
              console.log("An error ocurred creating the file "+ err.message)
          }                        
          console.log("The file has been succesfully saved");
      });
  });
}


saveCurrentChanges = function()
{
  // check if current file has been modified
  //if(dirtyFlag)
  //{
    // ask the user if first wants to save the current file
    //let index= dialog.showMessageBox({type:'question', buttons:['Yes', 'No'], title:'Unsaved changes..', message:'Do want to save changes?'})
    //if (index==0) {
      if(!(currentFilePath == 'NewFile') )
        {
            fs.writeFile(currentFilePath, strContent, 'utf8', (err) => {
                if(err){
                    console.log("An error ocurred creating the file "+ err.message)
                }
                            
                console.log("The file has been succesfully saved");
            });
        }
        else
        {
          let filename
            dialog.showSaveDialog((fileName) => {
                if (fileName === undefined){
                    console.log("You didn't save the file");
                    return;
                }

                // fileName is a string that contains the path and filename created in the save file dialog.  
                fs.writeFile(fileName, strContent, (err) => {
                    if(err){
                        console.log("An error ocurred creating the file "+ err.message)
                    }
                    else
                    {
                      let strFileName= path.basename(fileName)
                      mainWindow.setTitle(strFileName);
                      console.log("The file has been succesfully saved");
                    }                                                  
                });
            });
        }
    //}
  //}
}

loadFile = function()
{
  if(dirtyFlag)
  {
    // ask the user if first wants to save the current file
    let index= dialog.showMessageBox({type:'question', buttons:['Yes', 'No'], title:'Unsaved changes..', message:'Do want to save changes?'})    
    if (index==0) {
      saveCurrentChanges();
    }
  }
  var fileNames
  // read file from disk
  // send the contents to the renderer
  dialog.showOpenDialog((fileNames) => {
      // fileNames is an array that contains all the selected
      if(fileNames === undefined){
          console.log("No file selected");
          return;
      }
      currentFilePath= fileNames[0]

      fs.readFile(currentFilePath, 'utf-8', (err, data) => {
          if(err){
              console.log("An error ocurred reading the file :" + err.message);
              return;
          }

          // Change how to handle the file content
          //console.log("The file content is : " + data);
          mainWindow.webContents.send('load', data)
          //mainWindow.webContents.set
      });
      let strFileName= path.basename(currentFilePath)
      mainWindow.setTitle(strFileName);
  });
 
}