// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './App.css';

// Componentes de productos, clientes y ventas
import Producto from './components/productos';
import Cliente from './components/clientes';
import Venta from './components/ventas';

// Componentes de rutas (nuevos)
import Historial from './components/historial';
import Estadisticas from './components/estadisticas';

// Importar componentes de React Bootstrap
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom'; // Importar React Router

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
    <>
      {/* Barra de navegación */}
      <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">Tienda Matías</Navbar.Brand> {/* Enlace a la página principal */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/historial">Historial</Nav.Link> {/* Enlace a Historial */}
              <Nav.Link as={Link} to="/estadisticas">Estadísticas</Nav.Link> {/* Enlace a Estadísticas */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido dinámico según la ruta */}
      <Container className="mt-5" style={{ backgroundColor: '#f0f8ff', padding: '2rem' }}>
        <Routes>
          {/* Ruta principal (página de inicio) */}
          <Route path="/" element={
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
          } />

          {/* Ruta para Historial */}
          <Route path="/historial" element={<Historial />} />

          {/* Ruta para Estadísticas */}
          <Route path="/estadisticas" element={<Estadisticas />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;