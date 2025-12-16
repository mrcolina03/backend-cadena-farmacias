package ec.espe.msinventariov2.controllers;


import ec.espe.msinventariov2.models.dto.SucursalDTO;
import ec.espe.msinventariov2.services.sucursal.SucursalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario/sucursales")
public class SucursalController {

    @Autowired
    private SucursalService sucursalService;

    @GetMapping("/todas")
    public ResponseEntity<List<SucursalDTO>> listarTodasLasSucursales() {
        List<SucursalDTO> sucursales = sucursalService.findAll();
        return ResponseEntity.ok(sucursales);
    }

    @GetMapping("/inactivas")
    public ResponseEntity<List<SucursalDTO>> listarSucursalesInactivas() {
        List<SucursalDTO> sucursales = sucursalService.findAllInactivas();
        return ResponseEntity.ok(sucursales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SucursalDTO> obtenerSucursalPorId(@PathVariable String id) {
        SucursalDTO sucursal = sucursalService.findById(id);
        return ResponseEntity.ok(sucursal);
    }

    @PostMapping
    public ResponseEntity<SucursalDTO> crearSucursal(@Valid @RequestBody SucursalDTO sucursalDTO) {
        SucursalDTO nuevaSucursal = sucursalService.save(sucursalDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSucursal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SucursalDTO> actualizarSucursal(@PathVariable String id, @Valid @RequestBody SucursalDTO sucursalDTO) {
        SucursalDTO sucursalActualizada = sucursalService.update(id, sucursalDTO);
        return ResponseEntity.ok(sucursalActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSucursal(@PathVariable String id) {
        sucursalService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<SucursalDTO> activarSucursal(@PathVariable String id) {
        SucursalDTO sucursalActivada = sucursalService.activar(id);
        return ResponseEntity.ok(sucursalActivada);
    }
}