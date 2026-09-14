import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function VisualizadorModal({ show, onHide, fotoIdActiva, listaFotos, onCambiarFoto }) {
    if (!show || !listaFotos || listaFotos.length === 0 || !fotoIdActiva) {
        return null;
    }

    // Encontrar el objeto de la foto actual basado en el ID activo
    const indexActual = listaFotos.findIndex(f => f.id === fotoIdActiva)
    const indexInverso = listaFotos.length - indexActual - 1
    const fotoActual = listaFotos[indexActual];

    // Extraer la URL de forma segura (funciona si es un objeto {url, id} o un string plano)
    const urlImagen = import.meta.env.VITE_PART_URL_FOTO_ORIGIN.replace(/\{([^}]+)\}/g, (match, clave) => {
        return fotoActual[clave] !== undefined ? fotoActual[clave] : match;
    })

    const manejarAnterior = (e) => {
        e.stopPropagation();
        if (listaFotos.length <= 1) return;

        // Navegación circular basada en la posición del ID
        const nuevoIndex = indexActual === 0 ? listaFotos.length - 1 : indexActual - 1
        const nuevoIndexInverso = listaFotos.length - nuevoIndex - 1
        const nuevaFoto = listaFotos[nuevoIndex];
        onCambiarFoto(nuevaFoto.id);
    };

    const manejarSiguiente = (e) => {
        e.stopPropagation();
        if (listaFotos.length <= 1) return;

        const nuevoIndex = indexActual === listaFotos.length - 1 ? 0 : indexActual + 1;
        const nuevoIndexInverso = listaFotos.length - nuevoIndex - 1
        const nuevaFoto = listaFotos[nuevoIndex];
        onCambiarFoto(nuevaFoto.id);
    };

    // Soporte para flechas del teclado en computadoras
    useEffect(() => {
        if (!show) return;
        const manejarTeclado = (e) => {
            if (e.key === 'ArrowLeft') manejarAnterior(e);
            if (e.key === 'ArrowRight') manejarSiguiente(e);
        };
        window.addEventListener('keydown', manejarTeclado);
        return () => window.removeEventListener('keydown', manejarTeclado);
    }, [show, indexActual, listaFotos]);

    if (!fotoActual) return null;

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            contentClassName="bg-transparent border-0 position-relative"
            backdropClassName="bg-dark opacity-90"
        >
            {/* Botón Cerrar */}
            <button
                onClick={onHide}
                className="btn text-white position-absolute top-0 end-0 m-3 z-3"
                style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '8px' }}
            >
                <X size={24} />
            </button>

            <Modal.Body className="p-0 d-flex align-items-center justify-content-center position-relative">

                {/* Flecha Izquierda */}
                <button
                    onClick={manejarAnterior}
                    className="btn text-white position-absolute start-0 m-3 z-3 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '50%', width: '45px', height: '45px' }}
                >
                    <ChevronLeft size={28} />
                </button>

                {/* Imagen Centrada */}
                <img
                    src={urlImagen}
                    alt="Boda ampliada"
                    className="img-fluid rounded shadow-lg"
                    style={{ maxHeight: '85vh', maxWidth: '100%', objectFit: 'contain' }}
                />

                {/* Flecha Derecha */}
                <button
                    onClick={manejarSiguiente}
                    className="btn text-white position-absolute end-0 m-3 z-3 d-flex align-items-center justify-content-center"
                    style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '50%', width: '45px', height: '45px' }}
                >
                    <ChevronRight size={28} />
                </button>

            </Modal.Body>
        </Modal>
    );
}
