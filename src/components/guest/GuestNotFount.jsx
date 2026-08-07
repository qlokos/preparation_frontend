import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const GuestNotFount = ({ onRetry }) => {
    return (
        <Container
            fluid
            className="d-flex align-items-center justify-content-center min-vh-100 px-4"
            style={{ backgroundColor: '#fcfbfa', color: '#4a4a4a' }}
        >
            <Row className="justify-content-center w-100">
                <Col xs={12} sm={10} md={8} lg={6} xl={5} className="text-center">

                    {/* Icono sutil y elegante */}
                    <div
                        className="mb-4"
                        style={{ fontSize: '3.5rem', color: '#d4af37' }}
                    >
                        ✨
                    </div>

                    {/* Título Principal */}
                    <h1
                        className="mb-3"
                        style={{
                            fontFamily: "'Playfair Display', 'Georgia', serif",
                            fontSize: '1.75rem',
                            fontWeight: '400',
                            color: '#2c2c2c',
                            lineHeight: '1.4'
                        }}
                    >
                        No logramos encontrar tu registro
                    </h1>

                    {/* Mensaje de cortesía */}
                    <p
                        className="mx-auto mb-5 text-muted"
                        style={{
                            fontFamily: "'Montserrat', 'Arial', sans-serif",
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            maxWidth: '420px'
                        }}
                    >
                        Queremos asegurarnos de que todo sea perfecto para nuestro gran día.
                        Por favor, verifica que tu nombre esté escrito exactamente como en tu invitación,
                        o ponte en contacto directo con nosotros para asistirte personalmente.
                    </p>

                    {/* Contenedor de Botones (Apilados en móvil, uno al lado del otro en pantallas grandes) */}
                    <div className="d-grid gap-3 col-12 col-sm-8 mx-auto">

                        {/* Botón Principal: Volver a intentar */}
                        <Button
                            variant="dark"
                            onClick={onRetry}
                            className="py-3 text-uppercase font-weight-bold"
                            style={{
                                letterSpacing: '1px',
                                fontSize: '0.85rem',
                                borderRadius: '4px',
                                backgroundColor: '#2c2c2c',
                                border: 'none'
                            }}
                        >
                            Volver a intentar
                        </Button>

                        {/* Botón Secundario: Asistencia por WhatsApp */}
                        <Button
                            variant="outline-secondary"
                            href="https://whatsapp.com."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 text-uppercase"
                            style={{
                                letterSpacing: '0.5px',
                                fontSize: '0.8rem',
                                borderRadius: '4px',
                                color: '#6e6e6e',
                                borderColor: '#dcdcdc'
                            }}
                        >
                            Solicitar asistencia
                        </Button>

                    </div>

                </Col>
            </Row>
        </Container>
    );
};

export default GuestNotFount;
