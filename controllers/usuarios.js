const { response } = require("express");
const Usuario = require('../models/usuario')

const getUsuarios = async (req, res = response) => {

    // Desde aca se personaliza la respuesta que mandaremos

    const desde = Number ( req.query.desde ) || 0;

    // Info relacionada con los usuarios
    // const usuarios = await Usuario.find();
    const usuarios = await Usuario
    // Aplicamos un filtro para que no aparezca el user, dueño del login
        .find({ _id: { $ne: req.uid } })
        .sort('-online')
        .skip(desde)
        .limit(20)





    res.json({
        ok: true,
        usuarios,
        // desde
    })
}

module.exports = {
    getUsuarios
}