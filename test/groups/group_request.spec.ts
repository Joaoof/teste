import Database from "@ioc:Adonis/Lucid/Database"
import User from "App/Models/User"
import { GroupFactory, UserFactory } from "Database/factories"
import test from "japa"
import supertest from "supertest"

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Group Request', (group) => {
  test.only('it should create a group request', async (assert) => {
   const user = await UserFactory.create()
   const group = await GroupFactory.merge({master: user.id}).create()
   const { body } = await supertest(BASE_URL).post(`/groups/${group.id}/requests`).send({}).expect(201)

   assert.exists(body.groupRequest, 'GroupRequest undefined')
   assert.equal(body.groupRequest.userId, user.id)
   assert.equal(body.groupRequest.groupId, group.id)
   assert.equal(body.groupRequest.status, 'PENDING')
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
