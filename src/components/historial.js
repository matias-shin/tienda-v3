// src/components/historial.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Card, Row, Col } from 'react-bootstrap';

const Historial = () => {
  // Estados para almacenar datos
  const [ventas, setVentas] = useState([]);
  const [clientesTop, setClientesTop] = useState([]);
  const [productosTop, setProductosTop] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de ventas al montar el componente
  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/ventas');
        setVentas(res.data);
        calcularTopClientes(res.data);
        calcularTopProductos(res.data);
      } catch (error) {
        console.error('Error al cargar ventas:', error.response || error.message);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar las ventas' });
      } finally {
        setLoading(false);
      }
    };

    cargarVentas();
  }, []);

  // Calcular los clientes con más compras
  const calcularTopClientes = (ventas) => {
    const clientes = {};

    ventas.forEach(venta => {
      const clienteId = venta.clienteId; // Asumiendo que cada venta tiene un clienteId
      clientes[clienteId] = (clientes[clienteId] || 0) + 1;
    });

    const clientesOrdenados = Object.entries(clientes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Tomar los primeros 5

    setClientesTop(clientesOrdenados);
  };

  // Calcular los productos más vendidos
  const calcularTopProductos = (ventas) => {
    const productos = {};

    ventas.forEach(venta => {
      const productoId = venta.productoId; // Asumiendo que cada venta tiene un productoId
      productos[productoId] = (productos[productoId] || 0) + 1;
    });

    const productosOrdenados = Object.entries(productos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Tomar los primeros 10

    setProductosTop(productosOrdenados);
  };

  return (
    <div className="container mt-5">
      <h2>Historial de Ventas</h2>
      <Row>
        {/* Columna izquierda: Top 5 clientes */}
        <Col md={6}>
          <Card>
            <Card.Header>Top 5 Clientes</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <ul>
                  {clientesTop.map(([id, cantidad], index) => (
                    <li key={index}>
                      Cliente {id} - Compras: {cantidad}
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Columna derecha: Top 10 productos */}
        <Col md={6}>
          <Card>
            <Card.Header>Top 10 Productos</Card.Header>
            <Card.Body>
              {loading ? (
                <p>Cargando...</p>
              ) : (
                <ul>
                  {productosTop.map(([id, cantidad], index) => (
                    <li key={index}>
                      Producto {id} - Vendidos: {cantidad}
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Historial;