import requests
import zipfile
import io
import os

repo_url = 'https://github.com/RohanShrivastava08/Login-SignUp-Form-using-React-Vite'
branch = 'main'
local_destination = './public'

zip_url = f"{repo_url}/archive/refs/heads/{branch}.zip"

response = requests.get(zip_url)
response.raise_for_status()

with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
    prefix = f"Login-SignUp-Form-using-React-Vite-{branch}/public/"
    for file_info in zf.infolist():
        if file_info.filename.startswith(prefix) and not file_info.is_dir():

            relative_path = file_info.filename[len(prefix):]
            target_path = os.path.join(local_destination, relative_path)

            os.makedirs(os.path.dirname(target_path), exist_ok=True)

            with zf.open(file_info) as source, open(target_path, "wb") as target:
                target.write(source.read())

print("SRC скопійований у:", os.path.abspath(local_destination))
