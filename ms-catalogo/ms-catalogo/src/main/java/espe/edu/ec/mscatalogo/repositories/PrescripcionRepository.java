package espe.edu.ec.mscatalogo.repositories;

import espe.edu.ec.mscatalogo.models.entities.Prescripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescripcionRepository extends JpaRepository<Prescripcion, Long> {

    List<Prescripcion> findByActivoTrue();

    List<Prescripcion> findByClienteId(Long clienteId);

    List<Prescripcion> findByMedicamentoId(Long medicamentoId);

    List<Prescripcion> findByClienteIdAndActivoTrue(Long clienteId);

    @Query("SELECT p FROM Prescripcion p WHERE p.fechaVencimiento < :fecha AND p.activo = true")
    List<Prescripcion> findPrescripcionesVencidas(@Param("fecha") LocalDate fecha);

    @Query("SELECT p FROM Prescripcion p WHERE p.fechaVencimiento >= :fecha AND p.activo = true")
    List<Prescripcion> findPrescripcionesVigentes(@Param("fecha") LocalDate fecha);

    @Query("SELECT p FROM Prescripcion p WHERE p.cliente.id = :clienteId AND p.medicamento.id = :medicamentoId AND p.activo = true")
    List<Prescripcion> findByClienteAndMedicamento(@Param("clienteId") Long clienteId, @Param("medicamentoId") Long medicamentoId);

}