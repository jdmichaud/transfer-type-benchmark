package transfertypebenchmark;

import org.springframework.stereotype.Service;

import java.util.Random;

public class DelayGenerator {
  private int maxDelay;
  private Random random = new Random(42);

  public DelayGenerator(int maxDelay) {
    this.maxDelay = maxDelay;
  }

  public int next() {
    return random.nextInt(this.maxDelay);
  }
}
