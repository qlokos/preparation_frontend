import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const ErrorServidor = ({ onRetry }) => {
    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 px-4" style={{ backgroundColor: '#fcfbfa', color: '#4a4a4a' }}>
            <Row className="justify-content-center w-100">
                <Col xs={12} sm={10} md={8} lg={6} xl={5} className="text-center">
                    <div className="mb-4" style={{ fontSize: '3.5rem', color: '#c94c4c' }}>⚠️</div>
                    <h1 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: '400', color: '#2c2c2c' }}>
                        Algo no salió como esperábamos
                    </h1>
                    <p className="mx-auto mb-5 text-muted" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.95rem', maxWidth: '420px' }}>
                        Tuvimos un inconveniente temporal al conectar con nuestro sistema de invitaciones. Por favor, asegúrate de tener conexión a internet e inténtalo de nuevo.
                    </p>
                    <div className="d-grid gap-3 col-12 col-sm-8 mx-auto">
                        <Button variant="dark" onClick={onRetry} className="py-3 text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.85rem', backgroundColor: '#2c2c2c', border: 'none' }}>
                            Reintentar Conexión
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ErrorServidor;
