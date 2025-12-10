package espe.edu.ec.mscatalogo.services;

import espe.edu.ec.mscatalogo.exceptions.ResourceNotFoundException;
import espe.edu.ec.mscatalogo.models.dto.PrescripcionDTO;
import espe.edu.ec.mscatalogo.models.entities.Cliente;
import espe.edu.ec.mscatalogo.models.entities.Medicamento;
import espe.edu.ec.mscatalogo.models.entities.Prescripcion;
import espe.edu.ec.mscatalogo.repositories.ClienteRepository;
import espe.edu.ec.mscatalogo.repositories.MedicamentoRepository;
import espe.edu.ec.mscatalogo.repositories.PrescripcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescripcionService {

    @Autowired
    private PrescripcionRepository prescripcionRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    @Transactional(readOnly = true)
    public List<PrescripcionDTO> findAll() {
        return prescripcionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PrescripcionDTO> findAllActivas() {
        return prescripcionRepository.findByActivoTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PrescripcionDTO findById(Long id) {
        Prescripcion prescripcion = prescripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescripción no encontrada con ID: " + id));
        return convertToDTO(prescripcion);
    }

    @Transactional(readOnly = true)
    public List<PrescripcionDTO> findByClienteId(Long clienteId) {
        if (!clienteRepository.existsById(clienteId)) {
            throw new ResourceNotFoundException("Cliente no encontrado con ID: " + clienteId);
        }
        return prescripcionRepository.findByClienteId(clienteId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PrescripcionDTO> findByMedicamentoId(Long medicamentoId) {
        if (!medicamentoRepository.existsById(medicamentoId)) {
            throw new ResourceNotFoundException("Medicamento no encontrado con ID: " + medicamentoId);
        }
        return prescripcionRepository.findByMedicamentoId(medicamentoId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PrescripcionDTO> findPrescripcionesVigentes() {
        return prescripcionRepository.findPrescripcionesVigentes(LocalDate.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PrescripcionDTO> findPrescripcionesVencidas() {
        return prescripcionRepository.findPrescripcionesVencidas(LocalDate.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PrescripcionDTO create(PrescripcionDTO prescripcionDTO) {
        Cliente cliente = clienteRepository.findById(prescripcionDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + prescripcionDTO.getClienteId()));

        Medicamento medicamento = medicamentoRepository.findById(prescripcionDTO.getMedicamentoId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + prescripcionDTO.getMedicamentoId()));

        if (!cliente.getActivo()) {
            throw new IllegalArgumentException("No se puede crear prescripción para un cliente inactivo");
        }

        if (!medicamento.getActivo()) {
            throw new IllegalArgumentException("No se puede crear prescripción para un medicamento inactivo");
        }

        if (prescripcionDTO.getFechaVencimiento().isBefore(prescripcionDTO.getFechaEmision())) {
            throw new IllegalArgumentException("La fecha de vencimiento no puede ser anterior a la fecha de emisión");
        }

        Prescripcion prescripcion = new Prescripcion();
        prescripcion.setCliente(cliente);
        prescripcion.setMedicamento(medicamento);
        prescripcion.setNombreMedico(prescripcionDTO.getNombreMedico());
        prescripcion.setNumeroLicenciaMedico(prescripcionDTO.getNumeroLicenciaMedico());
        prescripcion.setDiagnostico(prescripcionDTO.getDiagnostico());
        prescripcion.setIndicaciones(prescripcionDTO.getIndicaciones());
        prescripcion.setCantidad(prescripcionDTO.getCantidad());
        prescripcion.setFechaEmision(prescripcionDTO.getFechaEmision());
        prescripcion.setFechaVencimiento(prescripcionDTO.getFechaVencimiento());
        prescripcion.setActivo(true);

        Prescripcion savedPrescripcion = prescripcionRepository.save(prescripcion);
        return convertToDTO(savedPrescripcion);
    }

    @Transactional
    public PrescripcionDTO update(Long id, PrescripcionDTO prescripcionDTO) {
        Prescripcion prescripcion = prescripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescripción no encontrada con ID: " + id));

        Cliente cliente = clienteRepository.findById(prescripcionDTO.getClienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + prescripcionDTO.getClienteId()));

        Medicamento medicamento = medicamentoRepository.findById(prescripcionDTO.getMedicamentoId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento no encontrado con ID: " + prescripcionDTO.getMedicamentoId()));

        if (prescripcionDTO.getFechaVencimiento().isBefore(prescripcionDTO.getFechaEmision())) {
            throw new IllegalArgumentException("La fecha de vencimiento no puede ser anterior a la fecha de emisión");
        }

        prescripcion.setCliente(cliente);
        prescripcion.setMedicamento(medicamento);
        prescripcion.setNombreMedico(prescripcionDTO.getNombreMedico());
        prescripcion.setNumeroLicenciaMedico(prescripcionDTO.getNumeroLicenciaMedico());
        prescripcion.setDiagnostico(prescripcionDTO.getDiagnostico());
        prescripcion.setIndicaciones(prescripcionDTO.getIndicaciones());
        prescripcion.setCantidad(prescripcionDTO.getCantidad());
        prescripcion.setFechaEmision(prescripcionDTO.getFechaEmision());
        prescripcion.setFechaVencimiento(prescripcionDTO.getFechaVencimiento());

        Prescripcion updatedPrescripcion = prescripcionRepository.save(prescripcion);
        return convertToDTO(updatedPrescripcion);
    }

    @Transactional
    public void delete(Long id) {
        Prescripcion prescripcion = prescripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescripción no encontrada con ID: " + id));
        prescripcion.setActivo(false);
        prescripcionRepository.save(prescripcion);
    }

    @Transactional
    public void hardDelete(Long id) {
        if (!prescripcionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prescripción no encontrada con ID: " + id);
        }
        prescripcionRepository.deleteById(id);
    }

    @Transactional
    public void activate(Long id) {
        Prescripcion prescripcion = prescripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescripción no encontrada con ID: " + id));
        prescripcion.setActivo(true);
        prescripcionRepository.save(prescripcion);
    }

    private PrescripcionDTO convertToDTO(Prescripcion prescripcion) {
        PrescripcionDTO dto = new PrescripcionDTO();
        dto.setId(prescripcion.getId());
        dto.setClienteId(prescripcion.getCliente().getId());
        dto.setClienteNombre(prescripcion.getCliente().getNombres() + " " + prescripcion.getCliente().getApellidos());
        dto.setMedicamentoId(prescripcion.getMedicamento().getId());
        dto.setMedicamentoNombre(prescripcion.getMedicamento().getNombre());
        dto.setNombreMedico(prescripcion.getNombreMedico());
        dto.setNumeroLicenciaMedico(prescripcion.getNumeroLicenciaMedico());
        dto.setDiagnostico(prescripcion.getDiagnostico());
        dto.setIndicaciones(prescripcion.getIndicaciones());
        dto.setCantidad(prescripcion.getCantidad());
        dto.setFechaEmision(prescripcion.getFechaEmision());
        dto.setFechaVencimiento(prescripcion.getFechaVencimiento());
        dto.setActivo(prescripcion.getActivo());
        return dto;
    }

}