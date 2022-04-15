class ConectorSheet{
    constructor(){
        this.idSheet = null;
        this.entidad = [];
        this.hojasConsulta = [];
        this.ultimosDatosConsultados = [];
    }

    abrirHojaCalculo(){
        return SpreadsheetApp.openById(this.idSheet);
    }

    crearConexion(idSheet){
        this.idSheet = idSheet;
    }
    
    crearMapeoDatos (entidad){
        /*
        Ejemplo de los datos a recibir

        let persona = {
            hoja : 'PERSONA',
            atributos : {
                nombre : 'String',
                fechaNacimiento : 'Date(dd/mm/yyyy)'
            }
        }
        */
        this.entidad.push(entidad);
    }

    convertirDatos(registro,tipoDato){
        const formatoFecha = (formato) =>{
            let fecha = new Date(registro);
            let dia = fecha.getDate() > 9 ? fecha.getDate() : '0'+fecha.getDate();
            let mes = (fecha.getMonth()+1) > 9 ? (fecha.getMonth()+1) : '0'+(fecha.getMonth()+1);
            let ano = fecha.getFullYear();
            let horas = fecha.getHours() > 9 ? fecha.getHours() : '0'+fecha.getHours();
            let minutos = fecha.getMinutes() > 9 ? fecha.getMinutes() : '0'+fecha.getMinutes();
            let segundos = fecha.getSeconds() > 9 ? fecha.getSeconds() : '0'+fecha.getSeconds();
            switch(formato){
                case 'dd/mm/yyyy' :
                    return dia+'/'+mes+'/'+ano;
                case 'dd/mm/yyyy HH:MM:SS' :
                    return dia+'/'+mes+'/'+ano+' '+horas+':'+minutos+':'+segundos;
                case 'Date' :
                    return String(fecha);
            }
        }
        switch(String(tipoDato)){
            case 'String' :
                return String(registro);
            case 'Integer' :
                return parseInt(registro);
            case 'Float' :
                return parseFloat(registro);
            case 'Date(dd/mm/yyyy)' :
                return formatoFecha('dd/mm/yyyy');
            case 'Date(dd/mm/yyyy HH:MM:SS)' :
                return formatoFecha('dd/mm/yyyy HH:MM:SS');
            case 'Date()' :
                return formatoFecha('Date');
        }
    }

    getDatos(entidad,ahorroDatos){
        let datos = [];
        if(ahorroDatos==true){
            if(this.ultimosDatosConsultados.length>0){
                //Si activamos el ahorro de datos se reutilizan los ultimos datos de la ultima consulta
                datos = this.ultimosDatosConsultados;
            }else{
                //Si todabía esos registro no existen se obtienen los datos de un sheet nuevo y se guardan en ultimosDatosConsultados
                datos = this.obtenerDatosDeUnExcel(entidad);
                this.ultimosDatosConsultados = datos;
            }
        }else{//Si no hay ahorro de datos se vuelve a obtener los datos de un sheet
            datos = this.obtenerDatosDeUnExcel(entidad);
            this.ultimosDatosConsultados = datos;
        }
        let datosFinales = [];
        if(datos.length>0){
            datosFinales = datos.map((registros,indexFila)=>{
                let union = [];
                let bandera = true;
                registros.forEach((registro, indice)=>{
                    let nombreLlave = Object.keys(entidad.atributos)[indice];
                    let tipoDato = entidad.atributos[Object.keys(entidad.atributos)[indice]];
                    if(bandera==true){
                        bandera = false;
                        union = {[nombreLlave] : this.convertirDatos(registro,tipoDato)};
                    }else{
                        union = Object.assign(union,{[nombreLlave] :this.convertirDatos(registro,tipoDato)});
                    }
                    /*if(indice+1==registros.length){
                        union = {['id_tabla_inventado'] : indexFila};
                        union = Object.assign(union,{['id_tabla_inventado'] :'id_tabla_inventado'});
                    }*/
                });
                Object.assign(union,{['id_tabla'] :indexFila});
                return union;
            });
        }
        return datosFinales;
    }

    _obtenerEntidad(nombreHoja){
        let hojaSeleccionada = [];
        this.entidad.forEach(entidad=>{
            if(entidad.hoja==nombreHoja){
                hojaSeleccionada = entidad;
            }
        });
        return hojaSeleccionada;
    }

    consultarHojas(arrayHojas){
        /* EJemplo
            let hojas = ['FAMILIA','ARTICULOS'];
        */
       this.hojasConsulta = arrayHojas;
    }

    obtenerDatosDeUnExcel(entidad){
        var ws = "";
        var data = [];
        try {
            ws = this.abrirHojaCalculo().getSheetByName(entidad.hoja);
            data = ws.getRange(1, 1, ws.getLastRow(),parseInt((Object.keys(entidad.atributos).length))).getValues();
            if(data.length==0){
                data = [];
            }
            return data;
        } catch (error) {
            Logger.log(error);
            return [];
        }
    }

    eliminarRegistro(idEliminar,entidad){
        var ws = "";
        var data = [];
        ws = this.abrirHojaCalculo().getSheetByName(entidad.hoja);
        var numeroTotalFilas = ws.getDataRange().getLastRow();
        //Obtenemos la columna 1, desde la fila 1, hasta el numero total de filas, obtenemos los datos y los convertimos en String
        var ids = ws.getRange(1,1,numeroTotalFilas).getValues().map(r=> r[0].toString());
        //Buscamos el id en el vector obtenido anteriormente
        let indiceDelId = ids.indexOf(idEliminar.toString());
        ws.deleteRow(parseInt(indiceDelId)+1);
    }

    editarRegistro(id,datos,entidad){
        const cantidadDatos = parseInt(Object.keys(datos).length);
        var ws = "";
        var data = [];

        ws = this.abrirHojaCalculo().getSheetByName(entidad.hoja);
        var numeroTotalFilas = ws.getDataRange().getLastRow();
        //Obtenemos la columna 1, desde la fila 1, hasta el numero total de filas, obtenemos los datos y los convertimos en String
        var ids = ws.getRange(1,1,numeroTotalFilas).getValues().map(r=> r[0].toString());
        //Buscamos el id en el vector obtenido anteriormente
        let indiceDelId = ids.indexOf(id.toString());
        let datosModificar = [];
        for (var nombreKeyEntidad in entidad.atributos) {
            for (var nombreKeyDatos in datos) {
                if(nombreKeyDatos==nombreKeyEntidad){
                    datosModificar.push(datos[nombreKeyDatos]);
                }
            }
        }
        ws.getRange(parseInt(indiceDelId)+1, 2, 1, cantidadDatos).setValues([datosModificar]);
    }

    agregarRegistro(datos,entidad){
        const hoja = this.abrirHojaCalculo().getSheetByName(entidad.hoja);
        //Generamos un un id 
        var ahora = new Date();
        var nuevoID = String(ahora.getDate())
                      + String(parseInt(ahora.getMonth())+1)
                      + String(ahora.getFullYear())
                      + String(ahora.getHours())
                      + String(ahora.getMinutes())
                      + String(ahora.getSeconds())
                      + String(ahora.getMilliseconds())
                      + String(Math.floor(Math.random() * (20 - 1)) + 1);
        nuevoID = entidad.hoja[0]+entidad.hoja[1]+entidad.hoja[2]+String(nuevoID);
        //Lo agregamos a la hoja


        let datosInsertar = [];
        datosInsertar.push(nuevoID);
        for (var nombreKeyEntidad in entidad.atributos) {
            for (var nombreKeyDatos in datos) {
                if(nombreKeyDatos==nombreKeyEntidad){
                    datosInsertar.push(datos[nombreKeyDatos]);
                }
            }
        }
        Logger.log(datosInsertar);
        hoja.appendRow(datosInsertar);
        return nuevoID;
    }

    insertar(json){
        /*
            Ejemplo :
            let persona = {
                idFamilia : '1',
                nombre : 'Clara',
                apellidoPaterno : 'Standen',
                fechaNacimiento : '02/08/2010'
            }
         */
        Logger.log(json);
        let idInsertado = null;
        this.hojasConsulta.forEach(nombreHoja=>{
            idInsertado = this.agregarRegistro(json,this._obtenerEntidad(nombreHoja));
        });
        return idInsertado;
    }

    modificar(id,json){
        /*
            Ejemplo : Sin el id
            let persona = {
                nombre : 'Clara',
                apellidoPaterno : 'Standen',
                fechaNacimiento : '02/08/2010'
            }
         */
        this.hojasConsulta.forEach(nombreHoja=>{
            this.editarRegistro(id,json,this._obtenerEntidad(nombreHoja));
        });
    }

    eliminar(id){
        this.hojasConsulta.forEach(nombreHoja=>{
            this.eliminarRegistro(id,this._obtenerEntidad(nombreHoja));
        });
    }

    sql(sql, ahorroDatos = false){
        //El ahorro de datos permite reutilizar los datos de la ultima consulta realizada
        //let tablas = this.hojasConsulta.map(nombreHoja=>{
        var db = new alasql.Database();
        this.hojasConsulta.forEach(nombreHoja=>{
            db.exec('CREATE TABLE '+nombreHoja);
            db.tables[nombreHoja].data = this.getDatos(this._obtenerEntidad(nombreHoja),ahorroDatos);
        });
        return db.exec(sql);
    }
}