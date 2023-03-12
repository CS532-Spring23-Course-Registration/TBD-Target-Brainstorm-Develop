# Define the name of the Python installer
PIP = pip

update:
	$(PIP) freeze > requirements.txt

install:
	$(PIP) install $(package)

download:
	$(PIP) install -r requirements.txt