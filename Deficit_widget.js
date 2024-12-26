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
const CANVAS_SIZE = new Size(100, 100)

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
    let ratio = getRatio(VALOR, MAXIMO)

    //----------------------------------------------------
    // 5) Generar la imagen final con relleno parcial
    //----------------------------------------------------
    let tinted = createTintedSymbol(SYMBOL_NAME, CANVAS_SIZE, FILL_COLOR)
    icon = partialFill(tinted, ratio)
   
  }
const iconImg = row.addImage(icon)
iconImg.imageSize = new Size(40, 40)
row.addSpacer(13)

let column = row.addStack()
column.layoutVertically()

const titleText = column.addText("DEFICIT")
titleText.font = Font.mediumRoundedSystemFont(13)


const deficitCount = column.addText(partes[1])
deficitCount.font = Font.mediumRoundedSystemFont(22)
deficitCount.textColor = new Color("#cfddf4")
widget.addSpacer(4)

const row2 = widget.addStack()
row2.layoutVertically()

const fecha = row2.addText(partes[0])
fecha.font = Font.regularSystemFont(11)

// CREAT WIDGET
widget.backgroundColor = new Color("#e1ecfe")

// Terminar
Script.setWidget(widget)
Script.complete()

function createTintedSymbol(symbolName, size, color) {
    let ctx = new DrawContext()
    ctx.size = size
    ctx.opaque = false
    
    // Ponemos el color de “relleno”
    ctx.setFillColor(color)
    
    // Cargamos el SF Symbol
    let sfSymbol = SFSymbol.named(symbolName)
    let sfImage  = sfSymbol.image
    
    // "drawTemplateImageInRect" dibuja usando la alpha del símbolo
    // como máscara, aplicando el color que definimos con setFillColor
    ctx.drawTemplateImageInRect(sfImage, new Rect(0, 0, size.width, size.height))
    
    return ctx.getImage()
  }

  function partialFill(img, ratio) {
    // ratio debe ir de 0 a 1
    // Si valor <= 0 => ratio=0 => nada relleno
    // Si valor >= max => ratio=1 => relleno total
    
    let ctx = new DrawContext()
    ctx.size = img.size
    ctx.opaque = false
    
    // Calculamos cuántos pixeles se rellenan
    let fillHeight = img.size.height * ratio
    let y = img.size.height - fillHeight
    
    // Definimos la región a dibujar (sólo la parte inferior)
    ctx.clipRect(new Rect(0, y, img.size.width, fillHeight))
    
    // Dibujamos la imagen tinteada dentro de esa región
    ctx.drawImageInRect(img, new Rect(0, 0, img.size.width, img.size.height))
    
    return ctx.getImage()
  }

  function getRatio(valor, max) {
    if (valor <= 0)   { return 0 }
    if (valor >= max) { return 1 }
    return valor / max
  }