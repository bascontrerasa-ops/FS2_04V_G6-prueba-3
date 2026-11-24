package cl.duoc.pasteleria.repository;

import cl.duoc.pasteleria.model.Pedido;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @EntityGraph(attributePaths = {"usuario", "detalles"})
    List<Pedido> findAllByUsuario_EmailOrderByFechaCreacionDesc(String email);

    @EntityGraph(attributePaths = {"usuario", "detalles"})
    List<Pedido> findAllByOrderByFechaCreacionDesc();

    @EntityGraph(attributePaths = {"usuario", "detalles"})
    Optional<Pedido> findWithUsuarioAndDetallesById(Long id);

    boolean existsByUsuario_Id(Long usuarioId);
}
