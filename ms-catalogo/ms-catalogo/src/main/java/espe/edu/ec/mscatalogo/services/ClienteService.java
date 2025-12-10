package espe.edu.ec.mscatalogo.services;

import espe.edu.ec.mscatalogo.exceptions.ResourceNotFoundException;
import espe.edu.ec.mscatalogo.models.dto.ClienteDTO;
import espe.edu.ec.mscatalogo.models.entities.Cliente;
import espe.edu.ec.mscatalogo.repositories.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<ClienteDTO> findAll() {
        return clienteRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> findAllActivos() {
        return clienteRepository.findByActivoTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteDTO findById(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        return convertToDTO(cliente);
    }

    @Transactional(readOnly = true)
    public ClienteDTO findByCedula(String cedula) {
        Cliente cliente = clienteRepository.findByCedula(cedula)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con cédula: " + cedula));
        return convertToDTO(cliente);
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> findByNombreOrApellido(String busqueda) {
        return clienteRepository.findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCase(busqueda, busqueda)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClienteDTO create(ClienteDTO clienteDTO) {
        if (clienteRepository.existsByCedula(clienteDTO.getCedula())) {
            throw new IllegalArgumentException("Ya existe un cliente con la cédula: " + clienteDTO.getCedula());
        }

        if (clienteDTO.getEmail() != null && !clienteDTO.getEmail().isEmpty()
                && clienteRepository.existsByEmail(clienteDTO.getEmail())) {
            throw new IllegalArgumentException("Ya existe un cliente con el email: " + clienteDTO.getEmail());
        }

        Cliente cliente = convertToEntity(clienteDTO);
        cliente.setActivo(true);
        Cliente savedCliente = clienteRepository.save(cliente);
        return convertToDTO(savedCliente);
    }

    @Transactional
    public ClienteDTO update(Long id, ClienteDTO clienteDTO) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));

        if (clienteRepository.existsByCedulaAndIdNot(clienteDTO.getCedula(), id)) {
            throw new IllegalArgumentException("Ya existe otro cliente con la cédula: " + clienteDTO.getCedula());
        }

        if (clienteDTO.getEmail() != null && !clienteDTO.getEmail().isEmpty()
                && clienteRepository.existsByEmailAndIdNot(clienteDTO.getEmail(), id)) {
            throw new IllegalArgumentException("Ya existe otro cliente con el email: " + clienteDTO.getEmail());
        }

        cliente.setCedula(clienteDTO.getCedula());
        cliente.setNombres(clienteDTO.getNombres());
        cliente.setApellidos(clienteDTO.getApellidos());
        cliente.setEmail(clienteDTO.getEmail());
        cliente.setTelefono(clienteDTO.getTelefono());
        cliente.setDireccion(clienteDTO.getDireccion());
        cliente.setFechaNacimiento(clienteDTO.getFechaNacimiento());
        cliente.setGenero(clienteDTO.getGenero());

        Cliente updatedCliente = clienteRepository.save(cliente);
        return convertToDTO(updatedCliente);
    }

    @Transactional
    public void delete(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        cliente.setActivo(false);
        clienteRepository.save(cliente);
    }

    @Transactional
    public void hardDelete(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente no encontrado con ID: " + id);
        }
        clienteRepository.deleteById(id);
    }

    private ClienteDTO convertToDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setCedula(cliente.getCedula());
        dto.setNombres(cliente.getNombres());
        dto.setApellidos(cliente.getApellidos());
        dto.setEmail(cliente.getEmail());
        dto.setTelefono(cliente.getTelefono());
        dto.setDireccion(cliente.getDireccion());
        dto.setFechaNacimiento(cliente.getFechaNacimiento());
        dto.setGenero(cliente.getGenero());
        dto.setActivo(cliente.getActivo());
        return dto;
    }

    private Cliente convertToEntity(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setId(dto.getId());
        cliente.setCedula(dto.getCedula());
        cliente.setNombres(dto.getNombres());
        cliente.setApellidos(dto.getApellidos());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefono(dto.getTelefono());
        cliente.setDireccion(dto.getDireccion());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setGenero(dto.getGenero());
        cliente.setActivo(dto.getActivo());
        return cliente;
    }

}