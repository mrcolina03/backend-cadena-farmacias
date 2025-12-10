package ec.espe.msinventario.repositories;

import ec.espe.msinventario.models.entities.InventarioSucursal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventarioSucursalRepository extends JpaRepository<InventarioSucursal, Long> {
    List<InventarioSucursal> findBySucursalId(Long sucursalId);
}
