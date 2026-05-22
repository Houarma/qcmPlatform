from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/stats/', views.api_stats, name='api_stats'),
    path('api/chart/', views.api_chart, name='api_chart'),
    path('api/wordcloud/', views.api_wordcloud, name='api_wordcloud'),
    path('api/generate/', views.api_generate, name='api_generate'),
    path('api/architecture/', views.api_architecture, name='api_architecture'),
]
