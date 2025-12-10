package espe.edu.ec.mscatalogo.models.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescripcionDTO {

    private Long id;

    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;

    @NotNull(message = "El ID del medicamento es obligatorio")
    private Long medicamentoId;

    @NotBlank(message = "El nombre del médico es obligatorio")
    @Size(min = 3, max = 200, message = "El nombre del médico debe tener entre 3 y 200 caracteres")
    private String nombreMedico;

    @Size(max = 50, message = "El número de licencia no debe exceder 50 caracteres")
    private String numeroLicenciaMedico;

    @NotBlank(message = "El diagnóstico es obligatorio")
    @Size(min = 5, max = 500, message = "El diagnóstico debe tener entre 5 y 500 caracteres")
    private String diagnostico;

    @NotBlank(message = "Las indicaciones son obligatorias")
    @Size(min = 5, max = 500, message = "Las indicaciones deben tener entre 5 y 500 caracteres")
    private String indicaciones;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    @Max(value = 1000, message = "La cantidad no puede exceder 1000")
    private Integer cantidad;

    @NotNull(message = "La fecha de emisión es obligatoria")
    @PastOrPresent(message = "La fecha de emisión no puede ser futura")
    private LocalDate fechaEmision;

    @NotNull(message = "La fecha de vencimiento es obligatoria")
    @Future(message = "La fecha de vencimiento debe ser futura")
    private LocalDate fechaVencimiento;

    private Boolean activo;

    // Campos adicionales para respuestas (no para crear/actualizar)
    private String clienteNombre;
    private String medicamentoNombre;

}