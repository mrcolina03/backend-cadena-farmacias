package ec.edu.espe.oauthserver.controller;

import ec.edu.espe.oauthserver.dto.RoleDTO;
import ec.edu.espe.oauthserver.service.RoleService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // READ - listar todos
    @GetMapping
    public ResponseEntity<List<RoleDTO>> findAll() {
        return ResponseEntity.ok(roleService.findAll());
    }

    // READ - por id
    @GetMapping("/{id}")
    public ResponseEntity<RoleDTO> findById(@PathVariable Long id) {
        RoleDTO role = roleService.findById(id);
        if (role == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(role);
    }

    // CREATE
    @PostMapping
    public ResponseEntity<RoleDTO> create(@RequestBody RoleDTO roleDTO) {
        RoleDTO created = roleService.save(roleDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<RoleDTO> update(
            @PathVariable Long id,
            @RequestBody RoleDTO roleDTO) {

        RoleDTO updated = roleService.update(id, roleDTO);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean deleted = roleService.delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
