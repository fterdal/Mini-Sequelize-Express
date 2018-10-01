const Sequelize = require('sequelize')

const db = new Sequelize('postgres://localhost/mini-sequelize', {
  logging: false,
  operatorsAliases: false
})

const Witch = db.define('witch', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  age: {
    type: Sequelize.FLOAT,
    validate: { min: 0, max: 90 }
  }
})

const halloween = async () => {
  try {
    await db.sync({ force: true })
    const witches = [
      {
        name: 'Gertrude',
        age: 45.75
      },
      {
        name: 'Baba Yaga',
        age: 1000
      },
    ]
    // Apparently, bulkCreate doesn't run any of the validations. It totally
    // ignores the min max stuff, and Postgres doesn't know about these
    // validations
    await Witch.bulkCreate(witches)
    // await Witch.create({
    //   name: 'Baba Yaga',
    //   age: 1000
    // })
    db.close()
  } catch (err) {
    console.error(err)
    db.close()
  }
}
halloween()
