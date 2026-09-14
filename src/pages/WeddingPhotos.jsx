import React, { useState, useRef } from 'react';
import { Camera, Plus } from 'lucide-react';
import { Container, Row, Col, Button, Spinner, Card, Navbar } from 'react-bootstrap';
import { peticionService, peticionServiceFile, methods } from '../services/api_servis'
import { useEffect } from 'react';
import { io } from 'socket.io-client'
import VisualizadorModal from '../components/wedding_photos/ViewModal'
import PapelTapizCabecera from '../assets/papel-tapiz-cabecera.png'

const socket = io(import.meta.env.VITE_API_URL, {
    transports: ['polling', 'websocket'],
    withCredentials: true,
    upgrade: false,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000
})

export default function BodaFotos() {
    const [fotos, setFotos] = useState([]);
    const [subiendo, setSubiendo] = useState(false);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [fotoIdActiva, setFotoIdActiva] = useState(null);

    const manejarArchivo = async (event) => {
        const archivos = event.target.files
        const MAX_FOTOS = import.meta.env.VITE_MAX_FOTOS;

        if (!archivos) return
        if (!archivos.length) return

        if (archivos.length > MAX_FOTOS) {
            alert(`La cantidad maxima de archivos por subir es de ${MAX_FOTOS}`)
            event.target.value = ""
            return
        }

        const tiposPermitidos = import.meta.env.VITE_TIPOS_ARCHIVOS.split(',')
        const bandera = [...archivos].filter(f => tiposPermitidos.includes(f.type)).length === archivos.length

        if (!bandera) {
            alert('Por favor, selecciona un archivo válido (JPG, JPEG, PNG o GIF).')
            event.target.value = ""
            return
        }

        await subirAGoogleDrive([...archivos]);
    };

    const subirAGoogleDrive = async (archivos) => {
        setSubiendo(true);
        const formData = new FormData();
        archivos.forEach(e => {
            formData.append('foto', e);
        })

        peticionServiceFile('ggd/upload-photo', methods.POST, formData)
            .catch((error) => {
                console.error('Error de red:', error);
                alert('Error de conexión con el servidor.');
            }).finally(() => {
                setSubiendo(false)
            })
    };

    const mostrarFotos = (isResetFotos = false) => {
        if (!isResetFotos)
            setFotos([])
        peticionService('ggd/view-photos', methods.GET)
            .then((response) => {
                let fots = response
                fots.sort((a, b) => b.name.localeCompare(a.name))
                if (isResetFotos) setFotos([])
                setFotos(fots)
            }).catch((error) => { console.log(error) })
    }

    const abrirVisualizador = (id) => {
        setFotoIdActiva(id)
        setModalAbierto(true)
    }

    useEffect(() => {
        mostrarFotos()

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // 'smooth' hace un deslizamiento suave, si prefieres instantáneo usa 'auto'
        })
    }, [])

    useEffect(() => {
        socket.on('connect', () => {
            console.log('✅ ¡Frontend conectado');
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Error de conexión con el WebSocket:', error.message);
        });

        socket.on('boda:nuevas-fotos', (escucha) => {
            mostrarFotos(true)
        })

        return () => {
            socket.off('boda:nuevas-fotos')
        }
    }, [])

    return (
        <div className="d-flex flex-column min-vh-100 bg-white" style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.69) 0%, rgba(114, 47, 55, 0.79) 100%)',
            backgroundAttachment: 'fixed'
        }}>
            <Navbar bg="light" className="border-bottom p-3 sticky-top shadow-sm flex-column"
                style={{
                    backgroundImage: `url(${PapelTapizCabecera})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    maxHeight: '140px'
                }}>
                <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.66)',
                        zIndex: 1
                    }}
                />
                <Container className="position-relative py-3 flex-column text-center h-100 justify-content-center" style={{ zIndex: 2 }}>
                    <h1 className="h4 mb-3 fw-bold text-center" style={{ color: '#581845' }}>Fotos de nuestra boda K&R</h1>

                    <div className="d-flex justify-content-center gap-3">
                        <Button
                            variant="outline-primary"
                            onClick={() => cameraInputRef.current.click()}
                            className="rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm"
                            disabled={subiendo}
                            style={{
                                width: '50px', height: '50px',
                                backgroundColor: 'transparent',
                                color: '#581845',
                                border: '2px solid #581845',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                if (!subiendo) {
                                    e.currentTarget.style.backgroundColor = '#581845';
                                    e.currentTarget.style.color = '#ffffff';
                                }
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#581845';
                            }}
                        >
                            <Camera size={22} />
                        </Button>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif"
                            capture="environment"
                            ref={cameraInputRef}
                            className="d-none"
                            onChange={manejarArchivo}
                            multiple
                        />

                        <Button
                            variant="primary"
                            onClick={() => fileInputRef.current.click()}
                            className="rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm"
                            disabled={subiendo}
                            style={{
                                width: '50px', height: '50px',
                                backgroundColor: '#581845', // Color Vino Sólido
                                border: '2px solid #581845',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                if (!subiendo) e.currentTarget.style.backgroundColor = '#421133'; // Vino más oscuro al hacer hover
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#581845';
                            }}
                        >
                            <Plus size={22} />
                        </Button>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif"
                            ref={fileInputRef}
                            className="d-none"
                            onChange={manejarArchivo}
                            multiple
                        />
                    </div>

                    {subiendo && (
                        <div className="d-flex align-items-center justify-content-center mt-3 text-primary small fw-semibold">
                            <Spinner animation="border" size="sm" className="me-2" />
                            Subiendo foto a la nube...
                        </div>
                    )}
                </Container>
            </Navbar>

            <Container className="flex-grow-1 py-4">
                {fotos.length === 0 ? (
                    <div className="text-center text-muted my-5 py-5">
                        <p className="fs-5 mb-1">El lienzo está en blanco.</p>
                        <p className="small text-muted">¡Sé el primero en capturar y compartir un recuerdo!</p>
                    </div>
                ) : (
                    <Row className="g-3">
                        {fotos.map((fotoUrl, index) => (
                            <Col xs={6} sm={4} md={3} lg={2} key={index}>
                                <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                                    <Card.Img
                                        onClick={() => abrirVisualizador(fotoUrl.id)}
                                        variant="top"
                                        src={`${import.meta.env.VITE_PART_URL_FOTO.replace(/\{([^}]+)\}/g, (match, clave) => {
                                            return fotoUrl[clave] !== undefined ? fotoUrl[clave] : match;
                                        })}`}
                                        alt={`Boda recuerdo ${index}`}
                                        style={{ height: '140px', objectFit: 'cover' }}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            <VisualizadorModal
                show={modalAbierto}
                onHide={() => setModalAbierto(false)}
                fotoIdActiva={fotoIdActiva}
                listaFotos={fotos}
                onCambiarFoto={(id) => setFotoIdActiva(id)}
            />

        </div>
    );
}