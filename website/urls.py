"""
  Online Deasciifier Url mappings
  Author: Mustafa Acer
"""
from django.conf.urls import patterns
from django.views.generic import TemplateView

urlpatterns = patterns('',
  #(r'^extensions/chrome$', 'base.handlers.ChromeExtensionInstall'),
  #(r'^extensions/firefox$', 'base.handlers.FirefoxExtensionInstall'),
  #(r'^extensions/safari/update$', 'base.handlers.SafariExtensionUpdate'),
  #(r'^extensions/safari$', 'base.handlers.SafariExtensionInstall'),
  (r'.*', TemplateView.as_view(template_name='index.html')),
  (r'^$', TemplateView.as_view(template_name='index.html'))
)
