FROM python:3.7
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
RUN useradd recycler
USER recycler
ENTRYPOINT ["python"]
CMD ["app.py"]
