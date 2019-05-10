const Sequelize = require('sequelize')

const db = new Sequelize('postgres://localhost/mini-sequelize', {
  logging: false,
  operatorsAliases: false,
})

const Witch = db.define('witch', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  age: {
    type: Sequelize.FLOAT,
    validate: { min: 0, max: 9000 },
  },
})

const Familiar = db.define('familiar', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  species: {
    type: Sequelize.ENUM('cat', 'bat', 'toad'),
    defaultValue: 'cat',
  },
})

const seedWitches = [
  {
    name: 'Sabrina',
    age: 45.75,
  },
  {
    name: 'Baba Yaga',
    age: 1000,
  },
]

const seedFamiliars = [
  {
    name: 'Flappy',
    species: 'bat',
  },
  {
    name: 'Fluffy',
  },
]

const seed = async () => {
  try {
    await db.sync({ force: true })
    console.log('hello')
    const witches = await Witch.bulkCreate(seedWitches)
    console.log(witches.map(witch => witch.name))
  } catch (err) {
    console.error(err)
    db.close()
  }
}
seed()
