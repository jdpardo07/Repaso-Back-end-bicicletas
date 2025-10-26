# Repaso FastAPI Backend

Cómo arrancar el backend localmente (Windows PowerShell):

1. Abrir PowerShell en `repaso-fastapi-backend`.
2. Activar el entorno virtual:

```powershell
.\venv\Scripts\Activate.ps1
```

3. Arrancar uvicorn (sin reload para evitar reinicios en Windows):

```powershell
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --log-level debug
```

4. Si quieres usar el script incluido:

```powershell
.\run_backend.ps1
```

Notas:
- Si ves que el servidor se inicia y se apaga inmediatamente, prueba ejecutar en una PowerShell nueva y revisa si algún antivirus o proceso está terminando python.
- El frontend debe apuntar por defecto a `http://localhost:8000`. Si lo quieres en otro puerto, exporta `REACT_APP_API_URL` antes de arrancar `npm start`.
