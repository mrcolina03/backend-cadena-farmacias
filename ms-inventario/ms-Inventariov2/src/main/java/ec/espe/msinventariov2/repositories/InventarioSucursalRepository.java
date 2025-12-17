package ec.espe.msinventariov2.repositories;

import ec.espe.msinventariov2.models.entities.InventarioSucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InventarioSucursalRepository extends JpaRepository<InventarioSucursal, Long> {
    List<InventarioSucursal> findBySucursalId(Long sucursalId);

    List<InventarioSucursal> findByEstado(String estado);

    List<InventarioSucursal> findBySucursalIdAndEstado(Long sucursalId, String estado);

    Optional<InventarioSucursal> findBySucursalIdAndIdMedicamento(Long sucursalId, Long idMedicamento);

    @Modifying
    @Query("UPDATE InventarioSucursal i SET i.estado = :estado WHERE i.sucursal.id = :sucursalId")
    void updateEstadoBySucursalId(@Param("sucursalId") Long sucursalId, @Param("estado") String estado);


}
