package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.model.Usuario;
import cl.duoc.pasteleria.repository.UsuarioRepository;
import cl.duoc.pasteleria.repository.PedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** Endpoints de administración de cuentas de clientes. */
@RestController
@RequestMapping("/api/admin/usuarios")
public class AdminUsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PedidoRepository pedidoRepository;

    public AdminUsuarioController(UsuarioRepository usuarioRepository, PedidoRepository pedidoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.pedidoRepository = pedidoRepository;
    }

    /** Devuelve únicamente cuentas de clientes y nunca incluye contraseñas. */
    @GetMapping
    public List<UsuarioResumen> listarClientes() {
        return usuarioRepository.findAllByRolIgnoreCase("cliente").stream()
                .map(usuario -> new UsuarioResumen(
                        usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol()))
                .toList();
    }

    /** Un administrador solo puede eliminar cuentas de clientes, nunca otras cuentas administrativas. */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCliente(@PathVariable Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        if (!"cliente".equalsIgnoreCase(usuario.getRol())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Solo se pueden eliminar cuentas de clientes"));
        }

        if (pedidoRepository.existsByUsuario_Id(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "No se puede eliminar esta cuenta porque tiene pedidos asociados"));
        }

        usuarioRepository.delete(usuario);
        return ResponseEntity.noContent().build();
    }

    public record UsuarioResumen(Long id, String nombre, String email, String rol) {}
}
