package ec.espe.msinventariov2.clientes;

import ec.espe.msinventariov2.models.dto.MedicamentosDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@FeignClient(name = "ms-catalogo", url = "${client.ms-catalogo.url}")
//@FeignClient(name = "Autor", url = "http://autores:8002/api/autores")
public interface MedicamentosClienteRest {

    @GetMapping("/{id}")
    Optional<MedicamentosDTO> buscarPorId(@PathVariable("id")  Long id);

}
