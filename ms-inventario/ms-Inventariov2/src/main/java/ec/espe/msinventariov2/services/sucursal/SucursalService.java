package ec.espe.msinventariov2.services.sucursal;

import ec.espe.msinventariov2.models.dto.SucursalDTO;

import java.util.List;

public interface SucursalService {

    List<SucursalDTO> findAll();

    List<SucursalDTO> findAllActivas();

    List<SucursalDTO> findAllInactivas();

    SucursalDTO findById(String id);

    SucursalDTO save(SucursalDTO sucursalDTO);

    SucursalDTO update(String id, SucursalDTO sucursalDTO);

    void deleteById(String id);

    SucursalDTO activar(String id);
}
