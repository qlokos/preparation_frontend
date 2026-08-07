import { useEffect, useState } from 'react';
import { Button, Badge } from 'react-bootstrap';

function GuestRow({ guest, onAccionEnvio }) {
    const { _id, nombres, apellido_p, apellido_m, telefono, pases, confirmacion, state_message } = guest;

    const [statusAlertEnvio, setStatusAlertEnvio] = useState({ state: false, type: '', message: '' })

    const stateMss = state_message
        ? (state_message.state_detail ? <i className={state_message.state_detail.icon}></i> : '')
        : ''

    const mostrarMensajeEnvio = () => {
        if (statusAlertEnvio.state) {
            const temporizador = setTimeout(() => {
                setStatusAlertEnvio({
                    state: false,
                    type: statusAlertEnvio.type,
                    message: statusAlertEnvio.message
                })
            }, 3000)
            return () => clearTimeout(temporizador)
        }
    }

    useEffect(() => { mostrarMensajeEnvio() }, [statusAlertEnvio])

    return (
        <tr key={_id}>
            <td> {stateMss} {apellido_p} {apellido_m}, {nombres}</td>
            <td className='text-center'>{telefono || <span className="text-muted">N/A</span>}</td>
            <td className='fw-bold text-end'>{pases}</td>
            <td className='text-center'>{confirmacion === true
                ? <Badge bg="success">Confirmado</Badge>
                : <Badge bg="warning" text="dark">Pendiente</Badge>}</td>
            <td className='text-center'>
                <i className="bi bi-play-fill me-1 text-warning-emphasis"
                    style={{ cursor: 'pointer' }}
                    onClick={() => onAccionEnvio(guest)}></i>
            </td>
        </tr>
    );
}

export default GuestRow;
