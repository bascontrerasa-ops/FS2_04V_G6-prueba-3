package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.dto.CrearPedidoRequest;
import cl.duoc.pasteleria.dto.PedidoResponse;
import cl.duoc.pasteleria.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    /** Confirma la compra del cliente autenticado y la persiste en la base de datos. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse crear(@AuthenticationPrincipal Jwt jwt,
                                @Valid @RequestBody CrearPedidoRequest solicitud) {
        return pedidoService.crearPedido(jwt.getSubject(), solicitud);
    }

    /** Un cliente solo puede consultar su propio historial. */
    @GetMapping
    public List<PedidoResponse> misPedidos(@AuthenticationPrincipal Jwt jwt) {
        return pedidoService.listarPedidosCliente(jwt.getSubject());
    }
}
