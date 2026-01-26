package ec.edu.espe.oauthserver.service;

import ec.edu.espe.oauthserver.dto.UsuarioDTO;
import ec.edu.espe.oauthserver.model.Role;
import ec.edu.espe.oauthserver.model.User;
import ec.edu.espe.oauthserver.repository.RoleRepository;
import ec.edu.espe.oauthserver.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ===============================
    // Spring Security (OAuth2)
    // ===============================
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }

    // ===============================
    // CRUD
    // ===============================
    @Transactional(readOnly = true)
    public List<UsuarioDTO> findAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioDTO findById(Long id) {
        return userRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    @Transactional
    public UsuarioDTO save(UsuarioDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEnabled(true);
        user.setNombre(dto.getNombre());
        user.setApellido(dto.getApellido());
        user.setEmail(dto.getEmail());

        asignarRoles(dto, user);

        User saved = userRepository.save(user);
        return toDTO(saved);
    }

    @Transactional
    public UsuarioDTO update(Long id, UsuarioDTO dto) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();
        user.setNombre(dto.getNombre());
        user.setApellido(dto.getApellido());
        user.setEmail(dto.getEmail());
        user.setEnabled(dto.getEnabled());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getRoles() != null) {
            asignarRoles(dto, user);
        }

        return toDTO(userRepository.save(user));
    }

    @Transactional
    public boolean delete(Long id) {
        if (!userRepository.existsById(id)) {
            return false;
        }
        userRepository.deleteById(id);
        return true;
    }

    // ===============================
    // Helpers
    // ===============================
    private void asignarRoles(UsuarioDTO dto, User user) {
        List<Role> roles = dto.getRoles()
                .stream()
                .map(nombre -> roleRepository.findByNombre(nombre).orElse(null))
                .filter(r -> r != null)
                .collect(Collectors.toList());
        user.setRoles(roles);
    }

    private UsuarioDTO toDTO(User user) {
        return new UsuarioDTO(
                user.getId(),
                user.getUsername(),
                null, // password nunca se expone
                user.isEnabled(),
                user.getNombre(),
                user.getApellido(),
                user.getEmail(),
                user.getRoles()
                        .stream()
                        .map(Role::getNombre)
                        .collect(Collectors.toList()));
    }
}
