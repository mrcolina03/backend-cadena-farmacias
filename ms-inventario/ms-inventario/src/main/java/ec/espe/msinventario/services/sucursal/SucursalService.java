package ec.espe.msinventario.services.sucursal;

import ec.espe.msinventario.models.dto.SucursalDTO;

import java.util.List;

public interface SucursalService {

    List<SucursalDTO> findAll();

    SucursalDTO findById(String id);

    SucursalDTO save(SucursalDTO sucursalDTO);

    SucursalDTO update(String id, SucursalDTO sucursalDTO);

    void deleteById(String id);
}
