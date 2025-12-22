package ec.espe.msinventariov2.controllers;

import ec.espe.msinventariov2.clientes.MedicamentosClienteRest;
import ec.espe.msinventariov2.exceptions.MedicamentoNotFoundException;
import ec.espe.msinventariov2.models.dto.InventarioMedicamentoDTO;
import ec.espe.msinventariov2.models.dto.InventarioSucursalDTO;
import ec.espe.msinventariov2.models.dto.MedicamentosDTO;
import ec.espe.msinventariov2.models.dto.StockRequestDTO;
import ec.espe.msinventariov2.services.InventarioSucursal.InventarioSucursalService;
import feign.FeignException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventario/inventario-sucursal")
public class InventarioSucursalController {

    @Autowired
    private InventarioSucursalService inventarioService;

    @Autowired
    private MedicamentosClienteRest medicamentosClienteRest;

    // ========================
    // GET
    // ========================

    @GetMapping
    public ResponseEntity<List<InventarioSucursalDTO>> obtenerTodoElInventario() {
        return ResponseEntity.ok(inventarioService.findAll());
    }

    @GetMapping("/sucursal/{sucursalId}")
    public ResponseEntity<List<InventarioSucursalDTO>> obtenerInventarioPorSucursal(
            @PathVariable Long sucursalId
    ) {
        return ResponseEntity.ok(inventarioService.findBySucursalId(sucursalId));
    }

    @GetMapping("/sucursal/{sucursalId}/detallado")
    public ResponseEntity<List<InventarioMedicamentoDTO>> obtenerInventarioDetalladoPorSucursal(@PathVariable Long sucursalId) {
        List<InventarioMedicamentoDTO> inventarioDetallado = inventarioService.obtenerInventarioDetalladoPorSucursal(sucursalId);
        return ResponseEntity.ok(inventarioDetallado);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<InventarioSucursalDTO>> obtenerInventariosActivos() {
        return ResponseEntity.ok(inventarioService.findAllActivos());
    }

    @GetMapping("/inactivos")
    public ResponseEntity<List<InventarioSucursalDTO>> obtenerInventariosInactivos() {
        return ResponseEntity.ok(inventarioService.findAllInactivos());
    }

    // ========================
    // POST
    // ========================

    @PostMapping
    public ResponseEntity<InventarioSucursalDTO> agregarStock(
            @Valid @RequestBody InventarioSucursalDTO inventarioDTO
    ) {
        try {
            Optional<MedicamentosDTO> medicamento =
                    medicamentosClienteRest.buscarPorId(inventarioDTO.getIdMedicamento());

            if (medicamento.isEmpty()) {
                throw new MedicamentoNotFoundException(
                        "Medicamento con ID " + inventarioDTO.getIdMedicamento() + " no encontrado."
                );
            }

            InventarioSucursalDTO guardado = inventarioService.save(inventarioDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);

        } catch (FeignException.NotFound e) {
            throw new MedicamentoNotFoundException(
                    "Medicamento con ID " + inventarioDTO.getIdMedicamento() + " no encontrado en el catálogo."
            );
        }
    }

    // ========================
    // PUT (CORREGIDO)
    // ========================

    @PutMapping("/{inventarioId}")
    public ResponseEntity<InventarioSucursalDTO> actualizarStock(
            @PathVariable Long inventarioId,
            @RequestParam Integer cantidad
    ) {
        InventarioSucursalDTO actualizado =
                inventarioService.updateStock(inventarioId, cantidad);

        return ResponseEntity.ok(actualizado);
    }

    // ========================
    // DELETE
    // ========================

    @DeleteMapping("/logico/{id}")
    public ResponseEntity<Void> eliminarInventarioLogico(@PathVariable Long id) {
        inventarioService.deleteLogicoById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/fisico/{id}")
    public ResponseEntity<Void> eliminarInventarioFisico(@PathVariable Long id) {
        inventarioService.deleteFisicoById(id);
        return ResponseEntity.noContent().build();
    }

    // ========================
    // PATCH
    // ========================

    @PatchMapping("/activar/{id}")
    public ResponseEntity<InventarioSucursalDTO> activarInventario(@PathVariable Long id) {
        return ResponseEntity.ok(inventarioService.activarById(id));
    }

    // Endpoint para consultar stock (usado por Ventas antes de confirmar)
    @GetMapping("/stock/{medicamentoId}/{sucursalId}")
    public ResponseEntity<Integer> obtenerStockActual(
            @PathVariable Long medicamentoId,
            @PathVariable Long sucursalId) {
        return ResponseEntity.ok(inventarioService.consultarStock(medicamentoId, sucursalId));
    }

    // Endpoint para descontar (usado por Ventas al finalizar la compra)
    @PostMapping("/descontar")
    public ResponseEntity<Void> descontarStock(@RequestBody StockRequestDTO dto) {
        inventarioService.descontarStock(dto.getMedicamentoId(), dto.getSucursalId(), dto.getCantidad());
        return ResponseEntity.ok().build();
    }
}
