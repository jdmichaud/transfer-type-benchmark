package transfertypebenchmark;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ResourceService {
  public String data;

  public ResourceService() {
    Resource resource = new ClassPathResource("data.txt");
    BufferedReader br = null;
    try {
      br = new BufferedReader(new InputStreamReader(resource.getInputStream()));
    } catch (IOException e) {
      e.printStackTrace();
    }
    data = br.lines().collect(Collectors.joining("\n"));
  };
}
