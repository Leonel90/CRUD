var nuevoId;
var db = openDatabase("itemDB", "1.0", "itemDB", 65535)

//FUNCION PARA LIMPIAR LOS ESPACIOS DE PRECIO Y PRODUCTO
function limpiar() {
    document.getElementById("item").value = "";
    document.getElementById("precio").value = "";
}

//FUNCIONALIDAD DE LOS BOTONES CON jQUERY
//Eliminar Registro
function eliminarRegistro() {
    $(document).one('click', 'button[type="button"]', function (event) {
        let id = this.id;
        var lista = [];
        $('#listaProductos').each(function () {
            var celdas = $(this).find('tr.Reg_A' + id);
            celdas.each(function () {
                var registro = $(this).find('span.mid');
                registro.each(function () {
                    lista.push($(this).html())
                });
            });
        });
        nuevoId = lista[0].substr(1);
        alert(nuevoId);
        db.transaction(function(transaction) {
            var sql = "DELETE FROM productos WHERE id=" + nuevoId + ";"
            transaction.executeSql(sql, undefined, function () {
                alert("Registro Borrado correctamente, Por favor actualice la tabla")
            }, function (transaction, err) {
                alert("err.message");
            })
        })
    });
}

//Boton Crear Tabla de productos
$(function () {
    $("#crear").click(function () {
        db.transaction(function (transaction) {
            var sql = "CREATE TABLE productos " +
                "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                "item VARCHAR(100) NOT NULL, " +
                "precio DECIMAL(5,2) NOT NULL)";
            transaction.executeSql(sql, undefined, function () {
                alert("Tabla creada satisfactoriamente");
            }, function (transaction, err) {
                alert(err.message)
            })
        });
    });

    //Listar los datos de la tabla carga lista de productos
    $("#listar").click(function () {
        cargarDatos();
    })

    //Función para listar y pintar  tabla de productos en la página web
    function cargarDatos() {
        $("#listaProductos").children().remove();
        db.transaction(function (transaction) {
            var sql = "SELECT * FROM productos ORDER BY id DESC";
            transaction.executeSql(sql, undefined, function (transaction, result) {
                if (result.rows.length) {
                    $("#listaProductos").append('<tr><th>Código</th><th>Producto</th><th>Precio</th><th></th><th><th></th></tr>');
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        var item = row.item;
                        var id = row.id;
                        var precio = row.precio;
                        $("#listaProductos").append('<tr id="fila' + id + '" class="Reg_A' + id + '"><td><span class="mid">A' +
                            id + '</span></td><td><span>' + item + '</span></td><td><span>' +
                            precio + ' USD$</span></td><td><button type="button" id="A'+id+'" class="btn btn-success"><img src="/img/edit.png"/></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger"onclick="eliminarRegistro()" ><img src="/img/delete.jpg"/></button></td></tr>');
                    }
                } else {
                    $("#listaProductos").append('<tr><td colspan="5" align="center">No existe registros de productos</td></tr>');
                }
            }, function (transaction, err) {
                alert(err.message);
            })
        })
    }

    //insertar registros
    $("#insertar").click(function () {
        var item = $("#item").val();
        var precio = $("#precio").val();
        db.transaction(function (transaction) {
            var sql = "INSERT INTO productos(item,precio) VALUES(?,?)";
            transaction.executeSql(sql, [item, precio], function () {
            }, function (transaction, err) {
                alert(err.message)
            })
        })
        limpiar();
        cargarDatos();
    })

    //Para borrar todos los registros
    $("#borrarTodo").click(function () {
        if (!confirm("Está seguro de borrar la tabla?, los datos se perderán permanentemente", ""))
            return;
        db.transaction(function (transaction) {
            var sql = "DROP TABLE productos";
            transaction.executeSql(sql, undefined, function () {
                alert("Tabla borrada correctamente, por favor, actualice la página")
            }, function (transaction, err) {
                alert(err.message)
            })
        })
    })
})