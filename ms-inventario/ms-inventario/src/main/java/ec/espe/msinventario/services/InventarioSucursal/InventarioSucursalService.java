package ec.espe.msinventario.services.InventarioSucursal;

import ec.espe.msinventario.models.dto.*;

import java.util.List;

public interface InventarioSucursalService {

    List<InventarioSucursalDTO> findBySucursalId(Long sucursalId);
    InventarioSucursalDTO addStock(InventarioSucursalDTO inventarioDTO);
    InventarioSucursalDTO updateStock(Long inventarioId, Integer cantidad);
    InventarioSucursalDTO save(InventarioSucursalDTO inventarioDTO);
}
