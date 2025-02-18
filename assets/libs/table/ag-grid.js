class AgGridTable {
    
    constructor({ containerId, columnDefs, selectable = false, paginationPageSize = 10, actions = {} }) {
        this.containerId = containerId;
        this.columnDefs = columnDefs;
        this.selectable = selectable;
        this.paginationPageSize = paginationPageSize;
        this.actions = { show: true, position: "start", none: [], ...actions };
        this.gridApi = null;
        this.initTable();
    }

    initTable() {
        const localeText = {
            page: "",
            more: "Más",
            to: " - ",
            of: " / ",
            next: "Siguiente",
            last: "Último",
            pageSizeSelectorLabel:"",
            first: "Primero",
            previous: "Anterior",
            loadingOoo: "Cargando...",
            noRowsToShow: "No hay registros para mostrar",
            filterOoo: "Buscar en la columna",
            applyFilter: "Aplicar filtro",
            equals: "Igual a",
            notEqual: "No igual a",
            lessThan: "Menor que",
            greaterThan: "Mayor que",
            lessThanOrEqual: "Menor o igual que",
            greaterThanOrEqual: "Mayor o igual que",
            inRange: "En rango",
            contains: "Contiene",
            notContains: "No contiene",
            startsWith: "Comienza con",
            endsWith: "Termina con",
            andCondition: "Y",
            orCondition: "O",
            group: "Grupo",
            columns: "Columnas",
            filters: "Filtros",
            rowGroupColumnsEmptyMessage: "Arrastre columnas aquí para agrupar",
            valueColumnsEmptyMessage: "Arrastre columnas aquí para agregar valores",
            pivotMode: "Modo Pivote",
            groups: "Grupos",
            values: "Valores",
            pivots: "Pivotes",
            pivotColumnGroupTotals: "Totales del grupo de columnas Pivote",
            totalColumns: "Columnas Totales",
            totalRows: "Filas Totales",
            pinColumn: "Fijar columna",
            unpinColumn: "Desfijar columna",
            resetColumns: "Reiniciar columnas",
            expandAll: "Expandir todo",
            collapseAll: "Colapsar todo",
            toolPanel: "Panel de herramientas",
            export: "Exportar",
            csvExport: "Exportar CSV",
            excelExport: "Exportar Excel",
            pinLeft: "Fijar a la izquierda",
            pinRight: "Fijar a la derecha",
            noPin: "Sin fijar",
            autosizeThisColumn: "Ajustar tamaño de esta columna",
            autosizeAllColumns: "Ajustar tamaño de todas las columnas",
            groupColumns: "Columnas agrupadas",
            ungroupColumns: "Desagrupar columnas",
            reset: "Reiniciar",
            copy: "Copiar",
            copyWithHeaders: "Copiar con encabezados",
            ctrlC: "Ctrl+C",
            paste: "Pegar",
            ctrlV: "Ctrl+V",
            pivotChartTitle: "Gráfico Pivote",
            pivotChart: "Gráfico Pivote",
            columnChart: "Gráfico de Columnas",
            barChart: "Gráfico de Barras",
            lineChart: "Gráfico de Líneas",
            pieChart: "Gráfico de Pastel",
            scatterChart: "Gráfico de Dispersión",
            areaChart: "Gráfico de Área",
            treemapChart: "Gráfico de Mapa de Árbol",
            histogramChart: "Histograma",
            noDataToChart: "Sin datos para graficar",
            pivotChartEmptyMessage: "Seleccione columnas para graficar",
            showing: "Mostrando",
            rowsPerPage: "Filas por página",
            pageOf: "de",
          };
        const gridDiv = document.querySelector(`#${this.containerId}`);
        if (!gridDiv) return;

        if (this.actions.show) this.addActionColumn();
        
        const processedColumnDefs = this.columnDefs.map(col => ({
            ...col,
            headerName: col.headerName || col.field,
            minWidth: col.minWidth || 150,
            maxWidth: col.maxWidth,
            cellRenderer: col.cellRenderer || null,
            filter: col.filter,
        }));

        const gridOptions = {
            getRowId: params => params.data.id.toString(),
            rowData: null,
            columnDefs: processedColumnDefs,
            pagination: true,
            paginationPageSize: this.paginationPageSize,
            paginationPageSizeSelector: [5, 10, 15, 20, 100],
            defaultColDef: { flex: 1, filter: true, minWidth: 200, suppressHeaderMenuButton: true },
            domLayout: "autoHeight",
            suppressMenuHide: true,
            suppressExcelExport: true,
            popupParent: document.body,
            rowSelection: {
                mode: this.selectable ? "multiRow" : "singleRow",
                groupSelects: "descendants",
            },
            localeText: localeText,
            onRowSelected: event => {
                const selectedNodes = event.api.getSelectedNodes();
                if (selectedNodes.length > 10) event.node.setSelected(false);
            }
        };

        this.gridApi = agGrid.createGrid(gridDiv, gridOptions);
    }

    addActionColumn() {
        const actionsColumn = {
            headerName: "Acciones",
            cellRenderer: params => {
                const { id } = params.data;
                const isEditDisabled = this.actions.none.includes("edit");
                const isDeleteDisabled = this.actions.none.includes("delete");
                return `
                    <div class="df-center gap-2">
                        <button class="btn btn-primary-mica df-center gap-1 px-2 edit-row rounded-pill ${isEditDisabled ? "disabled d-none" : ""}" data-code="${id}">
                            <span class="icon icon-18 icon-edit-3"></span>
                        </button>
                        <button class="btn btn-danger-mica df-center gap-1 px-2 delete-row rounded-pill ${isDeleteDisabled ? "disabled d-none" : ""}" data-code="${id}">
                            <span class="icon icon-18 icon-delete-1"></span>
                        </button>
                    </div>
                `;
            },
            minWidth: 110,
            maxWidth: 110,
            sortable: false,
            filter: false,
            suppressSizeToFit: true,
        };
        if (this.actions.position === "start") this.columnDefs.unshift(actionsColumn);
        else this.columnDefs.push(actionsColumn);
    }

    setupActionHandlers(onEdit = null, onDelete = null) {
        const gridDiv = document.querySelector(`#${this.containerId}`);
        const isEditDisabled = this.actions.none.includes("edit");
        const isDeleteDisabled = this.actions.none.includes("delete");
        if (!gridDiv) return;
        if(this.actions.show){
            gridDiv.addEventListener("click", (event) => {
                const editBtn = event.target.closest(".edit-row");
                const deleteBtn = event.target.closest(".delete-row");
                if(!isEditDisabled){
                    if (editBtn && typeof onEdit === "function") {
                        const rowId = editBtn.getAttribute("data-code");
                        onEdit(rowId);
                    }
                }
                if(!isDeleteDisabled){
                    if (deleteBtn && typeof onDelete === "function") {
                        const rowId = deleteBtn.getAttribute("data-code");
                        onDelete(rowId);
                    }
                }
            });
        }
    }
    

    setRows(data) {
        this.gridApi.setGridOption("rowData", data);
    }

    addRow(data) {
        if (!data || typeof data !== "object") return false;
        this.gridApi.applyTransaction({ add: [data], addIndex: 0 });
        return !!this.gridApi.getRowNode(data.id);
    }

    deleteRowById(rowId) {
        if (!rowId) return;
        const rowNode = this.gridApi.getRowNode(rowId);
        if (rowNode) this.gridApi.applyTransaction({ remove: [rowNode.data] });
    }

    deleteRowsByIds(rowIds = []) {
        if (!rowIds.length) return;
        const rowsToRemove = rowIds.map(id => this.gridApi.getRowNode(id)).filter(node => node);
        if (rowsToRemove.length) this.gridApi.applyTransaction({ remove: rowsToRemove.map(node => node.data) });
    }

    showDelete(btn = 'del-selected') {
        let $btn = $('#' + btn);
        if ($btn.length === 0) {
            $btn = $(`<button id="${btn}" class="btn btn-danger" style="display: none;">Seleccionados <span></span></button>`);
            $('.agGrid').append($btn);
        }
    
        const nodes = this.gridApi.getSelectedNodes();
        if (nodes.length > 0) { $btn.show().find('span').text(nodes.length);}
        else {$btn.hide();}
    }
    

    updateRowFieldById(rowId, field, newValue) {
        if (!rowId || !field) return;
        const rowNode = this.gridApi.getRowNode(rowId);
        if (rowNode) {
            const updatedData = { ...rowNode.data, [field]: newValue };
            this.gridApi.applyTransaction({ update: [updatedData] });
        }
    }


    clearRows() {
        const allNodes = [];
        this.gridApi.forEachNode(node => allNodes.push(node.data));
        this.gridApi.applyTransaction({ remove: allNodes });
    }

    filterText(value) {
        this.gridApi.setGridOption("quickFilterText", value);
    }

    exportToExcel() {
        const rowData = [];
        this.gridApi.forEachNode(node => rowData.push(node.data));
        const ws = XLSX.utils.json_to_sheet(rowData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Datos");
        XLSX.writeFile(wb, "tabla_exportada.xlsx");
    }

    selectRow(id) {
        this.gridApi.getRowNode(id)?.setSelected(true);
    }

    unselectRow(id) {
        this.gridApi.getRowNode(id)?.setSelected(false);
    }

    enableRealTimeSelectionUpdate(callback) {
        this.gridApi.addEventListener("selectionChanged", () => {
            const selectedData = this.getSelectedRows();
            if (callback && typeof callback === "function") callback(selectedData);
        });
    }

    getSelectedRows() {
        const nodes = this.gridApi.getSelectedNodes();
        return {
            items: nodes.map(node => node.id),
            nodes,
            count: nodes.length,
        };
    }
}

