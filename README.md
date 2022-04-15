# mapeadorDatosGoogleScript
Permite mapear datos de sheets de Google
Instrucciones

agregar conectorSheet.js como archivo gs (google script) para que trabaje desde del lado del servidor

Crear conexión
var conexion = new ConectorSheet();
conexion.crearConexion('id de google sheet');

//Mapeo de datos
conexion.crearMapeoDatos({
    hoja : 'nombre hoja del sheet',
    atributos : {
        atributo : 'tipo', //String, Integer, Float, Date(dd/mm/yyyy), Date(dd/mm/yyyy HH:MM:SS), Date()
        curso : 'String',
        email : 'String',
        sexo : 'String'
    }
});

conexion.crearMapeoDatos({
    hoja : 'nombre hoja del sheet',//El nombre de las hojas no puede tener espacios o comenzar con numeros
    atributos : {
        atributo : 'tipo', //corresponde a la celda A
        curso : 'String',//corresponde a la celda B
        email : 'String',//corresponde a la celda C
        sexo : 'String'//corresponde a la celda D
        //asi sucesibamente
    }
});

//Consultas
conexion.consultarHojas(['nombre hoja del sheet 1','nombre hoja del sheet 2']);
let sql = `SELECT *
            FROM nombre_hoja_del_sheet_1
            INNER JOIN nombre_hoja_del_sheet_2
            ON(alumnos.rut=fotos.rut)
            WHERE curso LIKE "${curso}"`;
return conexion.sql(sql);

//Insertar
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
//Modificar
modificar(parametros,archivos,idJustificacion){
    conexion.consultarHojas(['justificaciones']);
    if(archivos!=null){
        //Retorna el id del registro insertado
        parametros.urlArchivo = this.almacenarArchivo(archivos).url;
    }
    return conexion.modificar(idJustificacion,parametros);
}
//Eliminar
eliminar(id){
    conexion.consultarHojas(['alumno']);
    return conexion.eliminar(id);
}
