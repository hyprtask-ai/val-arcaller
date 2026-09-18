export const HEADLESS_CHAT_EXAMPLE = `let chatState = 'idle';

function withEmbedWidget(callback) {
  const widget = window.ValWidget || window.DograhWidget;
  if (widget) {
    callback(widget);
    return;
  }

  const script =
    document.getElementById('val-widget') ||
    document.getElementById('dograh-widget');
  if (!script) {
    console.error('Embed widget script not found');
    return;
  }

  script.addEventListener('load', () => {
    const loaded = window.ValWidget || window.DograhWidget;
    if (loaded) callback(loaded);
  }, { once: true });
}

withEmbedWidget((widget) => {
  widget.onChatStateChange((state) => {
    chatState = state; // idle | starting | ready | waiting | ended | expired | error
  });

  widget.onMessage((text, turn) => {
    appendAgentBubble(text); // render however you want
  });

  document.getElementById('open-chat').addEventListener('click', () => {
    widget.startChat();
  });

  document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    appendVisitorBubble(input.value);
    const transcript = await widget.sendMessage(input.value);
    if (transcript !== null) input.value = '';
  });

  document.getElementById('end-chat')?.addEventListener('click', async () => {
    await widget.endChat();
  });
});`;
