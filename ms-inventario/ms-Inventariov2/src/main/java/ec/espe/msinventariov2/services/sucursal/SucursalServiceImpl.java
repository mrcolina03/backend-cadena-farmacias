package ec.espe.msinventariov2.services.sucursal;


import ec.espe.msinventariov2.exceptions.ResourceNotFoundException;
import ec.espe.msinventariov2.models.dto.SucursalDTO;
import ec.espe.msinventariov2.models.entities.Sucursal;
import ec.espe.msinventariov2.repositories.InventarioSucursalRepository;
import ec.espe.msinventariov2.repositories.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SucursalServiceImpl implements SucursalService {

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private InventarioSucursalRepository inventarioSucursalRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SucursalDTO> findAll() {
        return sucursalRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SucursalDTO> findAllActivas() {
        return sucursalRepository.findByEstado("ACTIVO").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SucursalDTO> findAllInactivas() {
        return sucursalRepository.findByEstado("INACTIVO").stream()
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
        if (sucursal.getEstado() == null || sucursal.getEstado().isEmpty()) {
            sucursal.setEstado("ACTIVO");
        }
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
        Sucursal sucursal = sucursalRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Sucursal no encontrada con id: " + id));

        // Cambiar estado a INACTIVO (eliminación lógica)
        sucursal.setEstado("INACTIVO");
        sucursalRepository.save(sucursal);

        // Desactivar todos los inventarios de esta sucursal
        inventarioSucursalRepository.updateEstadoBySucursalId(Long.valueOf(id), "INACTIVO");
    }

    @Override
    @Transactional
    public SucursalDTO activar(String id) {
        Sucursal sucursal = sucursalRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Sucursal no encontrada con id: " + id));

        // Cambiar estado a ACTIVO
        sucursal.setEstado("ACTIVO");
        sucursal = sucursalRepository.save(sucursal);

        // Reactivar todos los inventarios de esta sucursal
        inventarioSucursalRepository.updateEstadoBySucursalId(Long.valueOf(id), "ACTIVO");

        return convertToDTO(sucursal);
    }

    private SucursalDTO convertToDTO(Sucursal sucursal) {
        SucursalDTO dto = new SucursalDTO();
        dto.setId(sucursal.getId());
        dto.setNombre(sucursal.getNombre());
        dto.setDireccion(sucursal.getDireccion());
        dto.setCiudad(sucursal.getCiudad());
        dto.setEstado(sucursal.getEstado());
        return dto;
    }

    private Sucursal convertToEntity(SucursalDTO dto) {
        Sucursal sucursal = new Sucursal();
        sucursal.setId(dto.getId());
        sucursal.setNombre(dto.getNombre());
        sucursal.setDireccion(dto.getDireccion());
        sucursal.setCiudad(dto.getCiudad());
        sucursal.setEstado(dto.getEstado());
        return sucursal;
    }
}
