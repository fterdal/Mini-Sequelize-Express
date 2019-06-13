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

const Friendship = db.define('friendship', {
  longTerm: Sequelize.BOOLEAN,
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

Witch.belongsToMany(Familiar, { through: Friendship })
Familiar.belongsToMany(Witch, { through: Friendship })
Friendship.belongsTo(Witch)
Friendship.belongsTo(Familiar)

const seed = async () => {
  try {
    await db.sync({ force: true })

    const witches = await Promise.all(seedWitches.map(wch => Witch.create(wch)))
    const familiars = await Promise.all(
      seedFamiliars.map(fam => Familiar.create(fam))
    )

    const [witch1, witch2] = witches
    const [familiar1] = familiars

    await Promise.all([
      Friendship.create({ witchId: witch1.id, familiarId: familiar1.id }),
      Friendship.create({ witchId: witch2.id, familiarId: familiar1.id }),
    ])

    // console.log(await witch1.getFamiliars())
    // console.log(await familiar1.getWitches())

    const friendships = await Friendship.findAll({
      where: { witchId: witch1.id },
      include: [{ model: Familiar }],
    })
    console.log(friendships.map(fr => fr.familiar))
  } catch (err) {
    console.error(err)
    db.close()
  }
}
seed()
