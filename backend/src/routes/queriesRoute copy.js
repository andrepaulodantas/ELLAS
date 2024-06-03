const express = require('express');
const router = express.Router();
const queriesController = require('../controllers/queriesController');

router.get('/policies/countries', queriesController.queryPoliciesCountries);
router.get('/policies/types', queriesController.queryPolicyTypes);
router.get('/policies/promotions', queriesController.queryPolicyPromotions);
router.get('/policies/by-country-and-date', queriesController.queryPoliciesByCountryAndDate);
router.get('/initiatives/brazil', queriesController.queryInitiativesInBrazil);
router.get('/initiatives/datasource', queriesController.queryInitiativeDataSource);
router.get('/initiatives/socialnetwork', queriesController.queryInitiativeSocialNetwork);
router.get('/initiatives/program', queriesController.queryInitiativesOfProgram);
router.get('/initiatives/publicprivate', queriesController.queryPublicPrivateInitiatives);
router.get('/initiatives/coordinatedbyindividuals', queriesController.queryIndividualCoordinatedInitiatives);
router.get('/initiatives/coordinatorgender', queriesController.queryInitiativeCoordinatorGender);
router.get('/initiatives/objective', queriesController.queryInitiativeObjective);
router.get('/initiatives/format', queriesController.queryInitiativeFormat);
router.get('/initiatives/forgirls', queriesController.queryInitiativesForGirls);
//  queryInitiativesBySector
router.get('/initiatives/sector', queriesController.queryInitiativesBySector);
// queryInitiativesForBlackWomen
router.get('/initiatives/blackwomen', queriesController.queryInitiativesForBlackWomen);
// querySchoolLevelInitiatives
router.get('/initiatives/schoollevel', queriesController.querySchoolLevelInitiatives);

module.exports = router;