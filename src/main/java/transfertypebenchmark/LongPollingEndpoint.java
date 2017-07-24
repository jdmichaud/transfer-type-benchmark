package transfertypebenchmark;

import org.glassfish.jersey.server.ChunkedOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Component
@Path("/lp")
public class LongPollingEndpoint {
    private static final Logger logger = LoggerFactory.getLogger(SimpleEndpoint.class);
    private static final int BUFFER_SIZE = 1024;
    private static int index = 0;

    @Autowired
    ResourceService resourceService;

    @GET
    @Produces("text/plain")
    public String longPollingRequest() {
      int segmentLength = index + BUFFER_SIZE > resourceService.data.length() ? resourceService.data.length() - index : BUFFER_SIZE;
      index += BUFFER_SIZE;
      logger.info("send from {} to {} of {}", index - BUFFER_SIZE, index - BUFFER_SIZE + segmentLength, resourceService.data.length());
      return resourceService.data.substring(index - BUFFER_SIZE, index - BUFFER_SIZE + segmentLength);
    }
}
