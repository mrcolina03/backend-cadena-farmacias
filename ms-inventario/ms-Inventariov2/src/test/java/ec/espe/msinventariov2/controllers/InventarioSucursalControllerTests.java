package ec.espe.msinventariov2.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import ec.espe.msinventariov2.clientes.MedicamentosClienteRest;
import ec.espe.msinventariov2.models.dto.InventarioSucursalDTO;
import ec.espe.msinventariov2.models.dto.MedicamentosDTO;
import ec.espe.msinventariov2.services.InventarioSucursal.InventarioSucursalService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(InventarioSucursalController.class)
public class InventarioSucursalControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InventarioSucursalService inventarioService;

    @MockBean
    private MedicamentosClienteRest medicamentosClienteRest;

    @MockBean
    private ec.espe.msinventariov2.services.sucursal.SucursalService sucursalService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testObtenerInventarioPorSucursal() throws Exception {
        InventarioSucursalDTO inventarioDTO = new InventarioSucursalDTO();
        inventarioDTO.setId(1L);
        inventarioDTO.setIdSucursal(1L);
        inventarioDTO.setIdMedicamento(100L);
        inventarioDTO.setCantidad(50);

        when(inventarioService.findBySucursalId(1L)).thenReturn(Collections.singletonList(inventarioDTO));

        mockMvc.perform(get("/api/inventario/inventario-sucursal/sucursal/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.size()").value(1))
                .andExpect(jsonPath("$[0].cantidad").value(50));
    }

    @Test
    void testAgregarStock() throws Exception {
        InventarioSucursalDTO inventarioDTO = new InventarioSucursalDTO();
        inventarioDTO.setIdSucursal(1L);
        inventarioDTO.setIdMedicamento(101L);
        inventarioDTO.setCantidad(20);
        inventarioDTO.setStockMinimo(5);

        MedicamentosDTO medMock = new MedicamentosDTO();
        medMock.setId(101L);
        medMock.setNombre("Medicamento de Prueba");

        InventarioSucursalDTO inventarioGuardado = new InventarioSucursalDTO();
        inventarioGuardado.setId(2L);
        inventarioGuardado.setIdSucursal(1L);
        inventarioGuardado.setIdMedicamento(101L);
        inventarioGuardado.setCantidad(20);

        when(medicamentosClienteRest.buscarPorId(anyLong())).thenReturn(Optional.of(medMock));
        when(inventarioService.save(any(InventarioSucursalDTO.class))).thenReturn(inventarioGuardado);

        mockMvc.perform(post("/api/inventario/inventario-sucursal")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inventarioDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.cantidad").value(20));
    }

    @Test
    void testActualizarStock() throws Exception {
        InventarioSucursalDTO inventarioActualizado = new InventarioSucursalDTO();
        inventarioActualizado.setId(1L);
        inventarioActualizado.setCantidad(75);

        when(inventarioService.updateStock(1L, 75)).thenReturn(inventarioActualizado);

        mockMvc.perform(put("/api/inventario/inventario-sucursal/1")
                .param("cantidad", "75"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cantidad").value(75));
    }

    @Test
    void testEliminarInventarioLogico() throws Exception {
        mockMvc.perform(delete("/api/inventario/inventario-sucursal/logico/1"))
                .andExpect(status().isNoContent());
    }
}

