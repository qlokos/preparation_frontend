import { useEffect, useState } from 'react';
// Importamos los componentes específicos de React-Bootstrap
import { Container, Row, Col, Form, Button, ListGroup, Table, Card, Alert, Badge, Spinner } from 'react-bootstrap';
// Importamos la conexión para servis
import { peticionService, methods } from '../services/api_servis'
import GuestRow from '../components/guest/GuestRow';
import ImportarInvitadosModal from '../components/modals/ImportarInvitadosModal';
import { useLocation } from 'react-router-dom';

function GuestManagement() {
    const [formData, setFormData] = useState({ nombres: '', ap_p: '', ap_m: '', telefono: '', pases: 1, ant_nombres: '', pases_add: '' })
    const [formDataEnvio, setFormDataEnvio] = useState({ mensaje: '' })
    const [statusGuest, setStatusGuest] = useState({ type: '', message: '' })

    const [guests, setGuests] = useState([])
    const [statusListGuest, setStatusListGuest] = useState({ type: '', message: '' })
    const [cargando, setCargando] = useState(true);
    const [refreshing, setRefreshing] = useState(false)

    // const [videoSrc, setVideoSrc] = useState(null)
    // const [nombreArchivo, setNombreArchivo] = useState("");
    // const [videoBase64, setVideoBase64] = useState("");

    const [videoUrl, setVideoUrl] = useState('')

    const [showModalCargaMasiva, setShowModalCargaMasiva] = useState(false);

    const rutaActual = useLocation()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleChangeEnvio = (e) => {
        const { name, value } = e.target
        setFormDataEnvio({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        registrarInvitado()
    }

    const handleExitoSubidaMasiva = () => {
        setShowModalCargaMasiva(false); // Cierra el modal
        listarGuests(); // Refresca la tabla principal
    };

    const registrarInvitado = () => {
        setStatusGuest({ type: '', message: '' })

        peticionService('prep/invitados/register', methods.POST, formData)
            .then((response) => {
                // setStatusGuest({ type: 'success', message: response.mensaje })
                setFormData({ nombres: '', ap_p: '', ap_m: '', telefono: '', pases: 1, ant_nombres: '', pases_add: '' })
                listarGuests(true)
            }).catch((error) => setStatusGuest({ type: 'danger', message: `[Error ${error.status}]: ${error.mensaje}` }))
    }

    useEffect(() => {
        listarGuests()
    }, [])

    const listarGuests = (isRefreshing = false) => {
        if (isRefreshing) setRefreshing(true)
        else setCargando(true)

        setStatusListGuest({ type: '', message: '' })

        peticionService('prep/invitados', methods.GET)
            .then((datos) => setGuests(datos))
            .catch((error) => setStatusListGuest({ type: 'danger', message: `[Error ${error.status}]: ${error.message}` }))
            .finally(() => {
                setCargando(false)
                setRefreshing(false)
            })
    }

    const enviarInvitacion = (guest) => {
        const { _id, distintivo, nombres, apellido_p, apellido_m, pases, pases_add } = guest

        const valores = {
            ant_nombres: distintivo || '',
            nombres: nombres,
            pases: pases,
            pases_add: pases_add || '',
            video: videoUrl,
            invitado: _id
        }

        const mensaje = Object.keys(valores).reduce((a, e) => {
            const regex = new RegExp(`\\[${e}\\]`, 'g')
            return a.replace(regex, valores[e])
        }, formDataEnvio.mensaje)

        // const videoBase64V = videoBase64.split(',')
        // const mime = videoBase64V[0].split(';')[0].replace('data:', '')
        // const code64 = videoBase64V[1]

        const datos = {
            message: mensaje,
            // archivo: { mime, code64, name: nombreArchivo }
        }

        peticionService(`prep/invitados/enviar-inv/${_id}`, methods.POST, datos)
            .then((response) => alert(response.mensaje))
            .catch((error) => alert(`[Error ${error.status}]: ${error.message}`))
    }

    const manejarCambioVideo = (event) => {
        // const archivo = event.target.files[0]
        // if (archivo) {
        //     setNombreArchivo(archivo.name)
        //     // Creamos una URL local/temporal para el archivo seleccionado
        //     const urlTemporal = URL.createObjectURL(archivo)
        //     setVideoSrc(urlTemporal)

        //     const lector = new FileReader()
        //     lector.onloadend = () => {
        //         const resultadoBase64 = lector.result
        //         setVideoBase64(resultadoBase64)
        //         console.log(resultadoBase64)
        //     }

        //     lector.readAsDataURL(archivo)
        // }
        setVideoUrl(event.target.value)
    }

    const poblarMensaje = () => {
        const linkActual = window.location.href
        const rutaNueva = `${linkActual.replace(rutaActual.pathname, '')}/invite/[invitado]`
        const sms = `¡Se viene el gran día! 🥂🎉Estamos muy emocionados y queremos celebrar nuestro amor con las personas que más queremos.🎬 Toda la información del evento la encuentras haciendo clic aquí:👉 ${rutaNueva} 🎟️ Tus lugares asignados son: [pases] pases.📝 Para asegurar tu lugar, confirma al: +51 979 900 401 (Tienes hasta el 21/08/2026)¡Preparen su mejor vestimenta y no falten!`
        formDataEnvio.mensaje = sms
    }

    useEffect(() => { poblarMensaje() }, [])

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
            <Container className="bg-white p-5 rounded shadow">
                <Row className="g-5">

                    {/* MITAD IZQUIERDA: Formulario */}
                    <Col xs={12} md={6} className="border-end">
                        <Card className="shadow">
                            <Card.Header className="bg-primary text-white py-3 d-flex justify-content-between align-items-center">
                                {/* <h4 className="mb-0">Registro de Invitados</h4> */}
                                <div className="d-flex align-items-center gap-2">
                                    <h4 className="mb-0">Registro de Invitados</h4>
                                </div>
                                <Button
                                    className='btn btn-success'
                                    variant="outline-light"
                                    size="sm"
                                    onClick={() => setShowModalCargaMasiva(true)}
                                ><i className="bi bi-file-earmark-spreadsheet-fill me-1"></i>Importar con Excel
                                </Button>
                            </Card.Header>
                            <Card.Body className="p-4">

                                {statusGuest.message && (
                                    <Alert variant={statusGuest.type}>{statusGuest.message}</Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Distintivo</Form.Label>
                                                <Form.Control
                                                    type="text" name="ant_nombres"
                                                    value={formData.ant_nombres} onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={8}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Nombres</Form.Label>
                                                <Form.Control
                                                    type="text" name="nombres" required
                                                    value={formData.nombres} onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Apellido Paterno</Form.Label>
                                                <Form.Control
                                                    type="text" name="ap_p" required
                                                    value={formData.ap_p} onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Apellido Materno</Form.Label>
                                                <Form.Control
                                                    type="text" name="ap_m" required
                                                    value={formData.ap_m} onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={8}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Teléfono Celular</Form.Label>
                                                <Form.Control
                                                    type="tel" name="telefono" placeholder="+51 951 247 356"
                                                    value={formData.telefono} onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-4">
                                                <Form.Label>Pases</Form.Label>
                                                <Form.Control
                                                    type="number" name="pases" min="1" required
                                                    value={formData.pases} onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Detalle Pase</Form.Label>
                                        <Form.Control
                                            type="text" name="pases_add" min="1"
                                            value={formData.pases_add} onChange={handleChange}
                                        />
                                    </Form.Group>

                                    <div className="d-grid gap-2">
                                        <Button variant="primary" type="submit" size="lg">
                                            Registrar Invitado
                                        </Button>
                                    </div>
                                </Form>
                                <ImportarInvitadosModal show={showModalCargaMasiva}
                                    handleClose={() => setShowModalCargaMasiva(false)}
                                    onSuccess={handleExitoSubidaMasiva} />
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* MITAD DERECHA: Listado */}
                    <Col xs={12} md={6}>
                        <Card className="shadow">
                            <Card.Header className="bg-primary text-white py-3 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    <h4 className="mb-0">Invitados</h4>
                                    <Badge bg="primary" pill>Total: {guests.length}</Badge>
                                </div>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    onClick={() => listarGuests(true)}
                                    disabled={cargando || refreshing}>
                                    {
                                        refreshing
                                            ? (<><Spinner animation="border" size="sm" role="status" className="me-2" /> Actualizando...</>)
                                            : (<><i className="bi bi-arrow-clockwise me-1"></i> Refrescar Lista</>)
                                    }
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {statusListGuest.message && (
                                    <Alert variant={statusListGuest.type}>{statusListGuest.message}</Alert>
                                )}

                                {
                                    cargando ? (
                                        <div className="text-center my-5">
                                            <Spinner animation="border" variant="primary" />
                                            <p className="mt-2 text-muted">Cargando lista de invitados...</p>
                                        </div>
                                    )
                                        : (
                                            <Table striped bordered hover responsive className="align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Invitado</th>
                                                        <th>Contacto</th>
                                                        <th>Pases</th>
                                                        <th>Confirmacion</th>
                                                        <th>Opc</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(guests.length === 0
                                                        ? <tr>
                                                            <th colSpan={5}>No hay invitados registradas aun.</th>
                                                        </tr>
                                                        : (
                                                            guests.map((guest) => (
                                                                <GuestRow key={guest._id} guest={guest} onAccionEnvio={enviarInvitacion} />
                                                            ))
                                                        ))}
                                                </tbody>
                                            </Table>
                                        )
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* <Row className="g-5"> */}
                <Row className="pt-5">
                    <Col xs={12} md={12}>
                        <Card className="shadow">
                            <Card.Header className="bg-primary text-white text-center py-3">
                                <h4 className="mb-0">Datos para el envío Wssp-JS</h4>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Form>
                                    <Row>
                                        <Col xs={12} md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Mensaje</Form.Label>
                                                <Form.Control
                                                    as='textarea' rows={5}
                                                    name='mensaje'
                                                    value={formDataEnvio.mensaje}
                                                    onChange={handleChangeEnvio}
                                                    placeholder="¡Nos Casmos! ..."
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            {/* <Form.Group className="mb-4">
                                                <Form.Label className="fw-bold text-dark">🔗 Enlace del Video</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Pegue aquí el link del video (ej. https://enlace.com)"
                                                    value={videoUrl}
                                                    onChange={manejarCambioVideo}
                                                />
                                            </Form.Group> */}
                                            {videoUrl && (<div className="mt-3 text-center">
                                                <p className="text-muted small">Vista previa del video:</p>
                                                <video
                                                    src={videoUrl}
                                                    controls // Muestra los botones de play, pausa y volumen
                                                    style={{
                                                        width: '100%',          // Se adapta al contenedor del formulario
                                                        maxWidth: '400px',      // No permite que sea más ancho de 400px
                                                        maxHeight: '250px',     // No permite que sea más alto de 250px
                                                        objectFit: 'contain',   // Ajusta el video dentro del cuadro sin recortarlo
                                                        backgroundColor: '#000',// Fondo negro por si el video no llena todo el espacio
                                                        borderRadius: '8px',
                                                        border: '1px solid #ccc'
                                                    }}
                                                >
                                                    Tu navegador no soporta la reproducción de este video.
                                                </video>
                                            </div>)}
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default GuestManagement;
