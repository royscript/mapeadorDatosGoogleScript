class Alumno{
    constructor(seleccionar,parametros = null){
        switch(seleccionar){
            case 'listar':
                    return this.listar(parametros);
        }
    }
    
    buscarAlumnosCurso(curso){
        conexion.consultarHojas(['alumnos','fotos']);
        let sql = `SELECT *
                    FROM alumnos
                    INNER JOIN fotos
                    ON(alumnos.rut=fotos.rut)
                    WHERE curso LIKE "${curso}"`;
        return conexion.sql(sql);
    }
    listar(parametros){
        //Ejemplo consulta relacional
        var cursos = ['1NMA','1NMB','2NMA','2NMB','2NMC','3NBA'];
        let alumnos = [];
        cursos.forEach(curso=>{
            alumnos.push({
                curso : curso,
                alumnos : this.buscarAlumnosCurso(curso)
            });
        });
        return {
            alumnos : alumnos,
            docentes : this.listarDocentes()
        };
    }
    listarDocentes(){
        conexion.consultarHojas(['empleados']);
        let sql = `SELECT *
                    FROM empleados
                    WHERE curso NOT LIKE 'curso'`;
        let resultado = conexion.sql(sql);
        return {
            registros : resultado
        };
    }
}

function controladorAlumno(seleccionar,parametros){
    return new Alumno(seleccionar,parametros);
}