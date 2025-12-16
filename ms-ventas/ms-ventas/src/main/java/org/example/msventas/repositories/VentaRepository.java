package org.example.msventas.repositories;

import org.example.msventas.models.entities.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta,Long> {
    List<Venta> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta);
}
