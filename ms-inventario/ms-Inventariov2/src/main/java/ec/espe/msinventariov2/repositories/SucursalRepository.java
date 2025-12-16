package ec.espe.msinventariov2.repositories;


import ec.espe.msinventariov2.models.entities.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SucursalRepository extends JpaRepository<Sucursal, Long> {
    List<Sucursal> findByEstado(String estado);
}
