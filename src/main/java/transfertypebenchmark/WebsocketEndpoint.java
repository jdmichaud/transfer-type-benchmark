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
  private static final int BUFFER_SIZE = 1024;

  @Autowired
  ResourceService resourceService;

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    int responseLength = resourceService.data.length();
    try {
      for (int i = 0; i < responseLength; i += BUFFER_SIZE) {
        int length = i + BUFFER_SIZE > responseLength ? responseLength - i : BUFFER_SIZE;
        session.sendMessage(new TextMessage(resourceService.data.substring(i, i + length)));
      }
      session.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  @Override
  public void handleTextMessage(WebSocketSession session, TextMessage message) {
  }
}

