const express = require('express')
const jwt = require('jsonwebtoken')// Requiriendo el modulo de JSON web Tokens
const app = express()

app.get('/', (req, res) => {
    res.json({
        text: 'api works ;D'
    })
})

app.post('/api/login', (req,res) => {
    const user = { id : 3 }
    const token = jwt.sign({user}, 'my_secret_key')
    // token explicado en mis notas y la función sign es de firma, recibe al objeto usuario
    // y su segundo parametro es la clave que le permite al json web token, obtener una manera
    // de cifrar y decifrar el codigo. Lo que hace la linea es generar un token para user,
    // que es un usuario único
    res.json({
        token
    }) // Respondemos el token para comprobarlo
})

app.get('/api/protected', ensureToken, (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err, data) => {
        if (err) {
            res.sendStatus(403)
        } else {
            res.json({
                text : 'protected',
                data // = data = data
            })
        }
    })
    // Va a verificar, primero recibir el token que viene de la peticion una vez recibido voy a utilizar
    // la clave privada my_secret_key, lo manejamos a travéz de un callback que recibe un error y los datos
    // si obtengo un error le enviamos un estado 403 y en el caso contrario que si esta todo bien enviamos el texto protected y ya entro
})
// Creación de ruta protegida para comprobar que solo sea accedida por las personas que han
// generado un token

function ensureToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    // Cuando se ejecute esta función vamos a comprobar la información que me esta enviando el navegador
    // en sus headers(notas del cuaderno) y verificamos si existe una llamada 'authorization' la cual mi app
    // la tiene que generar y la almacenamos en cabezera del portador (bearerHeader)
    console.log(bearerHeader)
    if (typeof bearerHeader !== 'undefined') { // Si el tipo de dato que tiene esta cabezera del portador es diferente de undefined, osea si existe algo me esta enviando datos vamos a dividirlo
        const bearer = bearerHeader.split(" ")
        // Primero guardar en la constante portador del dato que me esta enviando(cabezera del portador)
        // vamos a cortar, vamos a partirlo a la mitad desde los datos que esten en blanco " ", ya que envia esto beaer y el hash o numero aleatorio skjdfhs02398323 y nos quedamos con este y genera un arreglo, 2 items el hash o token y el bearerHeader
        const bearerToken = bearer[1]
        // Entonces vamos a guardar tan solo el token del portador que esta en el segundo item del arreglo que genere arriba 
        req.token = bearerToken
        // Y lo guardamos en el objeto de la petición, o en request en su propiedad token
        next()
        // Luego continuo con el siguiente middleware
    } else { // Y si es undefined, ha venido y no se ha registrado antes
        res.sendStatus(403)
        // Le enviamos un codigo de estado HTTP, 403 de no permitido
    }
}
// (Middleware) Función que se ejecuta en /api/protected, que se asegura que el token fue creado
// El next es para que continue luego a la otra ruta

app.listen(3000, () => {
    console.log('Server on port 3000');
})