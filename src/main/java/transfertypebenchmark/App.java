package transfertypebenchmark;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class App extends SpringBootServletInitializer implements WebSocketConfigurer {
  public static void main(String[] args) {
    // SpringApplication.run(App.class, args);
    new App()
        .configure(new SpringApplicationBuilder(App.class))
        .run(args);
  }

  @Override
  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    registry.addHandler(websocketEndpoint(), "/api/websocket");
  }

  @Bean
  public WebsocketEndpoint websocketEndpoint() {
    return new WebsocketEndpoint();
  }
}