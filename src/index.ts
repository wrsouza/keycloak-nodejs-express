import server from './server'
import config from '~/config'

const PORT = config.port

server.listen(PORT, () => console.log(`Running... http://localhost:${PORT}`))