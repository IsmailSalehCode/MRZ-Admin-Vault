// electron/preload.js

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener("DOMContentLoaded", () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector);
//     if (element) element.innerText = text;
//   };

//   for (const dependency of ["chrome", "node", "electron"]) {
//     replaceText(`${dependency}-version`, process.versions[dependency]);
//   }
// });

/**Electron's architecture consists of two main processes:

Main Process: This process manages the application's lifecycle and creates the application's browser windows. It runs the Node.js environment and is responsible for tasks such as managing menus, handling file system operations, and coordinating communication between various windows and processes.

Renderer Process: Each Electron window runs in its own renderer process. These processes are essentially Chromium instances that display web content and execute the application's front-end code (HTML, CSS, JavaScript). Renderer processes are sandboxed for security reasons, meaning they have limited access to the underlying operating system.
  ========  ========  ========  ========  ========  ========
contextBridge: The contextBridge is a security feature introduced in Electron to allow controlled communication between the main process and the renderer process. It helps prevent arbitrary JavaScript code running in a renderer process from accessing sensitive Node.js modules directly, as this could pose security risks. Instead, it defines a bridge that exposes specific Node.js functionality to the renderer process in a controlled manner.
The purpose of the contextBridge is to provide a secure way to communicate between the main process (Node.js) and the renderer process (web content). By using the contextBridge, you can define a set of safe, predefined functions and objects that can be accessed by the renderer process without compromising security. The naming "contextBridge" reflects its role in bridging the context between the main process and renderer process, allowing safe communication while maintaining security.

ipcRenderer: The ipcRenderer module is part of Electron's inter-process communication (IPC) system. IPC allows communication between the main process and renderer processes. The ipcRenderer module is specifically designed for use in the renderer process.

The purpose of ipcRenderer is to send and receive asynchronous messages between the renderer process and the main process. This enables you to implement features like event handling, data exchange, and function invocation across these two different process contexts. The naming "ipcRenderer" stands for "Inter-Process Communication Renderer" and signifies its role in facilitating communication from the renderer process.
 */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  showSaveDialog: async (options) => {
    const result = await ipcRenderer.invoke("show-save-dialog", options);
    return result;
  },

  writeToFile: (filePath, content) => {
    const fs = require("fs");
    fs.writeFileSync(filePath, content, "utf-8");
  },
});
