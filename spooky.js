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

Familiar.belongsTo(Witch)
Witch.hasMany(Familiar)

const witches = [
  {
    name: 'Gertrude',
    age: 45.75,
  },
  {
    name: 'Baba Yaga',
    age: 1000,
  },
]

const familiars = [
  {
    name: 'Flappy',
    species: 'bat',
  },
  {
    name: 'Fluffy',
  },
]

const halloween = async () => {
  try {
    await db.sync({ force: true })
    const [[gertrude, baba], [flappy, fluffy]] = await Promise.all([
      Witch.bulkCreate(witches),
      Familiar.bulkCreate(familiars, { returning: true }),
    ])
    // console.log(fluffy.name)
    // console.log(fluffy.__proto__)
    // await Promise.all([flappy.setWitch(baba), fluffy.setWitch(baba)])
    const aWitch = await Witch.findOne({
      where: { id: 1 },
      raw: true
    })
    console.log(aWitch)
    db.close()
  } catch (err) {
    console.error(err)
    db.close()
  }
}
halloween()
