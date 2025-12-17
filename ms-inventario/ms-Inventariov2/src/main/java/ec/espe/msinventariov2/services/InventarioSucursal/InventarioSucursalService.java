package ec.espe.msinventariov2.services.InventarioSucursal;

import ec.espe.msinventariov2.models.dto.InventarioMedicamentoDTO;
import ec.espe.msinventariov2.models.dto.InventarioSucursalDTO;

import java.util.List;

public interface InventarioSucursalService {

    List<InventarioSucursalDTO> findAll();
    List<InventarioSucursalDTO> findAllActivos();
    List<InventarioSucursalDTO> findAllInactivos();
    List<InventarioSucursalDTO> findBySucursalId(Long sucursalId);
    InventarioSucursalDTO addStock(InventarioSucursalDTO inventarioDTO);
    InventarioSucursalDTO updateStock(Long inventarioId, Integer cantidad);
    InventarioSucursalDTO save(InventarioSucursalDTO inventarioDTO);
    void deleteLogicoById(Long id);
    void deleteFisicoById(Long id);
    InventarioSucursalDTO activarById(Long id);
    List<InventarioMedicamentoDTO> obtenerInventarioDetalladoPorSucursal(Long sucursalId);

    Integer consultarStock(Long medicamentoId, Long sucursalId);
    void descontarStock(Long medicamentoId, Long sucursalId, Integer cantidad);
}
