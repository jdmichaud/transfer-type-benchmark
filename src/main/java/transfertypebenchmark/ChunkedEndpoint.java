package transfertypebenchmark;

import org.glassfish.jersey.server.ChunkedOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.io.IOException;

@Component
@Path("/chunked")
public class ChunkedEndpoint {
  private static final Logger logger = LoggerFactory.getLogger(SimpleEndpoint.class);
  private static final int BUFFER_SIZE = 1024;

  @Autowired
  ResourceService resourceService;

  @GET
  @Produces("text/plain")
  public ChunkedOutput<String> chunkedRequest() {
    ChunkedOutput<String> chunkedOutput = new ChunkedOutput<>(String.class);

    new Thread(() -> {
      String response = resourceService.data;
      try {
        int responseLength = response.length();
        for (int i = 0; i < responseLength; i += BUFFER_SIZE) {
          int length = i + BUFFER_SIZE > responseLength ? responseLength - i : BUFFER_SIZE;
          chunkedOutput.write(response.substring(i, i + length));
        }
      } catch (IOException e){
        e.printStackTrace();
      } finally {
        try {
          chunkedOutput.close();
          logger.info("ChunkedOutput closed");
        } catch (IOException e){
          e.printStackTrace();
        }
      }
    }).start();

    return chunkedOutput;
  }
}
