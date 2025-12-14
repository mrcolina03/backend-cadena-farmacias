package ec.espe.msinventario.controllers;

import ec.espe.msinventario.models.dto.*;
import ec.espe.msinventario.services.InventarioSucursal.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class InventarioSucursalController {

    @Autowired
    private InventarioSucursalService inventarioService;


    @GetMapping("/sucursal/{sucursalId}")
    public ResponseEntity<List<InventarioSucursalDTO>> obtenerInventarioPorSucursal(@PathVariable Long sucursalId) {
        List<InventarioSucursalDTO> inventario = inventarioService.findBySucursalId(sucursalId);
        return ResponseEntity.ok(inventario);
    }

    @PostMapping
    public ResponseEntity<InventarioSucursalDTO> agregarStock(@Valid @RequestBody InventarioSucursalDTO inventarioDTO) {
        InventarioSucursalDTO nuevoInventario = inventarioService.addStock(inventarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoInventario);
    }

    @PutMapping("/{inventarioId}")
    public ResponseEntity<InventarioSucursalDTO> actualizarStock(@PathVariable Long inventarioId, @RequestParam Integer cantidad) {
        InventarioSucursalDTO inventarioActualizado = inventarioService.updateStock(inventarioId, cantidad);
        return ResponseEntity.ok(inventarioActualizado);
    }
}
