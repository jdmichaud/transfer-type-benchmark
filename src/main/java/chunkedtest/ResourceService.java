package chunkedtest;

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
  public List<String> files = new LinkedList<>();

  public ResourceService() {
    try {
      ClassLoader cl = this.getClass().getClassLoader();
      PathMatchingResourcePatternResolver pathMatchingResourcePatternResolver =
        new PathMatchingResourcePatternResolver(cl);
      this.files = Stream.of(pathMatchingResourcePatternResolver.getResources("classpath:file*.json")).map(resource -> {
        BufferedReader br = null;
        try {
          br = new BufferedReader(new InputStreamReader(resource.getInputStream()));
        } catch (IOException e) {
          e.printStackTrace();
        }
        return br.lines().collect(Collectors.joining("\n"));
      }).collect(Collectors.toList());
    } catch (IOException e) {
      e.printStackTrace();
    }
  };
}
