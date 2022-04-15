# mapeadorDatosGoogleScript
Permite mapear datos de sheets de Google para consultarlos con sql, ingresarlos (con una funcion especial, ver ejemplos) generando un id, modificarlos (con una funcion especial, ver ejemplos) y eliminarlos (con una funcion especial, ver ejemplos).
## Instrucciones

agregar conectorSheet.js como archivo gs (google script) para que trabaje desde del lado del servidor.
Utiliza como base alasql, el archivo con el plugin es conectorSheet.js

## Crear conexión
```
var conexion = new ConectorSheet();
conexion.crearConexion('id de google sheet');
```

## Mapeo de datos
```
conexion.crearMapeoDatos({
    hoja : 'nombre hoja del sheet',
    atributos : {
        atributo : 'tipo', //String, Integer, Float, Date(dd/mm/yyyy), Date(dd/mm/yyyy HH:MM:SS), Date()
        curso : 'String',
        email : 'String',
        sexo : 'String'
    }
});
```

Cada atributo corresponde desde la primera hasta al ultima columna
```
conexion.crearMapeoDatos({
    hoja : 'nombre hoja del sheet',//El nombre de las hojas no puede tener espacios o comenzar con numeros
    atributos : {
        atributo : 'tipo', //corresponde a la columna A
        curso : 'String',//corresponde a la columna B
        email : 'String',//corresponde a la columna C
        sexo : 'String'//corresponde a la columna D
        //asi sucesibamente
    }
});
```

## Consultas
Debes de escribir el nombre de las hojas de google sheets, no deben empezar los nombres con numeros ni tener espacios
```
conexion.consultarHojas(['nombre hoja del sheet 1','nombre hoja del sheet 2']);
let sql = `SELECT *
            FROM nombre_hoja_del_sheet_1
            INNER JOIN nombre_hoja_del_sheet_2
            ON(alumnos.rut=fotos.rut)
            WHERE curso LIKE "${curso}"`;
return conexion.sql(sql);
```

## Insertar
```
insertar(parametros,archivos){
    conexion.consultarHojas(['justificaciones']);
    if(archivos!=null){
        //Retorna el id del registro insertado
        parametros.urlArchivo = this.almacenarArchivo(archivos).url;
    }
    return {
        id : String(conexion.insertar(parametros)),
        parametros : parametros
    };
}
```
## Modificar
```
modificar(parametros,archivos,idJustificacion){
    conexion.consultarHojas(['justificaciones']);
    if(archivos!=null){
        //Retorna el id del registro insertado
        parametros.urlArchivo = this.almacenarArchivo(archivos).url;
    }
    return conexion.modificar(idJustificacion,parametros);
}
```
## Eliminar
```
eliminar(id){
    conexion.consultarHojas(['alumno']);
    return conexion.eliminar(id);
}
```

## Almacenar archivo en Google Drive
```
almacenarArchivo(objFoto){
    var idNuevo = null;
    //Almacenar foto
    const blob = Utilities.newBlob(Utilities.base64Decode(objFoto.data),objFoto.mimeType,objFoto.fileName);
    const id = 'id carpeta google drive';
    const folder = DriveApp.getFolderById(id);
    const file = folder.createFile(blob);
    const fileURL = file.getUrl();
    const response = {
        'fileName' : objFoto.fileName,
        'url' : fileURL,
        'status' :true,
        'data' : JSON.stringify(objFoto)
    }
    //Fin Almacenar foto
    return response;
}
```

## Eliminar archivo de Google Drive
Para utilizar esta funcion solo debes alimentarla con el id del archivo a eliminar
```
eliminarArchivo(idArchivo){
        DriveApp.getFileById(idArchivo).setTrashed(true);
}
```
