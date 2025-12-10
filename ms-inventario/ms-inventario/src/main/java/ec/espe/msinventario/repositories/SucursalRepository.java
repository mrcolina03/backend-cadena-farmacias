package ec.espe.msinventario.repositories;

import ec.espe.msinventario.models.entities.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SucursalRepository extends JpaRepository<Sucursal, Long> {
}
