"""
  Reads the version information from the manifest of the Chrome extension.
  Author: Mustafa Emre Acer
"""

import json
import sys


def ReadChromeExtensionVersion(manifest_path):
  with open(manifest_path) as manifest_file:
    manifest = json.load(manifest_file)
    print(manifest['version'])


if __name__ == "__main__":
  if len(sys.argv) > 1:
    ReadChromeExtensionVersion(sys.argv[1])
  else:
    print('\nUsage: chrome_extension_version.py <manifest_path>\n')
    exit(-1)
