package espe.edu.ec.mscatalogo.controllers;

import espe.edu.ec.mscatalogo.models.dto.PrescripcionDTO;
import espe.edu.ec.mscatalogo.services.PrescripcionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescripciones")
@CrossOrigin(origins = "*")
public class PrescripcionController {

    @Autowired
    private PrescripcionService prescripcionService;

    @GetMapping
    public ResponseEntity<List<PrescripcionDTO>> getAllPrescripciones() {
        List<PrescripcionDTO> prescripciones = prescripcionService.findAll();
        return ResponseEntity.ok(prescripciones);
    }

    @GetMapping("/activas")
    public ResponseEntity<List<PrescripcionDTO>> getAllPrescripcionesActivas() {
        List<PrescripcionDTO> prescripciones = prescripcionService.findAllActivas();
        return ResponseEntity.ok(prescripciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescripcionDTO> getPrescripcionById(@PathVariable Long id) {
        PrescripcionDTO prescripcion = prescripcionService.findById(id);
        return ResponseEntity.ok(prescripcion);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PrescripcionDTO>> getPrescripcionesByCliente(@PathVariable Long clienteId) {
        List<PrescripcionDTO> prescripciones = prescripcionService.findByClienteId(clienteId);
        return ResponseEntity.ok(prescripciones);
    }

    @GetMapping("/medicamento/{medicamentoId}")
    public ResponseEntity<List<PrescripcionDTO>> getPrescripcionesByMedicamento(@PathVariable Long medicamentoId) {
        List<PrescripcionDTO> prescripciones = prescripcionService.findByMedicamentoId(medicamentoId);
        return ResponseEntity.ok(prescripciones);
    }

    @GetMapping("/vigentes")
    public ResponseEntity<List<PrescripcionDTO>> getPrescripcionesVigentes() {
        List<PrescripcionDTO> prescripciones = prescripcionService.findPrescripcionesVigentes();
        return ResponseEntity.ok(prescripciones);
    }

    @GetMapping("/vencidas")
    public ResponseEntity<List<PrescripcionDTO>> getPrescripcionesVencidas() {
        List<PrescripcionDTO> prescripciones = prescripcionService.findPrescripcionesVencidas();
        return ResponseEntity.ok(prescripciones);
    }

    @PostMapping
    public ResponseEntity<PrescripcionDTO> createPrescripcion(@Valid @RequestBody PrescripcionDTO prescripcionDTO) {
        PrescripcionDTO nuevaPrescripcion = prescripcionService.create(prescripcionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaPrescripcion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescripcionDTO> updatePrescripcion(
            @PathVariable Long id,
            @Valid @RequestBody PrescripcionDTO prescripcionDTO) {
        PrescripcionDTO prescripcionActualizada = prescripcionService.update(id, prescripcionDTO);
        return ResponseEntity.ok(prescripcionActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescripcion(@PathVariable Long id) {
        prescripcionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/permanente")
    public ResponseEntity<Void> hardDeletePrescripcion(@PathVariable Long id) {
        prescripcionService.hardDelete(id);
        return ResponseEntity.noContent().build();
    }

}