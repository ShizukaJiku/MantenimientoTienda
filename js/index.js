$(document).ready(function () {
  $.get("/header_footer.html", function (data) {
    $("#header_footer").append(data);
  });

  const llenarTabla = (entityName) => {
    let entities =
      JSON.parse(localStorage.getItem("entities" + entityName)) || [];

    let propiedades = Object.keys(entities[0]);

    let tabla = $(`.table${entityName} tbody`).empty();

    entities.forEach((entity) => {
      let fila = $("<tr>");

      propiedades.forEach((propiedad) => {
        fila.append($("<td>").text(entity[propiedad]));
      });

      tabla.append(fila);
    });
  };

  llenarTabla("Producto");
  llenarTabla("Pedido");
  llenarTabla("Cliente");
});
