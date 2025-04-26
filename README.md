# Metropole Garage

Sistema de garagem para FiveM desenvolvido em TypeScript.

## Demo

[![Metropole Garage Demo](https://img.youtube.com/vi/EjUadCmWE5E/0.jpg)](https://youtu.be/EjUadCmWE5E)

## Requisitos

- [oxmysql](https://github.com/overextended/oxmysql)
- TypeScript
- Node.js

## Instalação

1. Clone o repositório
```bash
git clone https://github.com/beoipisilon/metropole-garage.git
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `config.json` com suas garagens:
```json
{
    "garages": [
        {
            "name": "Garagem Central",
            "coords": { "x": 224.38, "y": -803.61, "z": 30.63, "heading": 270.0 },
            "spawnLocations": [
                { "x": 224.44, "y": -796.6, "z": 29.99, "heading": 270.0 },
                { "x": 224.76, "y": -793.51, "z": 30.68, "heading": 270.0 }
            ],
        }
    ]
}
```

4. Compile o projeto para gerar a versão de produção:
```bash
npm run build
```

5. Adicione o recurso ao seu `server.cfg`:
```cfg
ensure metropole-garage
```

## Comandos

- `/car [placa]` - Spawna um veículo da garagem (requer permissão ACE `spawn.vehicle`)
- `/dv` - Deleta o veículo mais próximo (requer permissão ACE `delete.vehicle`)

## Desenvolvimento

Para gerar build de produção

```bash
npm run build
```

Para desenvolvimento com atualizações instantâneas

```bash
npm run watch
```