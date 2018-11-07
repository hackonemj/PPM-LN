from django.contrib import admin

from .models import Participante, Categoria


class ParticipanteInline(admin.TabularInline):
    model = Participante
    extra = 3


class CategoriaAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['nome', 'area', 'imagem']}),
        ('Date information', {'fields': ['pub_date'], 'classes': ['collapse']}), ]
    inlines = [ParticipanteInline]


admin.site.register(Categoria, CategoriaAdmin)
