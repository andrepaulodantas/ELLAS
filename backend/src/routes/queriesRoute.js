const express = require('express');
const router = express.Router();
const {
  queryInitiativesInBrazil,
  queryPoliciesCountries,
  queryPolicyTypes,
  queryPolicyPromotions,
  queryPoliciesByCountryAndDate,
  queryInitiativeDataSource,
  queryInitiativeSocialNetwork,
  queryInitiativesOfProgram,
  queryPublicPrivateInitiatives,
  queryIndividualCoordinatedInitiatives,
  queryInitiativeCoordinatorGender,
  queryInitiativeObjective,
  queryInitiativeFormat,
  queryInitiativesForGirls,
  queryInitiativesForBlackWomen,
  querySchoolLevelInitiatives,
} = require('../controllers/queriesController');

router.get('/initiatives/brazil', queryInitiativesInBrazil);
router.get('/policies/countries', queryPoliciesCountries);
router.get('/policy/types', queryPolicyTypes);
router.get('/policy/promotions', queryPolicyPromotions);
router.get('/policies/country-date', queryPoliciesByCountryAndDate);
router.get('/initiative/data-source', queryInitiativeDataSource);
router.get('/initiative/social-network', queryInitiativeSocialNetwork);
router.get('/initiatives/program', queryInitiativesOfProgram);
router.get('/initiatives/public-private', queryPublicPrivateInitiatives);
router.get('/initiatives/individual-coordinated', queryIndividualCoordinatedInitiatives);
router.get('/initiatives/coordinator-gender', queryInitiativeCoordinatorGender);
router.get('/initiatives/objective', queryInitiativeObjective);
router.get('/initiatives/format', queryInitiativeFormat);
router.get('/initiatives/girls', queryInitiativesForGirls);
router.get('/initiatives/black-women', queryInitiativesForBlackWomen);
router.get('/initiatives/school-level', querySchoolLevelInitiatives);

module.exports = router;
