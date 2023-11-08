## README

Welcome to the short documentation of royex project!

----

### Commands
#### Run API
```poetry run uvicorn apiserver.main:app```

#### Run Client
```npm run dev --prefix web```

#### Install dependencies
```poetry install --no-root```

#### Activate Virtual Environment
```poetry shell```

#### Leave Shell (Without exiting Virtual Environment)
```deactivate```

#### Leave Shell AND Virtual Environment
```exit```

#### Running a Command-Line Tool
```poetry run ...```
For example:
```poetry run python script.py```

----

### Workflow

1. Install dependencies by running ```poetry install --no-root```
2. Activate environment by running ```poetry shell```
3. Run API by running ```poetry run uvicorn apiserver.main:app```
4. Run client by running ```npm run dev --prefix web```