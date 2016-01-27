'''
    URL handlers
'''
import logging
from django import shortcuts
from django.http import HttpResponseRedirect

def Render(request, template, params = {}):
  return shortcuts.render_to_response(template, params)

def Home(request):
  return Render(request, 'index.html')
