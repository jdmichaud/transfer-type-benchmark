package transfertypebenchmark;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
@Path("/simple")
public class SimpleEndpoint {
  private static final Logger logger = LoggerFactory.getLogger(SimpleEndpoint.class);
  @Autowired
  ResourceService resourceService;

  @GET
  @Produces("text/plain")
  public String simpleRequest() {
    String response = resourceService.data;
    logger.info("string size: {}", response.length());
    logger.info("first character: {}", response.charAt(0));
    return response;
  }
}
