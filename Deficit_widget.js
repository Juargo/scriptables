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
