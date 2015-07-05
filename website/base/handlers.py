''' 
    Online Deasciifier handlers
    
    Author: Mustafa Acer
'''
import logging
from django import shortcuts
from django.http import HttpResponseRedirect

def Render(request, template, params = {}):
  return shortcuts.render_to_response(template, params)

def Home(request):
  return Render(request, 'index.html')

def ChromeExtensionInstall(request):
  logging.info("Redirecting to Chrome extension page")
  return HttpResponseRedirect('https://chrome.google.com/extensions/detail/nhfdmlgglfmcdheoabgklabmgjklgofk')
  
def SafariExtensionUpdate(request):
  logging.info("Redirecting to Safari extension manifest page")
  return HttpResponseRedirect('http://www.mustafaacer.com/deasciifier/safari/updatemanifest.plist')

def SafariExtensionInstall(request):
  logging.info("Redirecting to Safari extension page")
  return HttpResponseRedirect('http://www.mustafaacer.com/deasciifier/safari/safari_deasciifier.safariextz')

def FirefoxExtensionInstall(request):
  logging.info("Redirecting to Firefox extension page")
  return HttpResponseRedirect('https://addons.mozilla.org/en-US/firefox/addon/204311/')

