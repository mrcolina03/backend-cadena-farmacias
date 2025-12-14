package ec.espe.msinventariov2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MsInventariov2Application {

    public static void main(String[] args) {
        SpringApplication.run(MsInventariov2Application.class, args);
    }

}
