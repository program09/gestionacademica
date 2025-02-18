$(document).ready(function () {
  // Uso de la clase:
  const statusRenderer = (params) => {
    const status = params.value?.toLowerCase(); 
    return getBadgeClass(status);
  };

  // Definir la columna con el cellRenderer
  const columnDefs = [
    { field: "id", headerName: "Código" },
    { field: "name", headerName: "Año académico" },
    { field: "start", headerName: "Fecha de inicio", filter: 'agDateColumnFilter' },
    { field: "end", headerName: "Fecha de fin", filter: 'agDateColumnFilter' },
    { field: "status", headerName: "Estado", cellRenderer: statusRenderer,},
  ];

  // Inicializar la tabla
  const table = new AgGridTable({
    containerId: "myGrid",
    columnDefs: columnDefs,
    selectable: true,
    actions: {position: "end"},
  });

  // Agregar datos de ejemplo
  table.setRows([
    { id: 1, name: "John Doe", status: "Activo" },
    { id: 2, name: "Jane Doe", status: "Inactivo" },
    { id: 3, name: "Alex Smith", status: "Pendiente" },
    { id: 4, name: "Maria Garcia", status: "Suspendido" },
  ]);

  table.enableRealTimeSelectionUpdate((s) => {
    table.showDelete()
    $('#del-selected').click(function(){
      table.deleteRowsByIds(s.items)
    })
  });

  table.setupActionHandlers(
    (rowId) => {
      console.log(`Editar fila con ID: ${rowId}`); openModal('modalId')
      $('button.submit.saved').hide()
      $('button.submit.updated').show()
    },
    (rowId) => {console.log(`Eliminar fila con ID: ${rowId}`);
    }
  );


});
