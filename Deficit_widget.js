let filePath = "deficit.txt"; // Cambia esto según la ubicación exacta
let fm = FileManager.iCloud();
let fullPath = fm.joinPath(fm.documentsDirectory(), filePath);

// Cambiar la base de iCloud Drive
fullPath = fm.joinPath(fm.documentsDirectory(), filePath);

// Verificar si el archivo existe
if (!fm.fileExists(fullPath)) {
    console.log("Archivo no encontrado en la ruta: " + fullPath);
    throw new Error("Archivo no encontrado. Verifica la ruta o la existencia del archivo.");
}

// Descargar el archivo si está en iCloud
if (fm.isFileStoredIniCloud(fullPath)) {
    fm.downloadFileFromiCloud(fullPath);
}

// Leer el contenido del archivo
let content = fm.readString(fullPath);

let partes = content.split(" & ");

console.log(partes);

// WIDGET 
let widget = new ListWidget();
const titleFontSize = 12
const detailFontSize = 36
const MAXIMO = 1000
const CANVAS_SIZE = new Size(100, 100)

// Nombre base de los archivos. Ajusta a tus nombres reales.
let images = [
    "flame0.png", // 0 - 25 %
    "flame1.png", // 25 - 50 %
    "flame2.png", // 50 - 75 %
    "flame3.png", // 75 - 100 %
  ]

// Nombre del SF Symbol que usarás como base
const SYMBOL_NAME = "flame.fill"

// Color de relleno
const FILL_COLOR = Color.red()

let row = widget.addStack()
row.layoutHorizontally()
row.addSpacer(2)

let icon;
if (partes[1] < 0) {
    iconName = "figure.fall"
    let symbol = SFSymbol.named(IconName)
    icon = symbol.image
  } else {
    let ratio = getRatio(partes[1], MAXIMO)

    //----------------------------------------------------
    // 5) Generar la imagen final con relleno parcial
    //----------------------------------------------------
    let stage = getFlameStage(ratio)
    let flameFileName = images[stage]
    //----------------------------------------------------
    // 5) Cargar la imagen desde la carpeta de Scriptable
    //----------------------------------------------------
    let fm = FileManager.iCloud()
    // - Si guardaste los PNG en la carpeta local de Scriptable:
    //   let fm = FileManager.local()

    // Ruta para el archivo
    let path = fm.joinPath(fm.documentsDirectory(), flameFileName)

    // En iCloud, asegurarnos de que esté descargado
    if (!fm.isFileDownloaded(path)) {
    await fm.downloadFileFromiCloud(path)
    }

    // Leer la imagen
    icon = fm.readImage(path)
   
  }
const iconImg = row.addImage(icon)
iconImg.imageSize = new Size(40, 40)
row.addSpacer(13)

let column = row.addStack()
column.layoutVertically()

const titleText = column.addText("DEFICIT")
titleText.font = Font.mediumRoundedSystemFont(13)
titleText.color= new Color("#2B72E3")

const deficitCount = column.addText(partes[1])
deficitCount.font = Font.mediumRoundedSystemFont(22)
deficitCount.textColor = new Color("#15376E")
widget.addSpacer(4)

const row2 = widget.addStack()
row2.layoutVertically()

const fecha = row2.addText(partes[0])
fecha.font = Font.regularSystemFont(11)
fecha.textColor = new Color("#2B72E3")

// CREAT WIDGET
widget.backgroundColor = new Color("#e1ecfe")

// Terminar
Script.setWidget(widget)
Script.complete()

//----------------------------------------------------
function getFlameStage(ratio) {
  // ratio ∈ [0,1]
  // Indica cuántos “tramos” hay
  //   0   -> flame0
  //   <0.25  -> flame0
  //   <0.50  -> flame1
  //   <0.75  -> flame2
  //   ≤1     -> flame3
  
  if (ratio < 0.25) return 0
  else if (ratio < 0.50) return 1
  else if (ratio < 0.75) return 2
  else return 3
}


  function getRatio(valor, max) {
    if (valor <= 0)   { return 0 }
    if (valor >= max) { return 1 }
    return valor / max
  }