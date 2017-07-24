package transfertypebenchmark;

import org.glassfish.jersey.server.ChunkedOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import java.io.IOException;

@Component
@Path("/chunked")
public class ChunkedEndpoint {
  private static final Logger logger = LoggerFactory.getLogger(SimpleEndpoint.class);

  @Autowired
  ResourceService resourceService;

  @GET
  @Produces("text/plain")
  public ChunkedOutput<String> chunkedRequest(@DefaultValue("1024") @QueryParam("chunk-size") int chunkSize,
                                              @DefaultValue("0") @QueryParam("max-delay") int maxDelay) {
    ChunkedOutput<String> chunkedOutput = new ChunkedOutput<>(String.class);
    DelayGenerator delayGenerator = new DelayGenerator(maxDelay);

    new Thread(() -> {
      String response = resourceService.data;
      try {
        int responseLength = response.length();
        for (int i = 0; i < responseLength; i += chunkSize) {
          if (maxDelay != 0) Thread.sleep(delayGenerator.next());
          int length = i + chunkSize > responseLength ? responseLength - i : chunkSize;
          chunkedOutput.write(response.substring(i, i + length));
        }
      } catch (IOException e){
        e.printStackTrace();
      } catch (InterruptedException e) {
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
