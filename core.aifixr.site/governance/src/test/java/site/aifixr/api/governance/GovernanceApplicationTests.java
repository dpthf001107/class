package site.aifixr.api.governance;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"spring.cloud.compatibility-verifier.enabled=false",
		"eureka.client.register-with-eureka=false",
		"eureka.client.fetch-registry=false"
})
class GovernanceApplicationTests {

	@Test
	void contextLoads() {
	}

}

