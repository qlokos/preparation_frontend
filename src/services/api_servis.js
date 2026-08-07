const URL_BASE = import.meta.env.VITE_API_URL

export const methods = {
    GET: {
        key: 'GET', isEnvData: false
    },
    PUT: {
        key: 'PUT', isEnvData: true
    },
    POST: {
        key: 'POST', isEnvData: true
    },
    DELETE: {
        key: 'DELETE', isEnvData: false
    }
}

export const peticionService = async (endpoint, method = methods.GET, datos = null) => {
    try {
        const conf = {
            method: method.key,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': import.meta.env.VITE_API_SECRET
            }
        }

        if (datos && method.isEnvData) {
            conf.body = JSON.stringify(datos)
        }

        const response = await fetch(`${URL_BASE}${endpoint}`, conf)
        const json = await response.json()

        if (!response.ok) {
            throw { status: response.status, message: `Error en el servidor (${response.status}) ${json.mensaje ? `: ${json.message}` : ''}` }
        }

        return json
    } catch (error) {
        // console.error(`Error en la petición ${endpoint}:`, error)
        throw { status: 500, message: `Error en la petición ${endpoint}` }
    }
}