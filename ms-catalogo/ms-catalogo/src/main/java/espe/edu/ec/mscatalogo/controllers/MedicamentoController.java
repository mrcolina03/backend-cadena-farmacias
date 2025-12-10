package espe.edu.ec.mscatalogo.controllers;

import espe.edu.ec.mscatalogo.models.dto.MedicamentoDTO;
import espe.edu.ec.mscatalogo.services.MedicamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicamentos")
@CrossOrigin(origins = "*")
public class MedicamentoController {

    @Autowired
    private MedicamentoService medicamentoService;

    @GetMapping
    public ResponseEntity<List<MedicamentoDTO>> getAllMedicamentos() {
        List<MedicamentoDTO> medicamentos = medicamentoService.findAll();
        return ResponseEntity.ok(medicamentos);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<MedicamentoDTO>> getAllMedicamentosActivos() {
        List<MedicamentoDTO> medicamentos = medicamentoService.findAllActivos();
        return ResponseEntity.ok(medicamentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicamentoDTO> getMedicamentoById(@PathVariable Long id) {
        MedicamentoDTO medicamento = medicamentoService.findById(id);
        return ResponseEntity.ok(medicamento);
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<MedicamentoDTO> getMedicamentoByCodigo(@PathVariable String codigo) {
        MedicamentoDTO medicamento = medicamentoService.findByCodigo(codigo);
        return ResponseEntity.ok(medicamento);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<MedicamentoDTO>> buscarMedicamentosPorNombre(@RequestParam String nombre) {
        List<MedicamentoDTO> medicamentos = medicamentoService.findByNombre(nombre);
        return ResponseEntity.ok(medicamentos);
    }

    @GetMapping("/laboratorio/{laboratorio}")
    public ResponseEntity<List<MedicamentoDTO>> getMedicamentosByLaboratorio(@PathVariable String laboratorio) {
        List<MedicamentoDTO> medicamentos = medicamentoService.findByLaboratorio(laboratorio);
        return ResponseEntity.ok(medicamentos);
    }

    @PostMapping
    public ResponseEntity<MedicamentoDTO> createMedicamento(@Valid @RequestBody MedicamentoDTO medicamentoDTO) {
        MedicamentoDTO nuevoMedicamento = medicamentoService.create(medicamentoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoMedicamento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicamentoDTO> updateMedicamento(
            @PathVariable Long id,
            @Valid @RequestBody MedicamentoDTO medicamentoDTO) {
        MedicamentoDTO medicamentoActualizado = medicamentoService.update(id, medicamentoDTO);
        return ResponseEntity.ok(medicamentoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicamento(@PathVariable Long id) {
        medicamentoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanente")
    public ResponseEntity<Void> hardDeleteMedicamento(@PathVariable Long id) {
        medicamentoService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }

}