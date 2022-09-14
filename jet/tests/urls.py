import django
from django.urls import include, re_path
from django.contrib import admin

admin.autodiscover()


try:
    from django.urls import path

    urlpatterns = [
        re_path(r'^jet/', include('jet.urls', 'jet')),
        re_path(r'^jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),
        re_path(r'^admin/doc/', include('django.contrib.admindocs.urls')),
        path('admin/', admin.site.urls),
    ]
except ImportError:  # Django < 2.0
    urlpatterns = [
        re_path(r'^jet/', include('jet.urls', 'jet')),
        re_path(r'^jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),
        re_path(r'^admin/doc/', include('django.contrib.admindocs.urls')),
        re_path(r'^admin/', include(admin.site.urls)),
    ]

if django.VERSION[:2] < (1, 8):
    from django.conf.urls import patterns
    urlpatterns = patterns('', *urlpatterns)
