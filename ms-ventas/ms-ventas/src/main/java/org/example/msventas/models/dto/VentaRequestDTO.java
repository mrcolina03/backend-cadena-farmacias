package org.example.msventas.models.dto;

import java.util.List;

public class VentaRequestDTO {
    private Long clienteId;
    private Long sucursalId;
    private List<DetalleVentaDTO> items;

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getSucursalId() {
        return sucursalId;
    }

    public void setSucursalId(Long sucursalId) {
        this.sucursalId = sucursalId;
    }

    public List<DetalleVentaDTO> getItems() {
        return items;
    }

    public void setItems(List<DetalleVentaDTO> items) {
        this.items = items;
    }
}
