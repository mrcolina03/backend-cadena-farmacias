package ec.espe.msinventariov2.services.InventarioSucursal;

import ec.espe.msinventariov2.clientes.MedicamentosClienteRest;
import ec.espe.msinventariov2.exceptions.InventarioAlreadyExistsException;
import ec.espe.msinventariov2.exceptions.ResourceNotFoundException;
import ec.espe.msinventariov2.models.dto.InventarioMedicamentoDTO;
import ec.espe.msinventariov2.models.dto.InventarioSucursalDTO;
import ec.espe.msinventariov2.models.dto.MedicamentosDTO;
import ec.espe.msinventariov2.models.entities.InventarioSucursal;
import ec.espe.msinventariov2.models.entities.Sucursal;
import ec.espe.msinventariov2.repositories.InventarioSucursalRepository;
import ec.espe.msinventariov2.repositories.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventarioSucursalServiceImpl implements InventarioSucursalService {

    @Autowired
    private InventarioSucursalRepository inventarioRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private MedicamentosClienteRest medicamentosClienteRest;

    // ========================
    // GET
    // ========================

    @Override
    @Transactional(readOnly = true)
    public List<InventarioSucursalDTO> findAll() {
        return inventarioRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioSucursalDTO> findBySucursalId(Long sucursalId) {
        if (!sucursalRepository.existsById(sucursalId)) {
            throw new ResourceNotFoundException("Sucursal no encontrada con id: " + sucursalId);
        }

        return inventarioRepository.findBySucursalId(sucursalId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InventarioSucursalDTO addStock(InventarioSucursalDTO inventarioDTO) {
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioSucursalDTO> findAllActivos() {
        return inventarioRepository.findByEstado("ACTIVO")
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventarioSucursalDTO> findAllInactivos() {
        return inventarioRepository.findByEstado("INACTIVO")
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ========================
    // POST
    // ========================

    @Override
    @Transactional
    public InventarioSucursalDTO save(InventarioSucursalDTO inventarioDTO) {

        Optional<InventarioSucursal> existing =
                inventarioRepository.findBySucursalIdAndIdMedicamento(
                        inventarioDTO.getIdSucursal(),
                        inventarioDTO.getIdMedicamento()
                );

        if (existing.isPresent()) {
            throw new InventarioAlreadyExistsException(
                    "El medicamento con ID " + inventarioDTO.getIdMedicamento() +
                            " ya existe en la sucursal con ID " + inventarioDTO.getIdSucursal()
            );
        }

        if (inventarioDTO.getCantidad() < inventarioDTO.getStockMinimo()) {
            throw new IllegalArgumentException("La cantidad no puede ser menor que el stock mínimo.");
        }

        Sucursal sucursal = sucursalRepository.findById(inventarioDTO.getIdSucursal())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Sucursal no encontrada con id: " + inventarioDTO.getIdSucursal()
                        )
                );

        InventarioSucursal inventario = convertToEntity(inventarioDTO, sucursal);
        inventario = inventarioRepository.save(inventario);

        return convertToDTO(inventario);
    }

    // ========================
    // PUT
    // ========================

    @Override
    @Transactional
    public InventarioSucursalDTO updateStock(Long inventarioId, Integer cantidad) {

        InventarioSucursal inventario = inventarioRepository.findById(inventarioId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventario no encontrado con id: " + inventarioId
                        )
                );

        if (cantidad < inventario.getStockMinimo()) {
            throw new IllegalArgumentException("La cantidad no puede ser menor que el stock mínimo.");
        }

        inventario.setCantidad(cantidad);
        inventario = inventarioRepository.save(inventario);

        return convertToDTO(inventario);
    }

    // ========================
    // DELETE / PATCH
    // ========================

    @Override
    @Transactional
    public void deleteLogicoById(Long id) {
        InventarioSucursal inventario = inventarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventario no encontrado con id: " + id
                        )
                );

        inventario.setEstado("INACTIVO");
        inventarioRepository.save(inventario);
    }

    @Override
    @Transactional
    public void deleteFisicoById(Long id) {
        if (!inventarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Inventario no encontrado con id: " + id);
        }
        inventarioRepository.deleteById(id);
    }

    @Override
    @Transactional
    public InventarioSucursalDTO activarById(Long id) {
        InventarioSucursal inventario = inventarioRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventario no encontrado con id: " + id
                        )
                );

        inventario.setEstado("ACTIVO");
        inventario = inventarioRepository.save(inventario);

        return convertToDTO(inventario);
    }

    // ========================
    // INVENTARIO DETALLADO
    // ========================

    @Override
    @Transactional(readOnly = true)
    public List<InventarioMedicamentoDTO> obtenerInventarioDetalladoPorSucursal(Long sucursalId) {

        if (!sucursalRepository.existsById(sucursalId)) {
            throw new ResourceNotFoundException("Sucursal no encontrada con id: " + sucursalId);
        }

        List<InventarioSucursal> inventarioSucursal =
                inventarioRepository.findBySucursalId(sucursalId);

        List<InventarioMedicamentoDTO> resultado = new ArrayList<>();

        for (InventarioSucursal item : inventarioSucursal) {
            try {
                Optional<MedicamentosDTO> medicamentoOpt =
                        medicamentosClienteRest.buscarPorId(item.getIdMedicamento());

                if (medicamentoOpt.isPresent()) {
                    MedicamentosDTO med = medicamentoOpt.get();
                    InventarioMedicamentoDTO dto = new InventarioMedicamentoDTO();

                    dto.setIdMedicamento(med.getId());
                    dto.setCodigo(med.getCodigo());
                    dto.setNombre(med.getNombre());
                    dto.setDescripcion(med.getDescripcion());
                    dto.setLaboratorio(med.getLaboratorio());
                    dto.setPrincipioActivo(med.getPrincipioActivo());
                    dto.setPresentacion(med.getPresentacion());
                    dto.setPrecio(med.getPrecio());
                    dto.setRequiereReceta(med.getRequiereReceta());
                    dto.setFechaVencimiento(med.getFechaVencimiento());

                    dto.setIdInventario(item.getId());
                    dto.setCantidad(item.getCantidad());
                    dto.setStockMinimo(item.getStockMinimo());
                    dto.setEstadoInventario(item.getEstado());
                    dto.setFechaActualizacion(item.getFechaActualizacion());

                    resultado.add(dto);
                }
            } catch (Exception e) {
                // opcional: log
            }
        }
        return resultado;
    }

    // ========================
    // MAPPERS
    // ========================

    private InventarioSucursalDTO convertToDTO(InventarioSucursal inventario) {
        InventarioSucursalDTO dto = new InventarioSucursalDTO();
        dto.setId(inventario.getId());
        dto.setIdSucursal(inventario.getSucursal().getId());
        dto.setIdMedicamento(inventario.getIdMedicamento());
        dto.setCantidad(inventario.getCantidad());
        dto.setStockMinimo(inventario.getStockMinimo());
        dto.setFechaActualizacion(inventario.getFechaActualizacion());
        dto.setEstado(inventario.getEstado());
        return dto;
    }

    private InventarioSucursal convertToEntity(InventarioSucursalDTO dto, Sucursal sucursal) {
        InventarioSucursal inventario = new InventarioSucursal();
        inventario.setId(dto.getId());
        inventario.setSucursal(sucursal);
        inventario.setIdMedicamento(dto.getIdMedicamento());
        inventario.setCantidad(dto.getCantidad());
        inventario.setStockMinimo(dto.getStockMinimo());
        inventario.setEstado(
                dto.getEstado() == null || dto.getEstado().isEmpty()
                        ? "ACTIVO"
                        : dto.getEstado()
        );
        return inventario;
    }
}
