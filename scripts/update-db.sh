#!/bin/bash

echo "📦 Criando extensão pgcrypto (se necessário)..."
docker exec -i pg-plano-grupo psql -U admin -d plano_grupo -c "CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";"

echo "🧱 Aplicando schema.sql no banco de dados..."
cat schema.sql | docker exec -i pg-plano-grupo psql -U admin -d plano_grupo

echo "✅ Banco de dados atualizado com sucesso."
echo "📥 Atualizando indicadores (seed.sql)..."
cat seed.sql | docker exec -i pg-plano-grupo psql -U admin -d plano_grupo