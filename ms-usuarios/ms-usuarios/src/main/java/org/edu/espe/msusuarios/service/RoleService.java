package org.edu.espe.msusuarios.service;

import org.edu.espe.msusuarios.dto.RoleDTO;
import org.edu.espe.msusuarios.model.Role;
import org.edu.espe.msusuarios.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {

        private final RoleRepository roleRepository;

        // Constructor manual (reemplaza @RequiredArgsConstructor)
        public RoleService(RoleRepository roleRepository) {
                this.roleRepository = roleRepository;
        }

        @Transactional(readOnly = true)
        public List<RoleDTO> findAll() {
                return roleRepository.findAll()
                                .stream()
                                .map(role -> new RoleDTO(role.getId(), role.getNombre()))
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public RoleDTO findById(Long id) {
                return roleRepository.findById(id)
                                .map(role -> new RoleDTO(role.getId(), role.getNombre()))
                                .orElse(null);
        }

        @Transactional
        public RoleDTO save(RoleDTO roleDTO) {
                Role role = new Role();
                role.setNombre(roleDTO.getNombre());

                Role saved = roleRepository.save(role);
                return new RoleDTO(saved.getId(), saved.getNombre());
        }

        @Transactional
        public RoleDTO update(Long id, RoleDTO roleDTO) {
                return roleRepository.findById(id)
                                .map(role -> {
                                        role.setNombre(roleDTO.getNombre());
                                        Role updated = roleRepository.save(role);
                                        return new RoleDTO(updated.getId(), updated.getNombre());
                                })
                                .orElse(null);
        }

        @Transactional
        public boolean delete(Long id) {
                if (!roleRepository.existsById(id)) {
                        return false;
                }
                roleRepository.deleteById(id);
                return true;
        }
}
