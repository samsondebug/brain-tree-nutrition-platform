const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create menu template
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Assessment',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('new-assessment');
        }
      },
      {
        label: 'Export Data',
        accelerator: 'CmdOrCtrl+E',
        click: () => {
          mainWindow.webContents.send('export-data');
        }
      },
      { type: 'separator' },
      {
        label: 'Exit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About Brain Tree Nutrition',
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'About Brain Tree Nutrition',
            message: 'Brain Tree Nutrition Desktop Application',
            detail: 'Version 1.0.0\nCognitive Enhancement Platform\n\nOptimizing brain health through science-backed nutrition.'
          });
        }
      }
    ]
  }
];

// Create menu
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// App event listeners
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for data persistence
ipcMain.handle('save-data', async (event, data) => {
  try {
    const dataPath = path.join(app.getPath('userData'), 'brain-tree-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-data', async () => {
  try {
    const dataPath = path.join(app.getPath('userData'), 'brain-tree-data.json');
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return { success: true, data: JSON.parse(data) };
    }
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('export-csv', async (event, data) => {
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Export Data',
      defaultPath: 'brain-tree-data.csv',
      filters: [
        { name: 'CSV Files', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (filePath) {
      // Convert data to CSV format
      const csvContent = convertToCSV(data);
      fs.writeFileSync(filePath, csvContent);
      return { success: true, filePath };
    }
    return { success: false, error: 'No file selected' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

function convertToCSV(data) {
  // Simple CSV conversion - can be enhanced based on data structure
  let csv = 'Name,Email,Type,Cognitive Goal,Progress Score,Total Spent\n';
  if (data.customers) {
    data.customers.forEach(customer => {
      csv += `${customer.name},${customer.email},${customer.type},${customer.cognitiveGoal},${customer.progressScore},${customer.totalSpent}\n`;
    });
  }
  return csv;
} 