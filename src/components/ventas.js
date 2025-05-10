import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Venta = ({ productos, clientes, clienteSeleccionado, setClienteSeleccionado, busquedaProducto, setBusquedaProducto }) => {
  const [carrito, setCarrito] = useState([]);

  // Agregar al carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    if (cantidad > producto.stock) {
      Swal.fire({ icon: 'error', title: 'Stock insuficiente' });
      return;
    }
    const itemExistente = carrito.find(item => item._id === producto._id);
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      setCarrito([...carrito, { ...producto, cantidad }]);
    }
  };

  // Eliminar del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item._id !== id));
  };

  // Finalizar venta
  const finalizarVenta = async () => {
    if (!clienteSeleccionado || carrito.length === 0) {
      Swal.fire({ icon: 'error', title: 'Datos incompletos' });
      return;
    }
    try {
      await axios.post('http://localhost:3000/ventas', {
        cliente: clienteSeleccionado,
        items: carrito
      });
      Swal.fire({ icon: 'success', title: 'Venta registrada' });
      setCarrito([]);
      setClienteSeleccionado(null);
    } catch (error) {
      console.error('Error al registrar venta:', error);
      Swal.fire({ icon: 'error', title: 'Error al procesar venta' });
    }
  };

  // Cálculos de totales
  const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  const impuesto = subtotal * 0.18;
  const total = subtotal + impuesto;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white text-center">
        <h4><i className="fas fa-shopping-cart"></i> Registro de Ventas</h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <h5>Selección de Cliente</h5>
            <select 
              className="form-select mb-3"
              value={clienteSeleccionado?.nombre || ''}
              onChange={(e) => setClienteSeleccionado(
                clientes.find(cliente => cliente.nombre === e.target.value)
              )}
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map(cliente => (
                <option key={cliente._id} value={cliente.nombre}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <h5>Catálogo de Productos</h5>
            <div className="input-group mb-3">
              <input 
                type="text"
                placeholder="Buscar producto..."
                className="form-control"
                value={busquedaProducto}
                onChange={(e) => setBusquedaProducto(e.target.value)}
              />
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setBusquedaProducto('')}
              >
                Limpiar
              </button>
            </div>
            {productos
              .filter(producto => producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()))
              .map(producto => (
                <div key={producto._id} className="border p-2 mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{producto.nombre}</span>
                    <span>S/. {producto.precio.toFixed(2)}</span>
                  </div>
                  <div className="mt-2">
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => agregarAlCarrito(producto, 1)}
                    >
                      <i className="fas fa-plus"></i> Agregar
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className="col-md-4">
            <h5>Resumen de Venta</h5>
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <td>Subtotal:</td>
                  <td className="text-end">S/. {subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>IGV (18%):</td>
                  <td className="text-end">S/. {impuesto.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><b>Total:</b></td>
                  <td className="text-end"><b>S/. {total.toFixed(2)}</b></td>
                </tr>
              </tbody>
            </table>
            <button 
              className="btn btn-primary w-100 mt-3"
              onClick={finalizarVenta}
            >
              Finalizar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venta;