const express = require('express');
const axios = require('axios');
const router = express.Router();
const zplImageConvert = require('@replytechnologies/zpl-image-convert');
var request = require('request');
var fs = require('fs');
const ZipNode = require("node-zip");

router.get('/', async (req, res) => {
  
    /*const response = await axios
    .get(
        "https://api.mercadolibre.com/shipment_labels?shipment_ids=42111126899&savePdf=Y",
        {
            headers: {
                Authorization: `Bearer APP_USR-2189962971708303-031309-b4a7ceb902750fed89e8885ec48965f6-151197075`,
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

        var zpl = `^XA
        ^MCY
        ^CI28
        ^LH5,15
        ^FO20,10^GFA,800,800,10,,:::::::::::O0FF,M07JFE,L07FC003FE,K07EL07E,J01EN078,J07P0E,I01CP038,I07R0E,001CK01FK038,003L0IFK0C,0078J03803CJ0E,0187J06I07I01D8,0300F00F8J0FEFE0C,02003IFK01J06,04I01C6P02,08K0401FM01,1L08060CM083K0100C02M0C2M01001M046K0306I0CL064K0198I02L024Q01L02CR08K03CR04K03FR02K03FFQ01J07!C1FQ0C007E3C03EP0203F03C0078O010F003CI0EF1N0F8003CI070C4M06I03CI02003CL02I03CI02P02I036I03N0106I066I01J08J0C4I067J0EI08J078I0E38I03I0E00406I01C3CI01800100204I01C3CJ0FI080118I03C1EJ03800801FJ0780FK0C008018J0F,078J07C0823J01F,07EJ01C1C36J07E,03FK031C3K0FC,01FCJ01E18J01F8,00FER07F,007F8P01FE,003FFP0FFC,I0FFEN07FF,I03FFCL03FFC,J0IFCJ03IF,J07PFE,K0PF,K01NF8,L01LF8,N0JF,,:::::::::::^FS
        ^FO120,20^A0N,24,24^FH^FDRemitente #151197075^FS
        ^FO120,43^A0N,24,24^FB550,2,0,L^FH^FDAvenida Circunvalaci_C3_B3n 2735, San Carlos^FS
        ^FO120,90^A0N,24,24^FB550,1,0,L^FH^FDC_C3_B3rdoba, C_C3_B3rdoba - 5014^FS
        ^FO120,120^A0N,24,24^FDPack ID: 20000^FS
        ^FO272,117^A0N,27,27^FD04280026175^FS
        ^FX LAST CLUSTER  ^FS
        ^FO20,150^GB210,45,45^FS
        ^FO20,156^A0N,45,45^FB210,1,0,C^FR^FDXCO1^FS
        ^FX END LAST CLUSTER  ^FS
        ^FO480,150^GB330,40,40^FS
        ^FO410,160^A0N,22,22^FB460,1,0,C^FR^FD PUNTO DE DESPACHO^FS
        ^FX  Shipment_Number_Bar_Code  ^FS
        ^FO230,210^BY3,,1^BCN,160,N,N,N^FD>:42111126899^FS
        ^FO95,385^A0N,30,30^FB390,1,0,R^FD421111^FS
        ^FO488,381^A0N,35,35^FB400,1,0,L^FD26899^FS
        ^FX UNA SOLA CAJA GRANDE ^FS
        ^FO20,420^GB360,120,60^FS
        ^FO20,440^A0N,95,95^FB400,1,0,C^FR^FDXCO1^FS
        ^FO380,420^GB400,120,3^FS
        ^FO420,440^A0N,95,95^FB400,1,0,L^FDFBA1^FS
        ^FO670,460^A0N,45,45^FB200,1,0,L^FD23:00^FS
        ^FX CIERRE CAJAS ^FS
        ^FX  CUSTOM_DATA  ^FS
        ^FO0,580^A0N,175,175^FB630,1,0,R^FDSBU1^FS
        ^FO670,640^A0N,47,47^FB200,1,0,L^FD03:00^FS
        ^FO0,790^A0N,28,28^FB600,1,0,R^FDXCO1 > FBA01 > SBU1 > ^FS
        ^FO605,785^A0N,40,40^FDC4^FS
        ^FO0,830^A0N,38,38^FB820,1,0,C^FDMIE 15/03/2023   CP: 1825^FS
        ^FX  PLACES ZONE^FS
        ^FS^FO0,870^GB850,0,2^FS
        ^FO55,885^A0N,35,35^FDComprador retira en ^FS
        ^FO355,885^A0N,35,35^FH^FDCentro de Env_c3_ado:^FS
        ^FO355,886^A0N,35,35^FH^FDCentro de Env_c3_ado:^FS
        ^FO55,920^FB700,1,,C^A0N,30,30^FDCentro de envÃ­o - AMI Logistica y Transporte^FS
        ^FO0,950^GB850,2,2^FS
        ^FO30,970^A0N,26,26^FB600,2,0,L^FH^FDmarcos linardi (MARCOSFRA2010)^FS
        ^FO30,1030^A0N,26,26^FB600,2,0,L^FH^FDDomicilio: Eva Peron 2982^FS
        ^FO30,1090^A0N,30,30^FH^FDCP: 1825^FS
        ^FO30,1089^A0N,30,30^FH^FDCP: 1825^FS
        ^FO30,1121^A0N,26,26^FB600,1,0,L^FH^FDCiudad de destino: Lan_C3_BAs (Buenos Aires)^FS
        ^FO30,1150^A0N,26,26^FB600,3,0,L^FH^FDReferencia: Lanus^FS
        ^FO650,985^BY2,2,1^BQN,2,5^FDLA,{"id":"42111126899","t":"lm"}^FS
        ^FO650,1130^GB105,40,40^FS
        ^FO650,1135^A0N,35,35^FB105,1,0,C^FR^FDC^FS
        ^XZ`;

        var options = {
            encoding: null,
            formData: { file: zpl },
            headers: { 'Accept': 'application/pdf' }, // omit this line to get PNG images back
            url: 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/'
        };


        const buffer = await new Promise(resolve => {
            request(options, function (error, response, body) {
                if(!error)
                    resolve(body);
            })
        }).then(value => {
            return value
        })
        console.log("🚀 ~ file: index.js:100 ~ router.get ~ buffer:", buffer)

        /*request.post(options, function(err, resp, body) {
            if (err) {
                return console.log(err);
            }

            var filename = options.headers && options.headers['Accept'] === 'application/pdf' ? `label${Date.now()}.pdf` : `label${Date.now()}.png`;
        
            fs.writeFile(filename, body, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            return body
        })*/

      return buffer
    //res.send(buffer);
      
		
});

module.exports = router;


