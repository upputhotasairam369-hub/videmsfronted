export class InventoryService {
  constructor(productId, onUpdate) {
    this.productId = productId;
    this.onUpdate = onUpdate;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    const wsUrl = `${process.env.REACT_APP_WS_URL}/ws/inventory/${this.productId}/`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.ws.send(JSON.stringify({ action: 'get_stock' }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'stock_update') {
        this.onUpdate(data);
      }
    };

    this.ws.onclose = () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, 3000 * this.reconnectAttempts);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
