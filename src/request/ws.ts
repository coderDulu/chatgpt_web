interface WebSocketMessage {
  id: string;
  [key: string]: any;
}

type WebSocketCallback = (data: any) => void;

class WebSocketClient {
  private socket: WebSocket | undefined;
  private callbacks: { [id: string]: WebSocketCallback } = {};

  constructor(private url: string) {}

  public connect(): void {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => console.log('WebSocket connected');
    this.socket.onmessage = (event: MessageEvent) => this.handleMessage(event);
    this.socket.onclose = () => setTimeout(() => this.connect(), 1000);
  }

  public send(data: any, callback?: WebSocketCallback): void {
    const id = Math.random().toString(36).substring(2, 9);
    if (callback) {
      this.callbacks[id] = callback;
    }
    const message: WebSocketMessage = { id, ...data };
    this.socket?.send(JSON.stringify(message));
  }

  private handleMessage(event: MessageEvent): void {
    const message: WebSocketMessage = JSON.parse(event.data);
    const callback = this.callbacks[message.id];
    if (callback) {
      callback(message);
      delete this.callbacks[message.id];
    }
  }
}

export default WebSocketClient;
