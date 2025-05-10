import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api/productos';

const Producto = ({ 
  productos, 
  setProductos, 
  loading, 
  setLoading, 
  busquedaProducto, 
  setBusquedaProducto 
}) => {
  const [formulario, setFormulario] = useState({ 
    nombre: '', 
    precio: '', 
    stock: '', 
    fecha: '' 
  });
  const [productoEditar, setProductoEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [imagen, setImagen] = useState(null); // Estado para la imagen

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setProductos(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error.response || error.message);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los productos' });
    } finally {
      setLoading(false);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarCambioImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const crearProducto = async () => {
    const { nombre, precio, stock, fecha } = formulario;
    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    
    if (!nombre.trim() || !soloLetras.test(nombre) || 
        !precio || isNaN(precio) || Number(precio) < 0 || 
        !stock || isNaN(stock) || Number(stock) < 0 || 
        !fecha) {
      Swal.fire({ icon: 'error', title: 'Datos inválidos', text: 'Verifica los campos ingresados.' });
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('precio', Number(precio));
    formData.append('stock', Number(stock));
    formData.append('fecha', new Date(fecha).toISOString());
    
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      let res;
      if (productoEditar) {
        res = await axios.put(`${API_URL}/${productoEditar._id}`, formData);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Producto actualizado', timer: 1500, showConfirmButton: false });
      } else {
        res = await axios.post(API_URL, formData);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Producto creado', timer: 1500, showConfirmButton: false });
      }
      setFormulario({ nombre: '', precio: '', stock: '', fecha: '' });
      setImagen(null);
      setProductoEditar(null);
      setMostrarFormulario(false);
      cargarProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error.response || error.message);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar el producto' });
    }
  };

  const eliminarProducto = async (id) => {
    const confirm = await Swal.fire({ 
      title: '¿Estás seguro?', 
      text: '¡Esta acción no se puede deshacer!', 
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonColor: '#3085d6', 
      cancelButtonColor: '#d33', 
      confirmButtonText: 'Sí, eliminar' 
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Producto eliminado', timer: 1500, showConfirmButton: false });
        cargarProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error.response || error.message);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el producto' });
      }
    }
  };

  const editarProducto = (producto) => {
    setFormulario({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      fecha: producto.fecha.split('T')[0]
    });
    setProductoEditar(producto);
    setMostrarFormulario(true);
  };

  const abrirNuevoProducto = () => {
    setFormulario({ nombre: '', precio: '', stock: '', fecha: '' });
    setImagen(null);
    setProductoEditar(null);
    setMostrarFormulario(true);
  };

  return (
    <div className="col-md-6">
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5>Productos</h5>
          <button className="btn btn-sm btn-success" onClick={abrirNuevoProducto}>
            <i className="fas fa-plus"></i> Agregar
          </button>
        </div>
        <div className="card-body">
          <input 
            type="text"
            placeholder="Buscar producto..."
            value={busquedaProducto}
            onChange={(e) => setBusquedaProducto(e.target.value)}
            className="form-control mb-2"
          />
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            productos
              .filter(producto => producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()))
              .map(producto => (
                <div key={producto._id} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    {producto.imagen && (
                      <img 
                        src={`http://localhost:3000/uploads/${producto.imagen}`} 
                        alt={producto.nombre} 
                        width="40" 
                        height="40" 
                        className="me-2 rounded"
                      />
                    )}
                    <span>{producto.nombre}</span>
                  </div>
                  <div>
                    <button 
                      className="btn btn-sm btn-warning me-1"
                      onClick={() => editarProducto(producto)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarProducto(producto._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {mostrarFormulario && (
        <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5>{productoEditar ? 'Editar Producto' : 'Nuevo Producto'}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  aria-label="Close" 
                  onClick={() => setMostrarFormulario(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>Nombre</label>
                      <input className="form-control" name="nombre" value={formulario.nombre} onChange={manejarCambio} />
                    </div>
                    <div className="form-group mb-3">
                      <label>Precio</label>
                      <input className="form-control" name="precio" type="number" value={formulario.precio} onChange={manejarCambio} />
                    </div>
                    <div className="form-group mb-3">
                      <label>Stock</label>
                      <input className="form-control" name="stock" type="number" value={formulario.stock} onChange={manejarCambio} />
                    </div>
                    <div className="form-group mb-3">
                      <label>Fecha de Adición</label>
                      <input className="form-control" name="fecha" type="date" value={formulario.fecha} onChange={manejarCambio} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>Imagen del Producto</label>
                      <input type="file" className="form-control" accept="image/*" onChange={manejarCambioImagen} />
                      <small className="text-muted">Formatos aceptados: JPG, PNG, JPEG</small>
                    </div>
                    {imagen && (
                      <div className="mt-3 text-center">
                        <img 
                          src={URL.createObjectURL(imagen)} 
                          alt="Vista previa" 
                          className="img-thumbnail" 
                          style={{ maxHeight: '200px' }}
                        />
                      </div>
                    )}
                    {productoEditar && productoEditar.imagen && !imagen && (
                      <div className="mt-3 text-center">
                        <img 
                          src={`http://localhost:3000/uploads/${productoEditar.imagen}`} 
                          alt={productoEditar.nombre} 
                          className="img-thumbnail" 
                          style={{ maxHeight: '200px' }}
                        />
                        <p className="mt-2 text-muted">Imagen actual</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={crearProducto}>
                  {productoEditar ? 'Actualizar' : 'Guardar'}
                </button>
                <button className="btn btn-secondary" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Producto;