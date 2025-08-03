import express from "express";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { IWebSocket, WebSocketMessageReader, WebSocketMessageWriter } from "vscode-ws-jsonrpc";
import { createConnection, createServerProcess, forward } from "vscode-ws-jsonrpc/server";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "../../client/dist");

const app = express();

app.use(express.static(staticPath));

app.get("/hello", (_, res) => {
    res.send("Hello Vite + React + TypeScript!");
});



const ws = new WebSocketServer({
    noServer: true,
    perMessageDeflate: false,
});

const server = app.listen(3000, () => console.log("Server is listening on port 3000..."));

server.on("upgrade", (request, socket, head) => {
    console.log("Upgrade request:", request.url)
    if (request.url === "/ws") {
        ws.handleUpgrade(request, socket, head, (webSocket) => {
            const socket: IWebSocket = {
                send: (content) =>
                    webSocket.send(content, (error) => {
                        if (error) {
                            throw error;
                        }
                    }),
                onMessage: (cb) =>
                    webSocket.on("message", (data) => {
                        cb(data);
                    }),
                onError: (cb) => webSocket.on("error", cb),
                onClose: (cb) => webSocket.on("close", cb),
                dispose: () => webSocket.close(),
            };
            if (webSocket.readyState === webSocket.OPEN) {
                launchLanguageServer(socket);
            } else {
                webSocket.on("open", () => {
                    launchLanguageServer(socket);
                });
            }
        });
    }
});



app.get(/(.*)/, (_, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
});



const launchLanguageServer = (socket: IWebSocket) => {
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const socketConnection = createConnection(reader, writer, () => socket.dispose());
    const serverConnection = createServerProcess("Dockerfile", "node", [
        "../node_modules/dockerfile-language-server-nodejs/lib/server.js",
        "--stdio",
    ]);
    if (serverConnection) {
        forward(socketConnection, serverConnection, (message) => {
            console.log(message);
            return message;
        });
    }
};

// let messageId = 1;
// let reader: SocketMessageReader|null = null;
// let writer: SocketMessageWriter|null = null;
//
// function send(method: string, params: object) {
//     const message = {
//         jsonrpc: "2.0",
//         id: messageId++,
//         method: method,
//         params: params
//     };
//     writer?.write(message);
// }

// function initialize() {
//     send("initialize", {
//         rootPath: process.cwd(),
//         processId: process.pid,
//         capabilities: {
//             textDocument: {
//                 /* ... */
//             },
//             workspace: {
//                 /* ... */
//             }
//         }
//     });
// }

// const server = net.createServer((socket: net.Socket) => {
//     server.close();
//     reader = new SocketMessageReader(socket);
//     reader.listen((data) => {
//         console.log(data);
//     });
//     writer = new SocketMessageWriter(socket);
//     initialize();
// });
//
// server.listen(3001, () => {
//     child_process.spawn("node", [ "../node_modules/dockerfile-language-server-nodejs/lib/server.js", "--socket=3001" ]);
// });