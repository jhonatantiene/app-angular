# Use uma imagem base do Node.js
FROM node:latest as build

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o arquivo de definição de dependências e instalar as dependências
COPY package*.json ./
RUN npm install

# Copiar todos os arquivos do projeto para o contêiner
COPY . .

# Compilar o projeto Angular
RUN npm run build

# Use uma imagem Nginx leve para servir o aplicativo Angular compilado
FROM nginx:alpine

# Copiar os arquivos compilados do Angular para o diretório de publicação do Nginx
COPY --from=build /app/dist/app-angular/browser /usr/share/nginx/html/

# Expor a porta 80 para o mundo exterior
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]
