## Riippuvuuksien asentaminen

```sh
npm install
```

## Tietokannan alustaminen
Tietokantamoottorina on käytössä SQlite. Tietokantana toimivan .db-tiedoston sekä sen tarvitsemat taulut voidaan muodostaa seuraavilla komennoilla.

### Kehitystila
```sh
npx knex migrate:latest --env development
```

### Tuotantotila
```sh
npx knex migrate:latest --env production
```

## Käynnistäminen
### Kehitystila
```sh
npm run dev
```

### Tuotantotila
Tuotantotila olettaa, että Vue-sovelluksen optioimitu versio on muodostettu tähän hakemistoon. Sen voi tehdä komennolla
```sh
npm run build-vue
```

Tuotantotilassa käynnistäminen onnistuu sitten komennolla
```sh
npm start
```

## Testien ajaminen
```sh
npm run test
```

