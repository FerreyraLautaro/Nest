const fs = require("fs");
const ZipNode = require("node-zip");
const axios = require("axios");
const PDFDocument = require('pdfkit');
const sharp = require('sharp');

async function main() {
	/*const response = await axios
		.get(
			"https://api.mercadolibre.com/shipment_labels?shipment_ids=42098996036&savePdf=Y",
			{
				headers: {
					Authorization: `Bearer APP_USR-2189962971708303-030808-43da02cdba67d6ab61c104693e9e5f96-151197075`,
				},
				responseType: "arraybuffer",
			},
		)
		.then(async (res) => {
			return new ZipNode(res.data, {
				base64: false,
				checkCRC32: true,
			}).files["Etiqueta de envio.txt"]._data;
            
        });*/
		//const zplString = response.data;
		const zplString = "^XA^FO50,50^ADN,36,20^FDHello, World!^FS^XZ";
		// Crear un nuevo documento PDF
		const doc = new PDFDocument();
		
		// Convertir el string ZPL a un buffer de imagen PNG
		//const pngBuffer = // Usa la solución que prefieras para convertir el string ZPL a una imagen PNG
		/*const pngBuffer = await sharp(Buffer.from(zplString))
			.toFormat('png')
			.toBuffer();
		console.log("🚀 ~ file: app.js:36 ~ main ~ pngBuffer:", pngBuffer)*/
		
		// Agregar la imagen PNG al documento PDF
		/*doc.image(pngBuffer);
		
		// Escribir el documento PDF en un archivo
		doc.pipe(fs.createWriteStream('archivo.pdf'));
		doc.end();*/

		/*
    const pdf = await axios
        .post(
            "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/",
            response,
            { headers: { 'Accept': 'application/pdf', 'Content-Type': 'application/x-www-form-urlencoded'} },
        )
        .then(async (result) => {
            console.log(typeof result.data)
            var filename = "label.pdf"; // change file name for PNG images
            await fs.writeFile(filename, result.data, function (err) {
            	if (err) {
            		console.log(err);
                }
                console.log("done");
            });
        }).catch((err) => { 
            console.log(err.message);
        });*/
		return console.log("done");
}	
main();
