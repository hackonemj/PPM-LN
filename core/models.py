from django.db import models


class Categoria(models.Model):
    imagem = models.ImageField(upload_to='categorias', blank=True)
    nome = models.CharField(max_length=200, unique=True)
    area = models.CharField(max_length=200)
    pub_date = models.DateTimeField('Publicado')

    def __str__(self):
        return self.nome


class Participante(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    nome = models.CharField(max_length=200)
    votos = models.IntegerField(default=0)

    def __str__(self):
        return self.nome
