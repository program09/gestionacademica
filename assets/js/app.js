$(document).ready(function () {
    // Manejar el clic en los ítems principales con submenús
    $('.list-main').on('click', '.item-submenu .link-main', function (e) {
        e.preventDefault(); // Evitar el comportamiento predeterminado del enlace
        const link = $(this); // El enlace clickeado
        const itemSubmenu = link.closest('.item-submenu'); // El ítem principal que contiene el submenú
        const submenu = itemSubmenu.find('.list-submenu'); // El submenú asociado
        const iconRight = link.find('.icon-right'); // El ícono de flecha
        // Cerrar todos los submenús excepto el actual
        $('.item-submenu').not(itemSubmenu).removeClass('active').find('.list-submenu').slideUp();
        $('.item-submenu').not(itemSubmenu).find('.icon-right').removeClass('rotate');
        // Alternar la clase 'active' y mostrar/ocultar el submenú actual
        itemSubmenu.toggleClass('active');
        // Rotar el ícono de flecha
        iconRight.toggleClass('rotate');
    });
});

$(document).ready(function () {
    // Inicializar PerfectScrollbar en el contenedor
    const ps = new PerfectScrollbar('.sidebar-body', {
        wheelSpeed: 2,          // Velocidad del scroll
        wheelPropagation: true, // Propagar el evento de scroll
        minScrollbarLength: 20  // Longitud mínima de la barra de scroll
    });
    // Actualizar PerfectScrollbar cuando el contenido cambie dinámicamente
    $('.sidebar-body').on('click', '.item-submenu .link-main', function (e) {
        e.preventDefault();
        ps.update();
    });
});

$(document).ready(function () {
    // Función para actualizar el estado del aside
    updateAside();
    function updateAside() {
        if ($(window).width() > 860) {if (localStorage.getItem('aside') === 'none') {$('body').addClass('aside-show');}}
        else {$('body').removeClass('aside-show');}
    }
    $('#btn-aside').click(function () {
        $('body').toggleClass('aside-show');
        if ($(window).width() > 860) {
            const asideState = $('body').hasClass('aside-show') ? 'none' : 'show';
            localStorage.setItem('aside', asideState);
        }
    });
    $('#close-aside').click(function () {
        $('body').removeClass('aside-show');
        if ($(window).width() > 860) {
            localStorage.setItem('aside', 'none');
        }
    });
    $(window).resize(updateAside);
});

$(document).ready(function () {
    // Aplicar el tema guardado al cargar la página
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {$('body').addClass('dark');}
    updateThemeIcon();
    $('#theme-mode').click(function () {
        $('body').toggleClass('dark');
        updateThemeIcon();
    });
    function updateThemeIcon() {
        const isDark = $('body').hasClass('dark');
        $('#theme-mode span').toggleClass('icon-moon', !isDark).toggleClass('icon-sun', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
});

// ESTADOS BADGE
let statusBadgeClasses = {
    activo: "bg-success-mica",    // Verde
    inactivo: "bg-danger-mica",   // Rojo
    iniciado: "bg-warning-mica", // Amarillo
    cancelado: "bg-danger",        // Gris oscuro
    cerrado: "bg-secondary",       // Por defecto
    default: "bg-info-mica"
};

function getBadgeClass(status) {
    return `<span class="badge ${statusBadgeClasses[status] || statusBadgeClasses.default} fw-600 text-capitalize">${status}</span>`
    return statusBadgeClasses[status] || statusBadgeClasses.default;
}

function statusSwitchRenderer(status, id) {
    const isChecked = status === "activo" ? "checked" : "";
    return `
        <div class="form-check form-switch">
            <input class="form-check-input status-switch" type="checkbox" data-code="${id}" ${isChecked}>
        </div>
    `;
}


function openModal(modalId) {
    const $modal = $('#' + modalId);
    if ($modal.length) {
        $modal.modal('show');
    } else {
        console.error(`No se encontró un modal con el ID: ${modalId}`);
    }
}

if($('form')){
    $('form').on('reset', function(){
        $('button.submit.updated').hide()
        $('button.submit.saved').show()
        $('#code').val('')
    })
}


document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("photo");
    const previewImg = document.getElementById("photo-preview");
    const removeBtn = document.getElementById("remove-photo");

    // Verificar si los elementos existen antes de continuar
    if (fileInput && previewImg && removeBtn) {
        fileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImg.src = e.target.result;
                    removeBtn.style.display = "block"; // Mostrar botón X
                };
                reader.readAsDataURL(file);
            }
        });

        removeBtn.addEventListener("click", function () {
            previewImg.src = "assets/images/add.webp"; // Restaurar imagen por defecto
            fileInput.value = ""; // Limpiar input
            removeBtn.style.display = "none"; // Ocultar botón X
        });
    }
});


$(document).ready(function () {
    if ($('#sesions-all').length && $('#sesion-detaill-all').length) {
        $('#sesions-all').show();
        $('#sesion-detaill-all').hide();

        $(document).on('click', '.btn-section-show', function () {
            const id = $(this).data('code'); // Obtiene el data-code del botón presionado

            $('#sesions-all').hide();
            $('#sesion-detaill-all').show();
            console.log("Código de la sesión:", id);

            if ($('#title-sesion-detaill').length) {
                $('#title-sesion-detaill').text(`Sesión ${id}`);
            }
        });

        $(document).on('click', '#close-detaills', function () {
            $('#sesions-all').show();
            $('#sesion-detaill-all').hide();
        });
    }
});

