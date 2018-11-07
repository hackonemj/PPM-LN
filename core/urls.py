from django.urls import path
from django.views.generic import TemplateView

from core import views

app_name = 'core'

urlpatterns = [
    path('', views.inicio, name='inicio'),
    path('sobre-concurso/', TemplateView.as_view(template_name="sobre_concurso.html"), name="sobre-concurso"),
    path('regulamentos/', TemplateView.as_view(template_name="regulamentos.html"), name="regulamentos"),
    path('categoria/', views.CategoriaView.as_view(), name='categoria-list'),
    path('resultados/', views.ResultadoList, name='resultado'),
    path('ajax/<id>/', views.ajax_categoria_detail, name='ajax_categoria_detail'),
    path('ajax-votar/<categoria_id>/<participante_id>/', views.ajax_votar, name='ajax_votar'),
]
