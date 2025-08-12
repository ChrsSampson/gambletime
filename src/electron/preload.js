const { contextBridge } = require('electron');

// Expose safe APIs
contextBridge.exposeInMainWorld('electron', {
  // Add your APIs here
});
