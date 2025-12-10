package ec.espe.msinventario.services.sucursal;

import ec.espe.msinventario.exceptions.ResourceNotFoundException;
import ec.espe.msinventario.models.dto.SucursalDTO;
import ec.espe.msinventario.models.entities.Sucursal;
import ec.espe.msinventario.repositories.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SucursalServiceImpl implements SucursalService {

    @Autowired
    private SucursalRepository sucursalRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SucursalDTO> findAll() {
        return sucursalRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SucursalDTO findById(String id) {
        Sucursal sucursal = sucursalRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Sucursal no encontrada con id: " + id));
        return convertToDTO(sucursal);
    }

    @Override
    @Transactional
    public SucursalDTO save(SucursalDTO sucursalDTO) {
        Sucursal sucursal = convertToEntity(sucursalDTO);
        sucursal = sucursalRepository.save(sucursal);
        return convertToDTO(sucursal);
    }

    @Override
    @Transactional
    public SucursalDTO update(String id, SucursalDTO sucursalDTO) {
        Sucursal sucursal = sucursalRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Sucursal no encontrada con id: " + id));

        sucursal.setNombre(sucursalDTO.getNombre());
        sucursal.setDireccion(sucursalDTO.getDireccion());
        sucursal.setCiudad(sucursalDTO.getCiudad());

        sucursal = sucursalRepository.save(sucursal);
        return convertToDTO(sucursal);
    }

    @Override
    @Transactional
    public void deleteById(String id) {
        if (!sucursalRepository.existsById(Long.valueOf(id))) {
            throw new ResourceNotFoundException("Sucursal no encontrada con id: " + id);
        }
        sucursalRepository.deleteById(Long.valueOf(id));
    }

    private SucursalDTO convertToDTO(Sucursal sucursal) {
        SucursalDTO dto = new SucursalDTO();
        dto.setId(sucursal.getId());
        dto.setNombre(sucursal.getNombre());
        dto.setDireccion(sucursal.getDireccion());
        dto.setCiudad(sucursal.getCiudad());
        return dto;
    }

    private Sucursal convertToEntity(SucursalDTO dto) {
        Sucursal sucursal = new Sucursal();
        sucursal.setId(dto.getId());
        sucursal.setNombre(dto.getNombre());
        sucursal.setDireccion(dto.getDireccion());
        sucursal.setCiudad(dto.getCiudad());
        return sucursal;
    }
}
