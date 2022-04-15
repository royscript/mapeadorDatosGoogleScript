//Mapeo Entidades
var conexion = new ConectorSheet();
conexion.crearConexion('1ujJO2_0HxoMPM9jIjIjVrIzMXoDJGPq0qAmx4pYtE2M');
//--------------------------ALUMNOS-----------------------------
conexion.crearMapeoDatos({
    hoja : 'alumnos',
    atributos : {
        jornada : 'String',
        curso : 'String',
        numero : 'String',
        foto : 'String',
        esNuevo : 'String',
        fechaMatricula : 'String',
        curso2021 : 'String',
        apPaterno : 'String',
        apMaterno : 'String',
        nombres : 'String',
        fechaNacimiento : 'String',
        edad : 'String',
        rut : 'String',//pk alumno
        direccion : 'String',
        telefonos : 'String',
        informeSocial : 'String',
        nivelacionEstudios : 'String',
        situacionLaboral : 'String',
        contrato : 'String',
        horarioTrabajo : 'String',
        antecedentesMorbidos : 'String',
        correoAlumno : 'String'
    }
});

//--------------------------FOTOS-----------------------------
conexion.crearMapeoDatos({
    hoja : 'fotos',
    atributos : {
        id : 'String',//pk fotos
        nombres : 'String',
        apPaterno : 'String',
        apMaterno : 'String',
        rut : 'String',//fk alumno
        curso : 'String',
        nombreFoto : 'String',
        ano : 'String',
        idFoto : 'String'
    }
});

//--------------------------VISITAS-----------------------------
conexion.crearMapeoDatos({
    hoja : 'visitas',
    atributos : {
        id : 'String',//pk visitas
        fechaVisita : 'String',
        rutAlumno : 'String',//fk alumno
        domicilioRealizado : 'String',
        motivo : 'String',
        observacion : 'String',
        quienAtendio : 'String',
        responsableVisita : 'String',
        profesorJefe : 'String',
        Correo : 'String',
        urlArchivo : 'String'
    }
});
//--------------------------EMPELADOS-----------------------------
conexion.crearMapeoDatos({
    hoja : 'empleados',
    atributos : {
        nombre : 'String',
        curso : 'String',
        email : 'String',//pk docente
        sexo : 'String'
    }
});