package ec.edu.espe.oauthserver.controller;

import ec.edu.espe.oauthserver.dto.UsuarioDTO;
import ec.edu.espe.oauthserver.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UserService userService;

    public UsuarioController(UserService userService) {
        this.userService = userService;
    }

    // ===============================
    // READ - listar todos
    // ===============================
    @GetMapping
    public ResponseEntity<Map<String, Object>> findAll() {
        List<UsuarioDTO> usuarios = userService.findAll();
        if (usuarios == null || usuarios.isEmpty()) {
            usuarios = Collections.emptyList();
        }
        // Devolvemos en la propiedad 'data' para que el frontend no falle
        return ResponseEntity.ok(Collections.singletonMap("data", usuarios));
    }

    // ===============================
    // READ - por id
    // ===============================
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> findById(@PathVariable Long id) {
        UsuarioDTO usuarioDTO = userService.findById(id);
        if (usuarioDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("data", null));
        }
        return ResponseEntity.ok(Collections.singletonMap("data", usuarioDTO));
    }

    // ===============================
    // CREATE
    // ===============================
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody UsuarioDTO usuarioDTO) {
        UsuarioDTO created = userService.save(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Collections.singletonMap("data", created));
    }

    // ===============================
    // UPDATE
    // ===============================
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Long id,
            @RequestBody UsuarioDTO usuarioDTO) {

        UsuarioDTO updated = userService.update(id, usuarioDTO);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("data", null));
        }
        return ResponseEntity.ok(Collections.singletonMap("data", updated));
    }

    // ===============================
    // DELETE
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        boolean deleted = userService.delete(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("data", null));
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(Collections.singletonMap("data", null));
    }
}
