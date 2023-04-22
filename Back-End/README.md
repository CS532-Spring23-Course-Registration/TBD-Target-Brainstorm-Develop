## Using Virtualenv in Flask

Virtualenv is a useful tool to create isolated Python environments, which is particularly helpful when working on a Flask project that requires specific versions of libraries or modules. Here are the steps to use virtualenv in Flask:

1. Install virtualenv using pip:

   ```
   pip install virtualenv
   ```

2. Create a virtual environment for your Flask project:

   ```
   virtualenv env
   ```

3. Activate the virtual environment:

   ```
   source env/bin/activate
   ```

4. Install Flask and other dependencies inside the virtual environment:

   ```
   pip install Flask
   ```
    ```
    make download
    ```

5. Run the flask application

    ```
    flask --app server run
    ```

6. Before you deactivate the virtual environment and end your coding session

    ```
    pip freeze > requirements.txt

7. Once you're done working on your project, deactivate the virtual environment:

   ```
   deactivate
   ```

By using virtualenv, you can ensure that your Flask project has its own isolated environment and doesn't interfere with any other projects or system libraries.

Remember to activate the virtual environment whenever you start working with this project.

> **IMPORTANT**: Whenever you need to install a new package for your Flask project, be sure to do so inside the virtual environment by activating it with the command:

```
source env/bin/activate
```

This ensures that the new package and its dependencies are isolated from your system's global Python installation.

After installing the package, make sure to record it in the `requirements.txt` file by running the following command:

```
pip freeze > requirements.txt
```

This command will update the `requirements.txt` file with the new package and its version. It's important to do this so that other people who work on the project can easily install the same packages as you by running the command:

```
pip install -r requirements.txt
```

This will install all the packages listed in the `requirements.txt` file, ensuring that everyone is working with the same set of dependencies.