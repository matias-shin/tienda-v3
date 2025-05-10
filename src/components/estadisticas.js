// src/components/estadisticas.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2'; // Para gráficos
import moment from 'moment'; // Para manejar fechas
import DatePicker from 'react-datepicker'; // Para selector de fechas
import 'react-datepicker/dist/react-datepicker.css';

const Estadisticas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para filtros
  const [filtroTiempo, setFiltroTiempo] = useState('dia'); // dia, semana, mes, año
  const [fechaInicio, setFechaInicio] = useState(moment().startOf('month').toDate());
  const [fechaFin, setFechaFin] = useState(new Date());

  // Datos para el gráfico
  const [dataGrafico, setDataGrafico] = useState({
    labels: [],
    datasets: [
      {
        label: 'Ventas',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  // Total de ventas
  const [totalVentas, setTotalVentas] = useState(0);

  // Cargar datos al montar el componente
  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/ventas');
        setVentas(res.data);
        actualizarGrafico(res.data);
      } catch (error) {
        console.error('Error al cargar ventas:', error.response || error.message);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar las ventas' });
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    cargarVentas();
  }, []);

  // Actualizar gráfico cuando cambien las fechas o las ventas
  useEffect(() => {
    if (ventas.length > 0) {
      actualizarGrafico(ventas);
    }
  }, [fechaInicio, fechaFin, ventas]);

  // Función para actualizar gráfico
  const actualizarGrafico = (ventas) => {
    let labels = [];
    let valores = {};

    // Filtrar por fecha
    const ventasFiltradas = ventas.filter(venta => 
      moment(venta.fecha).isBetween(fechaInicio, fechaFin, null, '[]')
    );

    // Agrupar por el filtro seleccionado
    switch (filtroTiempo) {
      case 'dia':
        ventasFiltradas.forEach(venta => {
          const key = moment(venta.fecha).format('YYYY-MM-DD');
          if (!labels.includes(key)) {
            labels.push(key);
            valores[key] = venta.monto;
          } else {
            valores[key] += venta.monto;
          }
        });
        break;
      case 'semana':
        ventasFiltradas.forEach(venta => {
          const key = moment(venta.fecha).week();
          if (!labels.includes(key)) {
            labels.push(key);
            valores[key] = venta.monto;
          } else {
            valores[key] += venta.monto;
          }
        });
        break;
      case 'mes':
        ventasFiltradas.forEach(venta => {
          const key = moment(venta.fecha).format('YYYY-MM');
          if (!labels.includes(key)) {
            labels.push(key);
            valores[key] = venta.monto;
          } else {
            valores[key] += venta.monto;
          }
        });
        break;
      case 'año':
        ventasFiltradas.forEach(venta => {
          const key = moment(venta.fecha).year();
          if (!labels.includes(key)) {
            labels.push(key);
            valores[key] = venta.monto;
          } else {
            valores[key] += venta.monto;
          }
        });
        break;
      default:
        break;
    }

    // Calcular total de ventas
    const total = Object.values(valores).reduce((acc, val) => acc + val, 0);
    setTotalVentas(total);

    // Preparar datos para el gráfico
    const dataLabels = labels.map(label => {
      switch (filtroTiempo) {
        case 'dia': return moment(label).format('DD/MM');
        case 'semana': return `Semana ${label}`;
        case 'mes': return moment(label).format('MMM YYYY');
        case 'año': return label;
        default: return label;
      }
    });

    const dataValores = dataLabels.map(label => valores[label] || 0);

    setDataGrafico({
      labels: dataLabels,
      datasets: [
        {
          label: 'Ventas',
          data: dataValores,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  // Manejar cambios en el filtro de tiempo
  const handleFiltroChange = (e) => {
    setFiltroTiempo(e.target.value);
  };

  // Manejar cambio de fechas
  const handleFechaChange = (dates) => {
    const [start, end] = dates;
    setFechaInicio(start);
    setFechaFin(end);
  };

  return (
    <div className="container mt-5">
      <h2>Estadísticas de Ventas</h2>
      <Row>
        {/* Filtros */}
        <Col md={4}>
          <Form>
            <Form.Group controlId="formFiltroTiempo">
              <Form.Label>Filtrar por:</Form.Label>
              <Form.Select value={filtroTiempo} onChange={handleFiltroChange}>
                <option value="dia">Día</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
                <option value="año">Año</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formFechas">
              <Form.Label>Rango de Fechas:</Form.Label>
              <DatePicker
                selected={fechaInicio}
                startDate={fechaInicio}
                endDate={fechaFin}
                onChange={handleFechaChange}
                selectsRange
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecciona un rango"
              />
            </Form.Group>
          </Form>
        </Col>

        {/* Gráfico y total */}
        <Col md={8}>
          <Card>
            <Card.Header>
              <Row>
                <Col md={6}>
                  <h5>Ventas Totales: S/ {totalVentas.toFixed(2)}</h5>
                </Col>
                <Col md={6} className="text-end">
                  <Button variant="primary" onClick={() => actualizarGrafico(ventas)}>
                    Actualizar
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p>Cargando datos...</p>
              ) : error ? (
                <p>Error: {error.message}</p>
              ) : (
                <Bar data={dataGrafico} options={{ maintainAspectRatio: false }} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Estadisticas;