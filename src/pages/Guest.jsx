import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Container, Row, Col, Card, Ratio, Alert, Button, Spinner } from 'react-bootstrap'
import '../components/guest/css/guest.css'
import { peticionService, methods } from "../services/api_servis"
import ErrorServidor from "../components/ErrorServer"
import GuestNotFount from "../components/guest/GuestNotFount"

function Guest() {
    const { id } = useParams()
    const navigate = useNavigate()

    const videoRef = useRef(null)
    const [isMuted, setIsMuted] = useState(true)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false); // Errores de servidor/red
    const [guest, setGuest] = useState(null)



    useEffect(() => {
        // Asegura la reproducción automática al cargar la página
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("La reproducción automática requiere que el video esté silenciado debido a las políticas del navegador:", error);
            })
        }
    }, [])

    const handleUnmute = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            setIsMuted(false);
        }
    }

    const buscarGuest = () => {
        setLoading(true)
        setError(false)

        peticionService(`prep/invitado/${id}`, methods.GET)
            .then((datos) => setGuest(datos))
            .catch((error) => {
                setGuest(null)
                // setError(`[Error ${error.status}]: ${error.message}`)
                setError(true)
            }).finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if (id) {
            buscarGuest()
        }
    }, [id])

    const mensajeConfigrmacion = `¡Hola! Confirmo mi asistencia a la boda de Karen y Renzo. ✨
Mi nombre es: [nombres_completo]
Asistiré con: [pases] personas.
¡Nos vemos pronto!`

    const reemplarDatosMensaje = (texto) => {
        const valores = {
            nombres_completo: `${guest.apellido_p} ${guest.apellido_m}, ${guest.nombres}`,
            pases: guest.pases,
        }
        return Object.keys(valores).reduce((a, e) => {
            const regex = new RegExp(`\\[${e}\\]`, 'g')
            return a.replace(regex, valores[e])
        }, texto)
    }

    const codificarMensaje = (texto) => {
        // Codificamos el mensaje para que reemplace espacios, saltos de línea y caracteres especiales
        return encodeURIComponent(texto)
            //Forzamos el reemplazo de asteriscos si decides usarlos en el texto    
            .replaceAll(/\*/g, '%2A')
    }

    return loading
        ? (
            <Container fluid className="d-flex flex-column align-items-center justify-content-center min-vh-100 papel-tapiz">
                <Spinner animation="border" variant="secondary" role="status" className="mb-3" style={{ color: '#d4af37' }} />
                <span style={{ fontFamily: "'Montserrat', sans-serif", color: '#8e8e8e', letterSpacing: '2px', fontSize: '0.85rem' }} className="text-uppercase">
                    Preparando tu invitación...
                </span>
            </Container>
        )
        : (error ? (<ErrorServidor onRetry={buscarGuest} />) : (
            !guest ? (<GuestNotFount onRetry={() => navigate('/')} />)
                : (
                    <Container fluid className="min-vh-100 bg-light d-flex justify-content-center align-items-start px-2 px-sm-3 papel-tapiz">
                        {/* w-100 asegura que en móviles ocupe todo el espacio horizontal */}
                        <Row className="w-100 justify-content-center">
                            {/* En móviles (xs) toma las 12 columnas (100% ancho). En pantallas grandes se autocontrola */}
                            <Col xs={12} md={10} lg={8} xl={6} className="mt-2 mt-sm-4 text-center">

                                {/* Tarjeta contenedora sin bordes ni paddings excesivos en móviles para ganar espacio */}
                                <Card className="shadow-sm p-1 p-sm-2 mb-3 bg-white rounded border-0">
                                    <video
                                        ref={videoRef}
                                        src="https://preparation.webhop.me/preparation-ws/video/invitacion.mp4"
                                        controls
                                        autoPlay
                                        muted
                                        playsInline
                                        className="w-100 rounded"
                                        controlsList="nodownload"
                                        onContextMenu={(e) => e.preventDefault()}
                                        style={{
                                            height: 'auto',
                                            maxHeight: '70vh', // Evita que en monitores grandes el video tape las indicaciones
                                            objectFit: 'contain',
                                            WebkitUserSelect: 'none'
                                        }}
                                    >
                                        Tu navegador no soporta la reproducción de video.
                                    </video>
                                    {isMuted && (<Button
                                        variant="light"
                                        onClick={handleUnmute}
                                        className="position-absolute top-50 start-50 translate-middle d-flex align-items-center gap-2 opacity-90 shadow-lg py-2 px-3 bootstrap-unmute-btn"
                                        style={{ zIndex: 10, borderRadius: '30px' }}
                                    >
                                        <h1>
                                            {/* 🔊 <span className="fw-bold small">Activar Sonido</span> */}
                                            ▶️ <span className="fw-bold small">Dale play a nuestra canción</span>
                                        </h1>
                                    </Button>)}
                                </Card>

                                {/* Sección de indicaciones optimizada */}
                                {/* <Alert variant="info" className="shadow-sm text-start mx-auto p-3" style={{ maxWidth: '100%' }}>
                        <Alert.Heading className="fw-bold mb-2 fs-6">📋 Indicaciones Importantes</Alert.Heading>
                        <p className="mb-0 text-muted small">
                            Por favor, mira el video completo antes de continuar con el siguiente módulo.
                        </p>
                    </Alert> */}

                                <Alert
                                    variant="light"
                                    className="shadow text-start mx-auto p-4 border"
                                    style={{
                                        maxWidth: '100%',
                                        borderRadius: '15px',
                                        // Fondo vino muy suave para que el texto oscuro sea perfectamente legible
                                        backgroundColor: '#F9F1F2',
                                        borderColor: '#722F37'
                                    }}
                                >
                                    <Alert.Heading
                                        className="fw-bold mb-3 fs-5 d-flex align-items-center gap-2"
                                        style={{ color: '#722F37' }}>
                                        {/* Título en color Vino Intenso */}
                                        ✨ ¡Tu presencia es nuestro mejor regalo!
                                    </Alert.Heading>

                                    <p className="text-muted small mb-2">
                                        Por favor, asegúrate de revisar la información del video sobre el <strong>Código de Vestimenta</strong> y los detalles del evento.
                                    </p>

                                    <ul className="text-muted small ps-3 mb-4">
                                        <li className="mb-1">🎟️ Tienes asignado: <span className="fw-bold text-dark">{guest.pases} pase</span>.</li>
                                        <li className="mb-1">📅 Fecha límite para confirmar: <span className="fw-bold" style={{ color: '#722F37' }}>Hasta el 21/08/2026</span>.</li>
                                    </ul>

                                    <hr className="my-3 opacity-25" style={{ color: '#722F37' }} />

                                    {/* Botón de Confirmación con estilo Rojo Vino */}
                                    <div className="d-grid gap-2">
                                        <Button
                                            size="lg"
                                            className="fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 py-2.5 text-white border-0 bootstrap-btn-vino"
                                            href={`https://api.whatsapp.com/send?phone=51979900401&text=${codificarMensaje(reemplarDatosMensaje(mensajeConfigrmacion))}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                borderRadius: '10px',
                                                backgroundColor: '#722F37', // Color Rojo Vino base
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            // Efecto interactivo al pasar el mouse o presionar en pantallas táctiles
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#5C2128'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = '#722F37'}
                                        >
                                            💬 Confirmar Asistencia por WhatsApp
                                        </Button>
                                    </div>
                                </Alert>
                            </Col>
                        </Row >
                    </Container >
                )
        ))
}

export default Guest