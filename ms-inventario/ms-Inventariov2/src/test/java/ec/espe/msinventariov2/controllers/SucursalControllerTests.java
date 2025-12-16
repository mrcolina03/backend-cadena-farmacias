package ec.espe.msinventariov2.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import ec.espe.msinventariov2.models.dto.SucursalDTO;
import ec.espe.msinventariov2.services.sucursal.SucursalService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SucursalController.class)
public class SucursalControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SucursalService sucursalService;

    @MockBean
    private ec.espe.msinventariov2.services.InventarioSucursal.InventarioSucursalService inventarioSucursalService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testListarSucursalesActivas() throws Exception {
        SucursalDTO sucursal1 = new SucursalDTO();
        sucursal1.setId(1L);
        sucursal1.setNombre("Sucursal Norte");
        sucursal1.setEstado("ACTIVO");

        SucursalDTO sucursal2 = new SucursalDTO();
        sucursal2.setId(2L);
        sucursal2.setNombre("Sucursal Centro");
        sucursal2.setEstado("ACTIVO");

        List<SucursalDTO> sucursales = Arrays.asList(sucursal1, sucursal2);

        when(sucursalService.findAllActivas()).thenReturn(sucursales);

        mockMvc.perform(get("/api/inventario/sucursales"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].nombre").value("Sucursal Norte"));
    }

    @Test
    void testObtenerSucursalPorId() throws Exception {
        SucursalDTO sucursal = new SucursalDTO();
        sucursal.setId(1L);
        sucursal.setNombre("Sucursal Test");

        when(sucursalService.findById("1")).thenReturn(sucursal);

        mockMvc.perform(get("/api/inventario/sucursales/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Sucursal Test"));
    }

    @Test
    void testCrearSucursal() throws Exception {
        SucursalDTO sucursalDTO = new SucursalDTO();
        sucursalDTO.setNombre("Nueva Sucursal");
        sucursalDTO.setDireccion("Calle Falsa 123");
        sucursalDTO.setCiudad("Springfield");

        SucursalDTO sucursalGuardada = new SucursalDTO();
        sucursalGuardada.setId(1L);
        sucursalGuardada.setNombre("Nueva Sucursal");

        when(sucursalService.save(any(SucursalDTO.class))).thenReturn(sucursalGuardada);

        mockMvc.perform(post("/api/inventario/sucursales")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sucursalDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nombre").value("Nueva Sucursal"));
    }

    @Test
    void testActualizarSucursal() throws Exception {
        SucursalDTO sucursalDTO = new SucursalDTO();
        sucursalDTO.setNombre("Sucursal Actualizada");

        when(sucursalService.update(anyString(), any(SucursalDTO.class))).thenReturn(sucursalDTO);

        mockMvc.perform(put("/api/inventario/sucursales/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sucursalDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Sucursal Actualizada"));
    }

    @Test
    void testEliminarSucursal() throws Exception {
        mockMvc.perform(delete("/api/inventario/sucursales/1"))
                .andExpect(status().isNoContent());
    }
}

