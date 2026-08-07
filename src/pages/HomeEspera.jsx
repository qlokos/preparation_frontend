import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomeEspera = () => {
    return (
        <Container
            fluid
            className="min-vh-100 d-flex justify-content-center align-items-center px-3"
            style={{
                // Fondo con un degradado sutil hacia tonos vino oscuros y elegantes
                background: 'linear-gradient(135deg, #2C0E11 0%, #4A151B 50%, #722F37 100%)',
                backgroundAttachment: 'fixed'
            }}
        >
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={8} lg={5} className="text-center">

                    {/* Tarjeta de espera elegante */}
                    <Card
                        className="shadow-lg border-0 p-4 p-sm-5"
                        style={{
                            borderRadius: '20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Card.Body className="p-0">
                            {/* Icono decorativo de bodas */}
                            <div
                                className="mx-auto mb-4 d-flex align-items-center justify-content-center"
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    backgroundColor: '#F9F1F2',
                                    fontSize: '2rem'
                                }}
                            >
                                🥂
                            </div>

                            {/* Mensaje principal destacado */}
                            <h1
                                className="fw-bold mb-3 fs-3 text-uppercase tracking-wide"
                                style={{ color: '#722F37', letterSpacing: '1px' }}
                            >
                                Espera tu turno
                            </h1>

                            {/* Línea divisoria elegante */}
                            <hr
                                className="mx-auto my-3 opacity-50"
                                style={{ color: '#722F37', width: '60px', height: '2px' }}
                            />

                            {/* Mensaje secundario */}
                            <p className="text-muted fs-6 mb-0 px-2 leading-relaxed">
                                Muy pronto recibirás tu enlace personalizado para descubrir todos los detalles de nuestra boda.
                                <span className="d-block mt-2 fw-semibold" style={{ color: '#5C2128' }}>
                                    ¡Ya te invitaremos a celebrar con nosotros! 🎉
                                </span>
                            </p>
                        </Card.Body>
                    </Card>

                    {/* Pie de página sutil flotante */}
                    <p className="text-white-50 small mt-4 opacity-75">
                        © {new Date().getFullYear()} — Con mucho amor.
                    </p>

                </Col>
            </Row>
        </Container>
    );
};

export default HomeEspera;
