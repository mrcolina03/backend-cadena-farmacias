package espe.edu.ec.mscatalogo.models.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO {

    private Long id;

    @NotBlank(message = "La cédula es obligatoria")
    @Size(min = 10, max = 20, message = "La cédula debe tener entre 10 y 20 caracteres")
    @Pattern(regexp = "^[0-9]+$", message = "La cédula debe contener solo números")
    private String cedula;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(min = 2, max = 100, message = "Los nombres deben tener entre 2 y 100 caracteres")
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(min = 2, max = 100, message = "Los apellidos deben tener entre 2 y 100 caracteres")
    private String apellidos;

    @Email(message = "El email debe ser válido")
    @Size(max = 100, message = "El email no debe exceder 100 caracteres")
    private String email;

    @Pattern(regexp = "^[0-9]{7,20}$", message = "El teléfono debe contener entre 7 y 20 dígitos")
    private String telefono;

    @Size(max = 250, message = "La dirección no debe exceder 250 caracteres")
    private String direccion;

    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;

    @Pattern(regexp = "^(Masculino|Femenino|Otro)$", message = "El género debe ser Masculino, Femenino u Otro")
    private String genero;

    private Boolean activo;

}