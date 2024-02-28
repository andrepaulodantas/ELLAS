'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
     await queryInterface.bulkInsert('pessoas', [
  {
    nome: 'Solange Estudante',
    email: 'solange@email.com',
    ativo: true,
    role: 'estudante',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nome: 'Igor Estudante',
    email: 'igor@email.com',
    ativo: true,
    role: 'estudante',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nome: 'Aline Estudante',
    email: 'aline@email.com',
    ativo: true,
    role: 'estudante',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nome: 'Fernando Estudante',
    email: 'fernando@email.com',
    ativo: true,
    role: 'estudante',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nome: 'Ricardo Docente',
    email: 'ricardo@email.com',
    ativo: true,
    role: 'docente',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nome: 'Dine Docente',
    email: 'dine@email.com',
    ativo: true,
    role: 'docente',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
 ], {});
  },

  async down (queryInterface, Sequelize) {   
    await queryInterface.bulkDelete('pessoas', null, {});  
  }
};
