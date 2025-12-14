package ec.espe.msinventariov2.models.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Data
public class InventarioMedicamentoDTO {
    // Campos del Medicamento
    private Long idMedicamento;
    private String codigo;
    private String nombre;
    private String descripcion;
    private String laboratorio;
    private String principioActivo;
    private String presentacion;
    private BigDecimal precio;
    private Boolean requiereReceta;
    private LocalDate fechaVencimiento;

    // Campos del Inventario
    private Long idInventario;
    private Integer cantidad;
    private Integer stockMinimo;
    private String estadoInventario;
    private Date fechaActualizacion;
}

