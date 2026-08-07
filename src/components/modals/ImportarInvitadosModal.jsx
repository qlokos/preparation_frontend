import React, { useState } from 'react'
import { Modal, Button, Table, Alert, Spinner } from 'react-bootstrap'
import * as XLSX from 'xlsx'
import { methods, peticionService } from '../../services/api_servis'

function ImportarInvitadosModal({ show, handleClose, onSuccess }) {
    const [invitados, setInvitados] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState('')

    // 1. Descargar la plantilla vacía con formato correcto
    const descargarPlantilla = () => {
        const headers = [['ant_nombres', 'nombres', 'apellidop', 'apellidom', 'telefono', 'pases', 'pases_add']]
        const worksheet = XLSX.utils.aoa_to_sheet(headers)
        const workbook = XLSX.utils.book_new()

        // Crear la primera hoja con el nombre 'invitados'
        XLSX.utils.book_append_sheet(workbook, worksheet, 'invitados')
        XLSX.writeFile(workbook, 'Formato_Invitados.xlsx')
    }

    // 2. Leer y validar el archivo Excel subido
    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setFileName(file.name)
        setError('')
        setLoading(true)

        const reader = new FileReader()

        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result
                const workbook = XLSX.read(bstr, { type: 'binary' })

                // Buscar la hoja 'invitados' o tomar la primera por defecto
                const sheetName = workbook.SheetNames.includes('invitados')
                    ? 'invitados'
                    : workbook.SheetNames[0]

                const worksheet = workbook.Sheets[sheetName]

                // Leer datos desde la fila 2 (range: 1) asignando las cabeceras de la fila 1
                const rawData = XLSX.utils.sheet_to_json(worksheet, {
                    header: ['ant_nombres', 'nombres', 'apellidop', 'apellidom', 'telefono', 'pases', 'pases_add'],
                    range: 1
                })

                // Filtrar y validar filas con contenido
                const datosValidados = rawData
                    .filter((row) => {
                        const tieneNombre = row.nombres && String(row.nombres).trim() !== ''
                        const tieneApellidoP = row.apellidop && String(row.apellidop).trim() !== ''
                        const tieneApellidoM = row.apellidop && String(row.apellidop).trim() !== ''
                        return tieneNombre || tieneApellidoP || tieneApellidoM
                    })
                    .map((row, index) => ({
                        idTemp: index + 1,
                        ant_nombres: String(row.ant_nombres || '').trim(),
                        nombres: String(row.nombres || '').trim(),
                        apellidom: String(row.apellidom || '').trim(),
                        apellidop: String(row.apellidop || '').trim(),
                        telefono: String(row.telefono || '').trim(),
                        pases: Number(row.pases) > 0 ? Number(row.pases) : 0,
                        pases_add: String(row.pases_add || '').trim(),
                    }))

                if (datosValidados.length === 0) {
                    setError('El archivo seleccionado no contiene filas válidas con información.')
                    setInvitados([])
                } else {
                    setInvitados(datosValidados)
                }
            } catch (err) {
                console.error(err)
                setError('Ocurrió un error al procesar el archivo Excel.')
            } finally {
                setLoading(false)
            }
        }

        reader.readAsBinaryString(file)
    }

    // 3. Subir la lista validada al servidor
    const handleSubirServidor = () => {
        if (invitados.length === 0) return

        const invitadosAux = [...invitados]
        for (const inv in invitadosAux) {
            for (const key in invitadosAux[inv]) {
                const value = invitadosAux[inv][key]

                if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                    delete invitadosAux[inv][key]
                }
            }
        }

        setLoading(true)
        setError('')

        peticionService('prep/invitados/registers', methods.POST, invitadosAux)
            .then(() => {
                resetForm()
                onSuccess()
            })
            .catch((error) => { setError(`No se pudo subir la lista al servidor. Inténtalo de nuevo.\n${error}`) })
            .finally(() => { setLoading(false) })
    }

    const resetForm = () => {
        setInvitados([])
        setError('')
        setFileName('')
    }

    const handleCerrar = () => {
        resetForm()
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleCerrar} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Importar Invitados desde Excel</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Sección de Botones Superiores */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                    <Button variant="outline-primary" onClick={descargarPlantilla}>
                        📥 1. Descargar Formato Excel
                    </Button>

                    <label className="btn btn-outline-success mb-0">
                        📂 2. Seleccionar Excel Lleno
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                {fileName && (
                    <p className="text-muted small mb-2">
                        <strong>Archivo seleccionado:</strong> {fileName}
                    </p>
                )}

                {/* Alerta de Error */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Spinner de Carga */}
                {loading && (
                    <div className="text-center my-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Procesando información...</p>
                    </div>
                )}

                {/* Tabla de Previsualización */}
                {!loading && invitados.length > 0 && (
                    <div className="mt-3">
                        <h6>Previsualización de Datos a Subir ({invitados.length} registros)</h6>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <Table striped bordered hover size="sm">
                                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff' }}>
                                    <tr>
                                        <th>#</th>
                                        <th>Distintivo</th>
                                        <th>Nombres</th>
                                        <th>Apellido Paterno</th>
                                        <th>Apellido Materno</th>
                                        <th>Telefono</th>
                                        <th>Pases</th>
                                        <th>Descripcion previo a pases</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invitados.map((inv) => (
                                        <tr key={inv.idTemp}>
                                            <td>{inv.idTemp}</td>
                                            <td>{inv.ant_nombres}</td>
                                            <td>{inv.nombres}</td>
                                            <td>{inv.apellidop}</td>
                                            <td>{inv.apellidom}</td>
                                            <td>{inv.telefono}</td>
                                            <td>{inv.pases}</td>
                                            <td>{inv.pases_add}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleCerrar} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    variant="success"
                    onClick={handleSubirServidor}
                    disabled={invitados.length === 0 || loading}
                >
                    {loading ? 'Subiendo...' : `Subir (${invitados.length}) al Servidor`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ImportarInvitadosModal