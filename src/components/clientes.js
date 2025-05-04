// src/components/Cliente.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CLIENTES_API = 'http://localhost:3000/clientes';

const Cliente = ({ clientes, setClientes, busquedaCliente, setBusquedaCliente, setClienteSeleccionado }) => {
  // Cargar clientes
  const cargarClientes = async () => {
    try {
      const res = await axios.get(CLIENTES_API);
      setClientes(res.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error.response || error.message);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los clientes' });
    }
  };

  // Agregar cliente
  const agregarCliente = async () => {
    const { value: nombre } = await Swal.fire({
      title: 'Nuevo Cliente',
      input: 'text',
      inputLabel: 'Nombre del cliente',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return '¡Necesitas ingresar un nombre!';
      }
    });
    if (nombre) {
      try {
        await axios.post(CLIENTES_API, { nombre });
        Swal.fire({ icon: 'success', title: 'Cliente agregado' });
        cargarClientes();
      } catch (error) {
        console.error('Error al agregar cliente:', error);
        Swal.fire({ icon: 'error', title: 'Error al guardar cliente' });
      }
    }
  };

  return (
    <div className="col-md-6">
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5>Clientes</h5>
          <button 
            className="btn btn-sm btn-success"
            onClick={agregarCliente}
          >
            <i className="fas fa-plus"></i> Agregar
          </button>
        </div>
        <div className="card-body">
          <input 
            type="text"
            placeholder="Buscar cliente..."
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
            className="form-control mb-2"
          />
          {clientes
            .filter(cliente => cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()))
            .map(cliente => (
              <div key={cliente._id} className="d-flex justify-content-between mb-2">
                <span>{cliente.nombre}</span>
                <div>
                  <button 
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => setClienteSeleccionado(cliente)}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => Swal.fire({
                      title: '¿Eliminar cliente?',
                      showCancelButton: true,
                      confirmButtonText: 'Sí',
                      cancelButtonText: 'Cancelar'
                    }).then(result => {
                      if (result.isConfirmed) {
                        // Lógica de eliminación
                      }
                    })}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Cliente;