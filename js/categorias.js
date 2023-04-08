$(document).ready(function () {
  $.get("/header_footer.html", function (data) {
    $("#header_footer").append(data);
  });

  const entityName = "Categoria";
  const propiedades = [
    { name: "id", type: "number" },
    { name: "nombre", type: "text" },
    { name: "descripcion", type: "text" },
    { name: "medida", type: "text" },
  ];

  const entitiesSaveName = "entities" + entityName;

  let entities = JSON.parse(localStorage.getItem(entitiesSaveName)) || [];
  let entityID = entities.length ? entities[entities.length - 1].id : 0;

  const generarModel = (actionName) => {
    let form = $("#entityModal form");
    form.html("");

    propiedades.slice(1).forEach((propiedad) => {
      form.append(`
          <div class="mb-3">
            <label for="${
              propiedad.name
            }-input" class="form-label">${toCapitalize(propiedad.name)}:</label>
            <input type="${propiedad.type}" class="form-control" id="${
        propiedad.name
      }-input" />
          </div>
        `);
    });

    $("#entityModalLabel").text(`${actionName} ${entityName}`.toUpperCase());
  };

  const generarTabla = () => {
    const tabla = $("section .container");

    tabla.append(`
        <h1>Lista de ${entityName}s</h1>
        <table id="tabla-entities" class="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              ${propiedades
                .slice(1)
                .map(
                  (propiedad) =>
                    `<th scope="col">${toCapitalize(propiedad.name)}</th>`
                )
                .join("")}
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `);
  };

  const btnAgregarEntity = () => {
    generarModel("Agregar");

    $(".modal-footer .btn-primary")
      .off("click")
      .on("click", () => {
        let entity = { id: ++entityID };

        propiedades.slice(1).forEach((propiedad) => {
          entity[propiedad.name] = $(`#${propiedad.name}-input`).val();
        });

        entities.push(entity);

        llenarTabla();
      });
  };

  const btnEditarEntity = (id) => {
    generarModel("Editar");

    let entity = entities.find((entity) => entity.id == id);

    propiedades.slice(1).forEach((propiedad) => {
      $(`#${propiedad.name}-input`).val(entity[propiedad.name]);
    });

    $(".modal-footer .btn-primary")
      .off("click")
      .on("click", () => {
        propiedades.slice(1).forEach((propiedad) => {
          entity[propiedad.name] = $(`#${propiedad.name}-input`).val();
        });

        llenarTabla();
      });
  };

  const btnEliminarEntity = (id) => {
    entities = entities.filter((entity) => entity.id !== id);
    llenarTabla();
  };

  const toCapitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.substring(1);
  };

  const llenarTabla = () => {
    localStorage.setItem(entitiesSaveName, JSON.stringify(entities));

    entityID = entities.length ? entities[entities.length - 1].id : 0;

    let tabla = $("#tabla-entities tbody");

    tabla.html("");

    entities.forEach((entity) => {
      let fila = "<tr>";

      propiedades.forEach((propiedad) => {
        fila += `<td>${entity[propiedad.name]}</td>`;
      });

      fila += `
          <td>
            <button
              class="btn btn-danger"
              id="btnEliminar-${entity.id}"
            >
              Eliminar
            </button>
            <button
              class="btn btn-success"
              id="btnEditar-${entity.id}"
              data-bs-toggle="modal"
              data-bs-target="#entityModal"
            >
                Editar
            </button>
          </td>
        </tr>`;

      tabla.append(fila);

      $(`#btnEliminar-${entity.id}`).on("click", () =>
        btnEliminarEntity(entity.id)
      );
      $(`#btnEditar-${entity.id}`).on("click", () =>
        btnEditarEntity(entity.id)
      );
    });
  };

  generarTabla();
  llenarTabla();

  $("#btnAgregar").on("click", () => btnAgregarEntity());
});
