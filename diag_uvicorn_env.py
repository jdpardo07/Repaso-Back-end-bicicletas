import os, sys
print('cwd:', os.getcwd())
print('sys.path:')
for p in sys.path:
    print('-', p)

import importlib, traceback
try:
    m = importlib.import_module('main')
    print('imported main from', m.__file__)
except Exception:
    traceback.print_exc()
    raise
