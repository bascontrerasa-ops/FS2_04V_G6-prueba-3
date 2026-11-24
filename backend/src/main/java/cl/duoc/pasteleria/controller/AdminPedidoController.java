package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.dto.ActualizarEstadoPedidoRequest;
import cl.duoc.pasteleria.dto.PedidoResponse;
import cl.duoc.pasteleria.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/** Operaciones de consulta y gestión de pedidos reservadas al administrador. */
@RestController
@RequestMapping("/api/admin/pedidos")
public class AdminPedidoController {

    private final PedidoService pedidoService;

    public AdminPedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<PedidoResponse> listarPedidos() {
        return pedidoService.listarTodos();
    }

    @PatchMapping("/{id}/estado")
    public PedidoResponse actualizarEstado(@PathVariable Long id,
                                           @Valid @RequestBody ActualizarEstadoPedidoRequest solicitud) {
        return pedidoService.actualizarEstado(id, solicitud.estado());
    }
}
