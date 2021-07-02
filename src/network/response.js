exports.success = (res, status, description, body) => {
    res.status(status || 200).send({
        id: true,
        status: status,
        description: description,
        body: body
    })
}

exports.error = (res, status, description, body) => {
    res.status(status || 500).send({
        id: false,
        status: status,
        description: description,
        body: body
    })
}