var nuevoId;
var db = openDatabase("itemDB", "1.0", "itemDB", 65535)

//FUNCION PARA LIMPIAR LOS ESPACIOS DE PRECIO Y PRODUCTO
function limpiar() {
    document.getElementById("item").value = "";
    document.getElementById("precio").value = "";
}

//FUNCIONALIDAD DE LOS BOTONES CON jQUERY
//Boton Crear Tabla
$(function () {
    $("#crear").click(function () {
        db.transaction(function (transaction) {
            var sql = "CREATE TABLE productos " +
                "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                "item VARCHAR(100) NOT NULL, " +
                "precio DECIMAL(5.2) NOT NULL)";
            transaction.executeSql(sql, undefined, function () {
                alert("Tabla creada satisfactoriamente");
            }, function (transaction, err) {
                alert(err.message)
            })
        });
    });

    //Listar los datos de la tabla
    $("#listar").click(function(){
        cargarDatos();
    })

       //Cargar los datos de la tabla
    function cargarDatos(){
        $("#listaProductos").children().remove;
        db.transaction(function(transaction){
            var sql = "SELECT * FROM productos BY id DESC";
            transaction.executeSql(sql, function(transaction,result)){
                if (result.rows.length) {
                    $("#listaProductos").append('<tr><th>Código</th><th>Precio</th><th></th><th></th></tr>');
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows,item(i);
                        var item = row.item;
                        var id = row.id;
                        var precio = row.precio;
                        $("#listaProductos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td>A'+id+'</td><th>Precio</th><th></th><th></th></tr>');
                    }
                }
            }
        })
    }
})