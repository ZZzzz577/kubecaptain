import { MonacoEditorReactComp } from "@typefox/monaco-editor-react";
import { type WrapperConfig } from "monaco-editor-wrapper";
import { configureDefaultWorkerFactory } from "monaco-editor-wrapper/workers/workerLoaders";
import { createUrl } from "monaco-languageclient/tools";
import { type IWebSocket, WebSocketMessageReader, WebSocketMessageWriter } from "vscode-ws-jsonrpc";
import { useMemo } from "react";

const text = `{
    "$schema": "http://json.schemastore.org/coffeelint",
    "line_endings": {"value": "unix"}
}`;

const buildJsonClientUserConfig = (): WrapperConfig => {
    const url = createUrl({
        secured: false,
        host: "localhost",
        port: 30000,
        path: "sampleServer",
    });
    const webSocket = new WebSocket(url);
    const iWebSocket: IWebSocket = {
        send(content: string) {
            console.log("send", content);
            webSocket.send(content);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onMessage(cb: (data: any) => void) {
            webSocket.onmessage = (message) => {
                console.log("received", message.data);
                cb(message.data);
            };
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError(cb: (reason: any) => void) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            webSocket.onerror = (event: any) => {
                if (Object.hasOwn(event, "message")) {
                    cb(event.message);
                }
            };
        },
        onClose(cb: (code: number, reason: string) => void) {
            webSocket.onclose = (event) => cb(event.code, event.reason);
        },
        dispose() {
            webSocket.close();
        },
    };
    const reader = new WebSocketMessageReader(iWebSocket);
    const writer = new WebSocketMessageWriter(iWebSocket);

    return {
        id: "json",
        $type: "extended",
        editorAppConfig: {
            codeResources: {
                modified: {
                    text,
                    uri: "/workspace/test.json",
                },
            },
            monacoWorkerFactory: configureDefaultWorkerFactory,
        },
        extensions: [{
            config: {
                name: 'xxxxx-json-example',
                publisher: 'xxxx',
                version: '1.0.0',
                engines: {
                    vscode: '*'
                }
            }
        }],
        languageClientConfigs: {
            configs: {
                json: {
                    clientOptions: {
                        documentSelector: ["json"],
                    },
                    connection: {
                        options: {
                            $type: "WebSocketDirect",
                            webSocket: webSocket,
                        },
                        messageTransports: { reader, writer },
                    },
                },
            },
        },
    };
};



export default function DockerfileEditor() {
    // const [text, setText] = useState("");
    console.log(text)
    const config = useMemo(()=>{
        console.log("config")
        return buildJsonClientUserConfig();
    }, []);
    if (!config) {
        return <div>Loading...</div>;
    }

    return (
        <MonacoEditorReactComp
            wrapperConfig={config}
            style={{
                width: 800,
                height: 800,
                border: "1px solid black",
            }}
        />
    );
}
