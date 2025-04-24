import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/productos';

function App() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    stock: ''
  });

  // Obtener productos al cargar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const res = await axios.get(API_URL);
    setProductos(res.data);
  };

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const crearProducto = async () => {
    await axios.post(API_URL, formulario);
    setFormulario({ nombre: '', precio: '', stock: '' });
    cargarProductos();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Inventario</h1>
      <input
        name="nombre"
        placeholder="Nombre"
        value={formulario.nombre}
        onChange={manejarCambio}
      />
      <input
        name="precio"
        placeholder="Precio"
        type="number"
        value={formulario.precio}
        onChange={manejarCambio}
      />
      <input
        name="stock"
        placeholder="Stock"
        type="number"
        value={formulario.stock}
        onChange={manejarCambio}
      />
      <button onClick={crearProducto}>Agregar</button>

      <ul>
        {productos.map(p => (
          <li key={p._id}>
            {p.nombre} - S/{p.precio} - Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
