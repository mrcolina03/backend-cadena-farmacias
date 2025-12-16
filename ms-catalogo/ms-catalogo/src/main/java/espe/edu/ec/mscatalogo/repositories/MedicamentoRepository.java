package espe.edu.ec.mscatalogo.repositories;

import espe.edu.ec.mscatalogo.models.entities.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {

    Optional<Medicamento> findByCodigo(String codigo);

    List<Medicamento> findByActivoTrue();

    List<Medicamento> findByNombreContainingIgnoreCase(String nombre);

    List<Medicamento> findByLaboratorioIgnoreCase(String laboratorio);

    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, Long id);

}
