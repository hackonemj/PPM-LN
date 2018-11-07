from django.db.models import F
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views import generic

from core.models import Categoria, Participante


def inicio(request):
    template_name = 'inicio.html'
    num_categorias = Categoria.objects.all().count()

    # Create an empty list to store unique elements
    num_participantes = []

    # Iterate over the original list and for each element
    # add it to uniqueList, if its not already there.
    for elem in Participante.objects.all():
        if elem.nome not in num_participantes:
            num_participantes.append(elem.nome)

    context = {
        'participantes': len(num_participantes),
        'categorias': num_categorias,
    }
    return render(request, template_name, context)


class CategoriaView(generic.ListView):
    template_name = 'categoria.html'
    context_object_name = 'latest_category_list'

    def get_queryset(self):
        """Return last five published questions"""
        # return Categoria.objects.order_by('-pub_date')[:5]
        return Categoria.objects.order_by('-pub_date')


def ResultadoList(request):
    template_name = 'resultados.html'
    context = {
        'participantes': Participante.objects.all().order_by("-votos", 'nome'),
        'categorias': Categoria.objects.all(),
    }
    return render(request, template_name, context)


def ajax_categoria_detail(request, id):
    categoria = get_object_or_404(Categoria, id=id)

    if request.is_ajax():

        participantes = []

        for p in Participante.objects.filter(categoria__area=categoria.area).all():
            data = {'id': p.id, 'nome': p.nome, 'votos': p.votos}
            participantes.append(data)

        data = {
            'title': categoria.area,
            'id': categoria.id,
            'participantes': participantes,
            'imagem_url': categoria.imagem.url,
        }
        return JsonResponse(data)
    else:
        raise Http404


def ajax_votar(request, categoria_id, participante_id):
    mensagem = None
    concluido = False

    if request.is_ajax():
        categoria = Categoria.objects.get(id=categoria_id)

        if categoria.area not in request.session:
            for x in Participante.objects.filter(categoria__area=categoria.area).all():

                if x.id == int(participante_id):
                    Participante.objects.filter(id=x.id).update(votos=F('votos') + 1)
                    request.session[categoria.area] = x.nome
                    concluido = True
                    mensagem = "Votação efectuada com sucesso."
        else:
            mensagem = "Já votou nesta categoria e não pode votar novamente"
            concluido = False
            # from django.contrib.sessions.models import Session
            # Session.objects.all().delete()

        data = {
            'concluido': concluido,
            'mensagem': mensagem,
        }
        return JsonResponse(data)
    else:
        raise Http404
