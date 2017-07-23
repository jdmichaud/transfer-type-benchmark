package chunkedtest;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

@SpringBootApplication
public class App extends SpringBootServletInitializer {
  public static void main(String[] args) {
    // SpringApplication.run(App.class, args);
    new App()
        .configure(new SpringApplicationBuilder(App.class))
        .run(args);
  }
}