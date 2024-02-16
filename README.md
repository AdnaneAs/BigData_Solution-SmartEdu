# SmartEdu : Big Data Solution for Video Processing

### Objectif :

This repository introduces a Big Data solution designed for ingesting educational video data into HDFS. The system performs image processing operations on these videos and provides a user-friendly web interface for visualizing valuable insights. The project aims to support teachers in enhancing the educational experience by offering a comprehensive platform for video analysis and insights.

### Configuration :
1. Clone the repo
```bash
git clone https://github.com/AdnaneAs/BigData_Solution-SmartEdu.git
```

2. Go to the directory and create a new network
```bash
docker network create SmartEdu-network
```
creating a network serves to establish a communication bridge between Docker containers


3. run the container
```bash
docker-compose up
```

4. in a terminal execute this commande that enable to access to the backend container shell

```bash
docker exec -it SmartEdu_backend /bin/bash
```

then execute this to launch zookeeper server

```bash
/usr/local/kafka/bin/zookeeper-server-start.sh /usr/local/kafka/config/zookeeper.properties
```


5. in another terminale execute:

```bash
docker exec -it SmartEdu_backend /bin/bash
```

then launch kafka server

```bash
/usr/local/kafka/bin/kafka-server-start.sh /usr/local/kafka/config/server.properties
```

6. To stop the containers use
```bash
docker-compose down
```

### In the Local machine Video be in 
```BigData_Solution_SmartEdu\src\videos``` in the cloned  repository.

***Inside hdfs the video will be in*** ```/kafka_output```

<!-- ### Run the ingestion service

1. open a jupyter notebook in you browser (its already installed and running, you will find the link in the terminal where you run the conatiner ```docker-compose up```)

2. open ```kafka_producer.ipynb``` and run the cell
3. open ```kafka_consumer.ipynb``` and run the cell

### You can acced to the interface via 

```bash
localhost:3000
``` -->