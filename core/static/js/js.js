var sizeTheOverlays = function () {
    $(".overlay").resize().each(function () {
        var h = $(this).parent().outerHeight();
        var w = $(this).parent().outerWidth();
        $(this).css("height", h);
        $(this).css("width", w);
    });
};

sizeTheOverlays();


var width = $(window).width();
$(window).resize(function () {
    if ($(this).width() != width) {
        width = $(this).width();
        sizeTheOverlays();
    }
});


function getCategoriaDetail(id, title, url) {
    var modal = "<div class='modal fade votar-modal' tabindex='-1' role='dialog' aria-labelledby='votar-modal' aria-hidden='true'></div>";
    $("#categorias").prepend(modal);

    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        success: function (data) {
            if (data) {
                criarModal(data);
            }
        }
    });
}

var categoria_id;

function criarModal(categoria) {
    var modal_dialog = "<div class='modal-dialog modal-lg'></div>";
    var modal_content = " <div class='modal-content'></div>";
    var modal_header = "<div class='modal-header align-center'></div>";
    var modal_title = "<h5 class='modal-title'></h5>";
    var closeModalBtn = "<button type='button' class='close' aria-label='Close' onclick='closeModal()'><span aria-hidden='true'>&times;</span></button>";
    var modal_body = '<div class="modal-body"><div class="row"><div class="col-md-12"><div class="card mb-3"><img class="categoria-img" src="" style="animation: unset; max-height: 300px;"></div><form class="was-validated"><div class="form-group align-center"><select class="custom-select select-participante" required><option class="select-concorrente" value="">Seleciona o concorrente</option></select><div class="invalid-feedback">Por favor seleciona o concorrente</div></div><div class="mbr-section-btn align-center"><a class="btn btn-sm bg-theme-color display-4" onclick="votar()"><span class="mbri-paper-plane mbr-iconfont mbr-iconfont-btn"></span>SUBMETER</a></div></form></div></div>';

    $(".modal").append(modal_dialog);
    $(".modal-dialog").append(modal_content);
    $(".modal-content").append(modal_header);
    $(".modal-header").append(modal_title);
    $(".modal-header").append(closeModalBtn);
    $(".modal-content").append(modal_body);

    $(".modal-title").html(categoria.title);

    categoria_id = categoria.id;

    for (var key in categoria.participantes) {
        if (categoria.participantes.hasOwnProperty(key)) {
            $('.select-concorrente').after(' <option class="option-concorrente" value="' + categoria.participantes[key].id + '">' + categoria.participantes[key].nome + '</option>')
        }
    }

    var url = categoria.imagem_url.replace(/^"(.*)"$/, '$1');
    if (!!url) {
        $(".categoria-img").attr("src", "http://localhost:8000" + url);
    } else {
        $(".categoria-img").attr("src", "http://localhost:8000/static/img/award-bg.jpg");
    }

}

function closeModal() {
    $("body").removeClass("modal-open");
    $('.modal-backdrop').fadeOut(function () {
        $(this).remove();
    });
    $('.modal').addClass('animated fadeOutUp', function () {
        $(this).remove();
    });
}

function votar() {
    let id = $(".select-participante").val();
    let url = '/ajax-votar/' + categoria_id + '/' + id + "/";
    $.ajax({
        type: "POST",
        headers: {"X-CSRFToken": $.cookie("csrftoken")},
        url: url,
        dataType: 'json',
        success: function (data) {
            if (data.concluido == true) {
                console.log(data.mensagem);
                closeModal();
                $.notify({
                    title: '<i class="fas fa-check-circle"></i>',
                    message: data.mensagem,
                }, {
                    type: 'pastel-success',
                    delay: 2000,
                    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                        '<span data-notify="title" class="text-center">{1}</span>' +
                        '<span data-notify="message" class="text-center">{2}</span>' +
                        '</div>'
                });
            }
            else {
                closeModal();

                $.notify({
                    title: '<i class="fas fa-exclamation-circle"></i>',
                    message: data.mensagem,
                }, {
                    type: 'pastel-danger',
                    delay: 2000,
                    template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                        '<span data-notify="title" class="text-center">{1}</span>' +
                        '<span data-notify="message" class="text-center">{2}</span>' +
                        '</div>'
                });

            }
        }
    });
}

$(".bottom-centered").animate({
        fontSize: "1.3em",
        borderWidth: "10px",
    }, function () {
        $(".bottom-centered").css("background-color", "rgba(36, 36, 36, 0.95)");
    }
);