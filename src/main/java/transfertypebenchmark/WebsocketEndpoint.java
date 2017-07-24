package transfertypebenchmark;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

public class WebsocketEndpoint extends TextWebSocketHandler {
  private static final Logger log = LoggerFactory.getLogger(WebsocketEndpoint.class);

  @Autowired
  ResourceService resourceService;

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
  }

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) {
    String[] smessages = new String(message.asBytes()).split(";");
    int chunkSize = new Integer(smessages[0].split(":")[1]);
    int maxDelay = new Integer(smessages[1].split(":")[1]);
    DelayGenerator delayGenerator = new DelayGenerator(maxDelay);
    int responseLength = resourceService.data.length();
    try {
      for (int i = 0; i < responseLength; i += chunkSize) {
        int length = i + chunkSize > responseLength ? responseLength - i : chunkSize;
        session.sendMessage(new TextMessage(resourceService.data.substring(i, i + length)));
      }
      session.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
}

