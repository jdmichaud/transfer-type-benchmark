package transfertypebenchmark;

import org.glassfish.jersey.server.ChunkedOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;

@Component
@Path("/lp")
public class LongPollingEndpoint {
    private static final Logger logger = LoggerFactory.getLogger(SimpleEndpoint.class);
    private static int index = 0;

    @Autowired
    ResourceService resourceService;

    /**
     * @return A piece of the string or an empty string when transfer is done.
     */
    @GET
    @Produces("text/plain")
    public String longPollingRequest(@DefaultValue("1024") @QueryParam("chunk-size") int chunkSize) {
      int segmentLength = index + chunkSize > resourceService.data.length() ? resourceService.data.length() - index : chunkSize;
      index += chunkSize;
      return resourceService.data.substring(index - chunkSize, index - chunkSize + segmentLength);
    }
}
