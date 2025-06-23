# Microsserviço de Gerenciamento de Documentos

Este microsserviço, construído com **NestJS**, é responsável pelo gerenciamento de documentos, incluindo funcionalidades de upload, download e deleção. Ele utiliza **MinIO** para armazenamento de objetos (compatível com S3) e **Apache Kafka** para comunicação assíncrona, principalmente para notificar outros serviços sobre eventos de upload de arquivos.

## 🚀 Funcionalidades

* **Upload de Arquivos por URL**: Permite o upload de arquivos para o armazenamento de objetos (MinIO) a partir de uma URL externa fornecida.
* **Download de Arquivos**: Permite o download de arquivos armazenados no MinIO.
* **Geração de URL Pré-assinada**: Gera URLs temporárias e seguras para download direto de arquivos do MinIO, sem exigir autenticação do cliente final.
* **Deleção de Arquivos**: Remove arquivos do armazenamento de objetos (MinIO).
* **Notificações Kafka**: Após um upload bem-sucedido, envia uma mensagem para um tópico Kafka (`arquivos.uploaded`) contendo metadados do arquivo (token, filename, etag, target_service).

## 🛠️ Tecnologias Utilizadas

* **NestJS**: Framework progressivo para Node.js, para construir aplicações eficientes, confiáveis e escaláveis do lado do servidor.
* **MinIO**: Servidor de armazenamento de objetos de alta performance, compatível com a API Amazon S3. Utilizado para armazenar os documentos.
* **Apache Kafka**: Plataforma de streaming distribuído de eventos. Utilizado para comunicação assíncrona e desacoplamento entre serviços.
* **Docker & Docker Compose**: Para orquestrar e gerenciar os serviços de infraestrutura (MinIO, Kafka, ZooKeeper) de forma isolada e replicável.
* **KafkaJS**: Cliente Node.js para Kafka.
* **AWS SDK for JavaScript v3**: Utilizado para interagir com a API compatível com S3 do MinIO.
* **Swagger (OpenAPI)**: Para documentação interativa da API e testes manuais via interface web.

## ⚙️ Configuração do Ambiente (Desenvolvimento Local)

Para rodar este microsserviço localmente, você precisará ter o [Docker](https://www.docker.com/products/docker-desktop/) e o [Node.js](https://nodejs.org/) instalados em sua máquina.

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd microservico-documento-main # Ou o nome do seu diretório
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
    ```env
    # --- Variáveis de Ambiente para S3 (MinIO) ---
    S3_REGION=us-east-1
    S3_ENDPOINT=http://localhost:9000
    S3_ACCESS_KEY=admin
    S3_SECRET_KEY=admin123
    S3_BUCKET=test-bucket

    # --- Variáveis de Ambiente para Kafka ---
    KAFKA_BROKERS=localhost:9092
    KAFKA_CLIENT_ID=microservice-documento
    KAFKA_GROUP_ID=document-group

    # Porta da aplicação NestJS (opcional, padrão é 3000)
    PORT=3000
    ```

4.  **Inicie os serviços de infraestrutura com Docker Compose:**
    Certifique-se de que seu arquivo `docker-compose.yml` está atualizado para incluir **MinIO, ZooKeeper e Kafka**:
    ```yaml
    # docker-compose.yml (Versão completa com MinIO, Zookeeper e Kafka)
    version: '3.8'
    services:
      minio:
        image: quay.io/minio/minio
        container_name: minio
        ports: ["9000:9000", "9001:9001"]
        environment: {MINIO_ROOT_USER: admin, MINIO_ROOT_PASSWORD: admin123}
        volumes: ["minio-data:/data"]
        command: server /data --console-address ":9001"
      zookeeper:
        image: confluentinc/cp-zookeeper:7.6.0
        container_name: zookeeper
        ports: ["2181:2181"]
        environment: {ZOOKEEPER_CLIENT_PORT: 2181, ZOOKEEPER_TICK_TIME: 2000}
      kafka:
        image: confluentinc/cp-kafka:7.6.0
        container_name: kafka
        ports: ["9092:9092"]
        depends_on: [zookeeper]
        environment:
          KAFKA_BROKER_ID: 1
          KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
          KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
          KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT
          KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
          KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
          KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
    volumes: {minio-data: {}}
    ```
    Execute no terminal:
    ```bash
    docker-compose up -d
    ```
    **Aguarde alguns segundos (30s-1min) para que Kafka e ZooKeeper inicializem completamente.** Você pode verificar os logs com `docker-compose logs -f kafka` até ver mensagens de estabilidade.

5.  **Inicie a aplicação NestJS:**
    ```bash
    npm run start:dev
    ```
    O servidor será iniciado e você verá uma mensagem no console indicando a porta e a URL do Swagger.

## 📄 Documentação e Testes Manuais da API (Swagger)

Uma vez que a aplicação esteja rodando, você pode acessar a documentação interativa da API (Swagger UI) em:
[http://localhost:3000/api](http://localhost:3000/api)

Use esta interface para explorar todos os endpoints de **upload, download e delete**, preencher parâmetros e enviar requisições para testar as funcionalidades manualmente.

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades.
