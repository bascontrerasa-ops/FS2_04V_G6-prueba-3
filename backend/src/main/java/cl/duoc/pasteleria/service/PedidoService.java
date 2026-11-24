package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.CrearPedidoRequest;
import cl.duoc.pasteleria.dto.DetallePedidoResponse;
import cl.duoc.pasteleria.dto.PedidoResponse;
import cl.duoc.pasteleria.model.DetallePedido;
import cl.duoc.pasteleria.model.EstadoPedido;
import cl.duoc.pasteleria.model.Pedido;
import cl.duoc.pasteleria.model.Producto;
import cl.duoc.pasteleria.model.Usuario;
import cl.duoc.pasteleria.repository.PedidoRepository;
import cl.duoc.pasteleria.repository.ProductoRepository;
import cl.duoc.pasteleria.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         ProductoRepository productoRepository,
                         UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PedidoResponse crearPedido(String emailCliente, CrearPedidoRequest solicitud) {
        Usuario cliente = usuarioRepository.findByEmail(emailCliente)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La cuenta ya no está disponible"));

        // Se agrupan IDs repetidos y se vuelve a validar el máximo por producto en el servidor.
        Map<Long, Integer> cantidades = new LinkedHashMap<>();
        for (CrearPedidoRequest.Item item : solicitud.items()) {
            int nuevaCantidad = cantidades.getOrDefault(item.productoId(), 0) + item.cantidad();
            if (nuevaCantidad > 50) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "La cantidad máxima por producto es 50");
            }
            cantidades.put(item.productoId(), nuevaCantidad);
        }

        Map<Long, Producto> productos = new LinkedHashMap<>();
        for (Producto producto : productoRepository.findAllById(cantidades.keySet())) {
            productos.put(producto.getId(), producto);
        }
        if (productos.size() != cantidades.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Uno o más productos ya no están disponibles. Actualiza tu carrito.");
        }

        String observaciones = solicitud.observaciones() == null
                ? null : solicitud.observaciones().trim();
        if (observaciones != null && observaciones.isEmpty()) observaciones = null;

        Pedido pedido = new Pedido(cliente, LocalDateTime.now(), EstadoPedido.PENDIENTE, observaciones);
        long total = 0L;

        for (Map.Entry<Long, Integer> linea : cantidades.entrySet()) {
            Producto producto = productos.get(linea.getKey());
            long precio = producto.getPrecio().longValue();
            long subtotal;
            try {
                subtotal = Math.multiplyExact(precio, linea.getValue().longValue());
                total = Math.addExact(total, subtotal);
            } catch (ArithmeticException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El total del pedido excede el límite permitido");
            }

            pedido.agregarDetalle(new DetallePedido(
                    producto.getId(), producto.getNombre(), precio, linea.getValue(), subtotal));
        }

        pedido.setTotal(total);
        Pedido guardado = pedidoRepository.save(pedido);
        return convertir(guardado);
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarPedidosCliente(String emailCliente) {
        return pedidoRepository.findAllByUsuario_EmailOrderByFechaCreacionDesc(emailCliente)
                .stream().map(this::convertir).toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos() {
        return pedidoRepository.findAllByOrderByFechaCreacionDesc()
                .stream().map(this::convertir).toList();
    }

    @Transactional
    public PedidoResponse actualizarEstado(Long id, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findWithUsuarioAndDetallesById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existe el pedido solicitado"));
        pedido.setEstado(nuevoEstado);
        return convertir(pedidoRepository.save(pedido));
    }

    private PedidoResponse convertir(Pedido pedido) {
        List<DetallePedidoResponse> detalles = pedido.getDetalles().stream()
                .map(detalle -> new DetallePedidoResponse(
                        detalle.getId(), detalle.getProductoId(), detalle.getNombreProducto(),
                        detalle.getPrecioUnitario(), detalle.getCantidad(), detalle.getSubtotal()))
                .toList();

        return new PedidoResponse(
                pedido.getId(), pedido.getFechaCreacion(), pedido.getEstado(), pedido.getTotal(),
                pedido.getObservaciones(), pedido.getUsuario().getNombre(),
                pedido.getUsuario().getEmail(), detalles);
    }
}
