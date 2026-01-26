package org.edu.espe.msusuarios.dto;

public class RoleDTO {

    private Long id;
    private String nombre;

    // Constructor vacío (OBLIGATORIO para Jackson)
    public RoleDTO() {
    }

    // Constructor con campos
    public RoleDTO(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
