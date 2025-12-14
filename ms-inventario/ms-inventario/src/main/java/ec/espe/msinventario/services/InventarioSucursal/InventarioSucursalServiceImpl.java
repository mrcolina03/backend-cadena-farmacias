package ec.espe.msinventario.services.InventarioSucursal;

import ec.espe.msinventario.exceptions.*;
import ec.espe.msinventario.models.dto.*;
import ec.espe.msinventario.models.entities.*;
import ec.espe.msinventario.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventarioSucursalServiceImpl implements InventarioSucursalService {

    @Autowired
    private InventarioSucursalRepository inventarioRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Override
    @Transactional
    public InventarioSucursalDTO save(InventarioSucursalDTO inventarioDTO) {
        Sucursal sucursal = sucursalRepository.findById(inventarioDTO.getIdSucursal())
                .orElseThrow(() -> new ResourceNotFoundException("Sucursal no encontrada con id: " + inventarioDTO.getIdSucursal()));

        InventarioSucursal inventario = convertToEntity(inventarioDTO, sucursal);
        inventario = inventarioRepository.save(inventario);
        return convertToDTO(inventario);
    }


    @Override
    @Transactional(readOnly = true)
    public List<InventarioSucursalDTO> findBySucursalId(Long sucursalId) {
        if (!sucursalRepository.existsById(sucursalId)) {
            throw new ResourceNotFoundException("Sucursal no encontrada con id: " + sucursalId);
        }
        return inventarioRepository.findBySucursalId(sucursalId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public InventarioSucursalDTO addStock(InventarioSucursalDTO inventarioDTO) {
        Sucursal sucursal = sucursalRepository.findById(inventarioDTO.getIdSucursal())
                .orElseThrow(() -> new ResourceNotFoundException("Sucursal no encontrada con id: " + inventarioDTO.getIdSucursal()));

        // Aquí se debería validar si el medicamento existe, posiblemente llamando a otro microservicio
        // Por ahora, asumimos que el idMedicamento es válido.

        InventarioSucursal inventario = convertToEntity(inventarioDTO, sucursal);
        inventario = inventarioRepository.save(inventario);
        return convertToDTO(inventario);
    }

    @Override
    @Transactional
    public InventarioSucursalDTO updateStock(Long inventarioId, Integer cantidad) {
        InventarioSucursal inventario = inventarioRepository.findById(inventarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventario no encontrado con id: " + inventarioId));

        inventario.setCantidad(cantidad);
        inventario = inventarioRepository.save(inventario);
        return convertToDTO(inventario);
    }

    private InventarioSucursalDTO convertToDTO(InventarioSucursal inventario) {
        InventarioSucursalDTO dto = new InventarioSucursalDTO();
        dto.setId(inventario.getId());
        dto.setIdSucursal(inventario.getSucursal().getId());
        dto.setIdMedicamento(inventario.getIdMedicamento());
        dto.setCantidad(inventario.getCantidad());
        dto.setFechaActualizacion(inventario.getFechaActualizacion());
        return dto;
    }

    private InventarioSucursal convertToEntity(InventarioSucursalDTO dto, Sucursal sucursal) {
        InventarioSucursal inventario = new InventarioSucursal();
        inventario.setId(dto.getId());
        inventario.setSucursal(sucursal);
        inventario.setIdMedicamento(dto.getIdMedicamento());
        inventario.setCantidad(dto.getCantidad());
        return inventario;
    }
}
