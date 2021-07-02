const fs = require('fs')
const puppeteer = require('puppeteer')
const QRCode = require('easyqrcodejs-nodejs');
const imageToBase64 = require('image-to-base64')

generarPDF = (body) => {
    return new Promise(async (resolve, reject) => {
        const { cedula, nombre, numeroCita, dia, fecha, horaInicio, horaFin, duracion, tipoAsunto, asunto, descripcion } = body;
        await generateQRCode(numeroCita)
            .catch((error) => {
                console.log(error)
                reject(error)
                return
            })

        const b64Logo = await imageToBase64(`./src/components/generarPDF/logo.png`)
        const b64Marca = await imageToBase64(`./src/components/generarPDF/marca.png`)
        const b64QRCode = await imageToBase64(`./src/components/generarPDF/${numeroCita}.png`)

        const html = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: Arial, Helvetica, sans-serif;
                }
                .cita {
                    background-color: white;
                    display: flex;
                }
                .cita>.marca {
                    width: 10%;
                    height: 100%;
                    border: 0px;
                    padding: 0;
                }
                .cita>.contenido {
                    width: 80%;
                    height: 100%;
                    margin-top: 5%;
                }
                .cita>.margenDerecho {
                    width: 10%;
                    height: 100%;
                }
                .cita>.marca>img {
                    width: 100%;
                }
                .cita>.contenido>.logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cita>.contenido>.logo>img {
                    width: 50%;
                }
                .cita>.contenido>.title {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cita>.contenido>.title>h1 {
                    color: #1B6236;
                    font-size: 25px;
                }
                .cita>.contenido>.text {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0px 50px;
                }
                .cita>.contenido>.table {
                    padding: 0px 50px;
                }
                .cita>.contenido>.table>.headerTable {
                    color: #1B6236;
                    font-size: 18px;
                    border: solid 2px #D4D4D5;
                }
                .cita>.contenido>.table>.headerTable>h3 {
                    margin: 0px;
                    padding: 7.5px;
                }
                .cita>.contenido>.table>table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .cita>.contenido>.table>table tr>th {
                    font-weight: 300;
                }
                .cita>.contenido>.table>table>thead>tr>th {
                    border: solid 2px #D4D4D5;
                    padding: 7.5px;
                    text-align: left;
                }
                .cita>.contenido>.table>table tr>.title {
                    width: 30%;
                    font-weight: 600;
                    color: #1B6236;
                }
                .cita>.contenido>.qr {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 30px;
                }
                .cita>.contenido>.qr>img {
                    width: 30%;
                }
                .cita>.contenido>.nota {
                    padding: 0px 50px;
                }
                .cita>.contenido>.nota>h3 {
                    font-weight: 600;
                    color: #1B6236;
                    font-size: 20px;
                    margin: 5px;
                }
                .cita>.contenido>.nota>.containerItem>.item {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }
                .cita>.contenido>.nota>.containerItem>.item>.vineta {
                    width: 10px;
                    height: 10px;
                    border-radius: 5px;
                    background-color: #1B6236;
                    margin: 10px;
                    margin-top: 0px;
                    align-self: start;
                }
                .cita>.contenido>.nota>.containerItem>.item>li {
                    font-size: 30px;
                    color: #1B6236;
        
                }
                .cita>.contenido>.nota>.containerItem>.item>p {
                    font-size: 16px;
                    color: #1B6236;
                    margin: 0px;
                }
            </style>
        </head>
        <body>
            <div class="cita">
                <div class="marca">
                    <img src="data:image/png;base64, ${b64Marca}" alt="Marca">
                </div>
                <div class="contenido">
                    <div class="logo">
                        <img src="data:image/png;base64, ${b64Logo}" alt="Logo">
                    </div>
                    <div class="title">
                        <h1>CITA DE ATENCIÓN A LA CIUDADANÍA</h1>
                    </div>
                    <div class="text">
                        <p>
                            Su cita ha sido agendada correctamente, a continuación, se presentará la
                            información ingresada.
                        </p>
                    </div>
                    <div class="table">
                        <div class="headerTable">
                            <h3>
                                Datos del usuario
                            </h3>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th class="title">C.I:</th>
                                    <th>${cedula}</th>
                                </tr>
                                <tr>
                                    <th class="title">Nombre:</th>
                                    <th>${nombre}</th>
                                </tr>
                            </thead>
                        </table>
                        <div class="headerTable">
                            <h3>
                                Detalle de la cita
                            </h3>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th class="title">Numero:</th>
                                    <th>${numeroCita}</th>
                                </tr>
                                <tr>
                                    <th class="title">Fecha:</th>
                                    <th>${dia} ${fecha}</th>
                                </tr>
                                <tr>
                                    <th class="title">Hora:</th>
                                    <th>${horaInicio} - ${horaFin}</th>
                                </tr>
                                <tr>
                                    <th class="title">Duración:</th>
                                    <th>${duracion}</th>
                                </tr>
                                <tr>
                                    <th class="title">Tipo de asunto:</th>
                                    <th>${tipoAsunto}</th>
                                </tr>
                                <tr>
                                    <th class="title">Asunto:</th>
                                    <th>${asunto}</th>
                                </tr>
                                <tr>
                                    <th class="title">Descripción:</th>
                                    <th>${descripcion}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div class="qr">
                        <img src="data:image/png;base64, ${b64QRCode}" alt="Codigo QR">
                    </div>
                    <div class="nota">
                        <h3>Nota:</h3>
                        <div class="containerItem">
                            <div class="item">
                                <li>
                                </li>
                                <p>El usuario tiene que presentarse 15 minutos antes de la hora de su cita</p>
        
                            </div>
                            <div class="item">
                                <li>
                                </li>
                                <p>El usuario tiene que presentar un documento de identidad al momento de presentarse a su
                                    cita</p>
                            </div>
                            <div class="item">
                                <li>
                                </li>
                                <p>Este turno es intransferible a terceras personas</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="margenDerecho">
        
                </div>
            </div>
        </body>
        </html>
        `
        /**
         * Generar HTML
         */
        await generateHtml(numeroCita, html)
            .catch((error) => {
                console.log(error)
                reject(error)
                return
            })
        /**
         * Generar PDF
         */
        await generatePdf(numeroCita)
            .catch((error) => {
                console.log(error)
                reject(error)
                return
            })
        await clearDirectory(numeroCita)
            .catch((error) => {
                console.log(error)
                reject(error)
                return
            })
        resolve('PDF Creado')
    })
}

generateQRCode = (numeroCita) => {
    return new Promise((resolve, reject) => {
        try {
            var options = {
                text: numeroCita,
                width: 256,
                height: 256,
                colorDark: "#1B6236",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            }
            var qrcode = new QRCode(options);
            qrcode.saveImage({
                path: `src/components/generarPDF/${numeroCita}.png`
            })
                .then(() => {
                    resolve()
                })
        } catch (error) {
            reject(error)
        }
    })
}

generateHtml = (numeroCita, html) => {
    return new Promise((resolve, reject) => {
        try {
            fs.writeFileSync(`src/components/generarPDF/${numeroCita}.html`, html)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

generatePdf = (numeroCita) => {
    return new Promise(async (resolve, reject) => {
        try {
            const urlBase = 'file://' + (__dirname).replace(/\\/g, "/")
            const browser = await puppeteer.launch({ headless: true })
            const page = await browser.newPage()
            await page.goto(`${urlBase}/${numeroCita}.html`, { waitUntil: 'networkidle0' })
            const pdf = await page.pdf({ format: 'A4' })
            await browser.close()
            fs.writeFileSync(`src/components/generarPDF/${numeroCita}.pdf`, pdf)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

clearDirectory = (numeroCita) => {
    return new Promise((resolve, reject) => {
        try {
            fs.unlinkSync(`src/components/generarPDF/${numeroCita}.png`)
            fs.unlinkSync(`src/components/generarPDF/${numeroCita}.html`)
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    generarPDF
}