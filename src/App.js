// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css';
import Producto from './components/productos';
import Cliente from './components/clientes';
import Venta from './components/ventas';

function App() {
  // Estados para productos
  const [formulario, setFormulario] = useState({ nombre: '', precio: '', stock: '', fecha: '' });
  const [productoEditar, setProductoEditar] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para clientes
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Estados para ventas
  const [carrito, setCarrito] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    cargarProductos();
    cargarClientes();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/productos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error.response || error.message);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los productos' });
    } finally {
      setLoading(false);
    }
  };

  const cargarClientes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/clientes');
      setClientes(res.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error.response || error.message);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los clientes' });
    }
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: '#f0f8ff', padding: '2rem' }}>
      <div className="row mb-4">
        {/* Componente Cliente */}
        <Cliente 
          clientes={clientes} 
          setClientes={setClientes} 
          busquedaCliente={busquedaCliente} 
          setBusquedaCliente={setBusquedaCliente} 
          setClienteSeleccionado={setClienteSeleccionado} 
        />
        
        {/* Componente Producto */}
        <Producto 
          productos={productos} 
          setProductos={setProductos} 
          loading={loading} 
          setLoading={setLoading} 
          busquedaProducto={busquedaProducto} 
          setBusquedaProducto={setBusquedaProducto} 
        />
      </div>
      
      {/* Componente Venta */}
      <Venta 
        productos={productos} 
        clientes={clientes} 
        clienteSeleccionado={clienteSeleccionado} 
        setClienteSeleccionado={setClienteSeleccionado} 
        busquedaProducto={busquedaProducto} 
        setBusquedaProducto={setBusquedaProducto} 
      />
    </div>
  );
}

export default App;