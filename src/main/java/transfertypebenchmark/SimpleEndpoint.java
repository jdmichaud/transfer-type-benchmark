package transfertypebenchmark;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Component
@Path("/simple")
public class SimpleEndpoint {

  @Autowired
  ResourceService resourceService;

  @GET
  @Produces("application/json")
  public String simpleRequest() {
    return String.join("\n", resourceService.files);
  }
}
