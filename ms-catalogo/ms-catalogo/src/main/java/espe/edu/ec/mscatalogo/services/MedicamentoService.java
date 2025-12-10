package espe.edu.ec.mscatalogo.services;

import espe.edu.ec.mscatalogo.exceptions.ResourceNotFoundException;
import espe.edu.ec.mscatalogo.models.dto.MedicamentoDTO;
import espe.edu.ec.mscatalogo.models.entities.Medicamento;
import espe.edu.ec.mscatalogo.repositories.MedicamentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicamentoService {

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Transactional(readOnly = true)
    public List<MedicamentoDTO> findAll() {
        return medicamentoRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicamentoDTO> findAllActivos() {
        return medicamentoRepository.findByActivoTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MedicamentoDTO findById(Long id) {
        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + id));
        return convertToDTO(medicamento);
    }

    @Transactional(readOnly = true)
    public MedicamentoDTO findByCodigo(String codigo) {
        Medicamento medicamento = medicamentoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con código: " + codigo));
        return convertToDTO(medicamento);
    }

    @Transactional(readOnly = true)
    public List<MedicamentoDTO> findByNombre(String nombre) {
        return medicamentoRepository.findByNombreContainingIgnoreCase(nombre)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MedicamentoDTO> findByLaboratorio(String laboratorio) {
        return medicamentoRepository.findByLaboratorioIgnoreCase(laboratorio)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public MedicamentoDTO create(MedicamentoDTO medicamentoDTO) {
        if (medicamentoRepository.existsByCodigo(medicamentoDTO.getCodigo())) {
            throw new IllegalArgumentException("Ya existe un medicamento con el código: " + medicamentoDTO.getCodigo());
        }

        Medicamento medicamento = convertToEntity(medicamentoDTO);
        medicamento.setActivo(true);
        Medicamento savedMedicamento = medicamentoRepository.save(medicamento);
        return convertToDTO(savedMedicamento);
    }

    @Transactional
    public MedicamentoDTO update(Long id, MedicamentoDTO medicamentoDTO) {
        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + id));

        if (medicamentoRepository.existsByCodigoAndIdNot(medicamentoDTO.getCodigo(), id)) {
            throw new IllegalArgumentException("Ya existe otro medicamento con el código: " + medicamentoDTO.getCodigo());
        }

        medicamento.setCodigo(medicamentoDTO.getCodigo());
        medicamento.setNombre(medicamentoDTO.getNombre());
        medicamento.setDescripcion(medicamentoDTO.getDescripcion());
        medicamento.setLaboratorio(medicamentoDTO.getLaboratorio());
        medicamento.setPrincipioActivo(medicamentoDTO.getPrincipioActivo());
        medicamento.setPresentacion(medicamentoDTO.getPresentacion());
        medicamento.setPrecio(medicamentoDTO.getPrecio());
        medicamento.setRequiereReceta(medicamentoDTO.getRequiereReceta());
        medicamento.setFechaVencimiento(medicamentoDTO.getFechaVencimiento());

        Medicamento updatedMedicamento = medicamentoRepository.save(medicamento);
        return convertToDTO(updatedMedicamento);
    }

    @Transactional
    public void delete(Long id) {
        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + id));
        medicamento.setActivo(false);
        medicamentoRepository.save(medicamento);
    }

    @Transactional
    public void hardDelete(Long id) {
        if (!medicamentoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medicamento no encontrado con ID: " + id);
        }
        medicamentoRepository.deleteById(id);
    }

    private MedicamentoDTO convertToDTO(Medicamento medicamento) {
        MedicamentoDTO dto = new MedicamentoDTO();
        dto.setId(medicamento.getId());
        dto.setCodigo(medicamento.getCodigo());
        dto.setNombre(medicamento.getNombre());
        dto.setDescripcion(medicamento.getDescripcion());
        dto.setLaboratorio(medicamento.getLaboratorio());
        dto.setPrincipioActivo(medicamento.getPrincipioActivo());
        dto.setPresentacion(medicamento.getPresentacion());
        dto.setPrecio(medicamento.getPrecio());
        dto.setRequiereReceta(medicamento.getRequiereReceta());
        dto.setFechaVencimiento(medicamento.getFechaVencimiento());
        dto.setActivo(medicamento.getActivo());
        return dto;
    }

    private Medicamento convertToEntity(MedicamentoDTO dto) {
        Medicamento medicamento = new Medicamento();
        medicamento.setId(dto.getId());
        medicamento.setCodigo(dto.getCodigo());
        medicamento.setNombre(dto.getNombre());
        medicamento.setDescripcion(dto.getDescripcion());
        medicamento.setLaboratorio(dto.getLaboratorio());
        medicamento.setPrincipioActivo(dto.getPrincipioActivo());
        medicamento.setPresentacion(dto.getPresentacion());
        medicamento.setPrecio(dto.getPrecio());
        medicamento.setRequiereReceta(dto.getRequiereReceta());
        medicamento.setFechaVencimiento(dto.getFechaVencimiento());
        medicamento.setActivo(dto.getActivo());
        return medicamento;
    }

}