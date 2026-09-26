"use strict";

const NativeWebSocket = global.WebSocket;

if (typeof NativeWebSocket === "function") {
  global.WebSocket = new Proxy(NativeWebSocket, {
    construct(Target, args, NewTarget) {
      const socket = Reflect.construct(Target, args, NewTarget);
      const requests = new Map();
      let lastUrl = "";
      const nativeSend = socket.send.bind(socket);

      socket.send = (payload) => {
        try {
          const message = JSON.parse(String(payload));
          if (message?.id) {
            requests.set(message.id, {
              method: message.method || "unknown",
              expression: typeof message.params?.expression === "string"
                ? message.params.expression.replace(/\s+/g, " ").slice(0, 180)
                : "",
            });
          }
          if (message?.method === "Page.navigate" && message.params?.url) {
            lastUrl = message.params.url;
          }
        } catch (error) {
          // Diagnostics must never alter the QA behavior.
        }
        return nativeSend(payload);
      };

      socket.addEventListener("message", (event) => {
        try {
          const message = JSON.parse(event.data);
          if (!message?.id) return;
          const request = requests.get(message.id);
          requests.delete(message.id);
          if (!message.error || !request) return;

          console.error(
            `[CDP diagnostics] ${request.method} failed on ${lastUrl || "unknown URL"}: ${message.error.message}`
          );
          if (request.expression) {
            console.error(`[CDP diagnostics] expression: ${request.expression}`);
          }
        } catch (error) {
          // Diagnostics must never alter the QA behavior.
        }
      });

      socket.addEventListener("close", () => {
        if (requests.size) {
          console.error(
            `[CDP diagnostics] socket closed on ${lastUrl || "unknown URL"} with ${requests.size} pending request(s).`
          );
        }
      });

      return socket;
    },
  });
}
