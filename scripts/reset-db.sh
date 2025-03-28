#!/bin/bash

echo "⚠️  RECRIANDO o banco plano_grupo (ambiente de DEV)..."

# Drop e recria o banco
docker exec -i pg-plano-grupo psql -U admin -d postgres -c "DROP DATABASE IF EXISTS plano_grupo;"
docker exec -i pg-plano-grupo psql -U admin -d postgres -c "CREATE DATABASE plano_grupo;"

# Cria extensão pgcrypto novamente
docker exec -i pg-plano-grupo psql -U admin -d plano_grupo -c "CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";"

# Aplica o schema
echo "📐 Aplicando schema.sql..."
cat schema.sql | docker exec -i pg-plano-grupo psql -U admin -d plano_grupo

echo "✅ Banco recriado e atualizado com sucesso!"
echo "📥 Inserindo indicadores iniciais (seed.sql)..."
cat seed.sql | docker exec -i pg-plano-grupo psql -U admin -d plano_grupo