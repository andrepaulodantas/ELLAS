const neo4j = require('../neo4j');

async function queryPoliciesCountries(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (policy:Person)
    RETURN policy.Título_da_Publicação AS policyName, policy.COUNTRY AS countryName
  `;

  try {
    const result = await session.run(query);
    const policies = result.records.map(record => ({
      policyName: record.get('policyName'),
      countryName: record.get('countryName')
    }));
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryPolicyTypes(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (policy:Person)
    RETURN DISTINCT policy.Tipo_de_Política AS policyType, policy.COUNTRY AS countryName
  `;

  try {
    const result = await session.run(query);
    const policyTypes = result.records.map(record => ({
      policyType: record.get('policyType'),
      countryName: record.get('countryName')
    }));
    res.json(policyTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryPolicyPromotions(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (policy:Person)
    RETURN policy.Título_da_Publicação AS policyName, policy.Results AS policyResults
  `;

  try {
    const result = await session.run(query);
    const policies = result.records.map(record => ({
      policyName: record.get('policyName'),
      policyResults: record.get('policyResults')
    }));
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryPoliciesByCountryAndDate(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (policy:Person)
    WHERE toInteger(policy.Data_Início) > 2015 AND 
          (policy.COUNTRY = 'Peru' OR policy.COUNTRY = 'Brazil' OR policy.COUNTRY = 'Bolivia')
    RETURN policy.Título_da_Publicação AS policyName, policy.Data_Início AS startDate, policy.COUNTRY AS countryName
  `;

  try {
    const result = await session.run(query);
    const policies = result.records.map(record => ({
      policyName: record.get('policyName'),
      startDate: record.get('startDate'),
      countryName: record.get('countryName')
    }));
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativesInBrazil(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.COUNTRY = 'Brazil'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.COUNTRY AS countryName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records
      .map(record => ({
        initiativeName: record.get('initiativeName'),
        countryName: record.get('countryName')
      }))
      .filter(initiative => initiative.initiativeName !== null && initiative.countryName !== null);
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativeDataSource(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Data_Fonte AS datasource
  `;

  try {
    const result = await session.run(query);
    const dataSources = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      datasource: record.get('datasource')
    }));
    res.json(dataSources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativeSocialNetwork(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Link_Rede_Social AS link
  `;

  try {
    const result = await session.run(query);
    const socialNetworks = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      link: record.get('link')
    }));
    res.json(socialNetworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativesOfProgram(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Tipo = 'Program'
    RETURN initiative.Título_da_Publicação AS initiativeName
  `;

  try {
    const result = await session.run(query);
    const programs = result.records.map(record => ({
      initiativeName: record.get('initiativeName')
    }));
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryPublicPrivateInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Setor_Organizacional AS sector
  `;

  try {
    const result = await session.run(query);
    const sectors = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      sector: record.get('sector')
    }));
    res.json(sectors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryIndividualCoordinatedInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Tipo_Coordenador = 'Personal'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Tipo_Coordenador AS coordinatorType
  `;

  try {
    const result = await session.run(query);
    const individuals = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      coordinatorType: record.get('coordinatorType')
    }));
    res.json(individuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativeCoordinatorGender(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Gênero_Coordenador AS coordinatorGender
  `;

  try {
    const result = await session.run(query);
    const genders = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      coordinatorGender: record.get('coordinatorGender')
    }));
    res.json(genders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativeObjective(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Objetivo AS objective
  `;

  try {
    const result = await session.run(query);
    const objectives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      objective: record.get('objective')
    }));
    res.json(objectives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativeFormat(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Formato AS format
  `;

  try {
    const result = await session.run(query);
    const formats = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      format: record.get('format')
    }));
    res.json(formats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativesForGirls(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Audiência_Alvo = 'Girls' OR initiative.Audiência_Alvo = 'Adolescents'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Audiência_Alvo AS targetAudienceAge
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      targetAudienceAge: record.get('targetAudienceAge')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativeTargetGender(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Gênero_Audiência_Alvo AS targetAudienceGender
  `;

  try {
    const result = await session.run(query);
    const genders = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      targetAudienceGender: record.get('targetAudienceGender')
    }));
    res.json(genders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativesForBlackWomen(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Raça_Audiência_Alvo = 'Black' AND initiative.Gênero_Audiência_Alvo = 'Female'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Raça_Audiência_Alvo AS targetAudienceRace, initiative.Gênero_Audiência_Alvo AS targetAudienceGender
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      targetAudienceRace: record.get('targetAudienceRace'),
      targetAudienceGender: record.get('targetAudienceGender')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function querySchoolLevelInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Nível_Educacional_Audiência_Alvo = 'Undergraduate'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Nível_Educacional_Audiência_Alvo AS targetAudienceEducationalLevel
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      targetAudienceEducationalLevel: record.get('targetAudienceEducationalLevel')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativesForVulnerableGroups(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Grupo_Vulnerável_Audiência_Alvo = 'disabilities'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Grupo_Vulnerável_Audiência_Alvo AS targetAudienceVulnerable
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      targetAudienceVulnerable: record.get('targetAudienceVulnerable')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function querySchoolCommunityInvolvement(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Stakeholders = 'School'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Stakeholders AS targetAudienceStakeholders
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      targetAudienceStakeholders: record.get('targetAudienceStakeholders')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryCityInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Cidade = 'Curitiba'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Cidade AS cityName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      cityName: record.get('cityName')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryStateInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Estado = 'Paraná'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Estado AS stateName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      stateName: record.get('stateName')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryAreaInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Área = 'Urban'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Área AS areaName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      areaName: record.get('areaName')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryRegionInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Região = 'Coast'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Região AS regionName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      regionName: record.get('regionName')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryInitiativesByReach(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Alcance = 'Local'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Alcance AS reach
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      reach: record.get('reach')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryFundedInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Financiado_Por AS organizationName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      organizationName: record.get('organizationName')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryFundingSector(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Setor_Organizacional AS sector
  `;

  try {
    const result = await session.run(query);
    const sectors = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      sector: record.get('sector')
    }));
    res.json(sectors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
}

async function queryActiveInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Status = 'Active'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Status AS status
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      status: record.get('status')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
    }
}

async function queryInitiativesByType(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Tipo AS type
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      type: record.get('type')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativesByCountry(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.COUNTRY AS countryName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      countryName: record.get('countryName')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativesByRegion(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Região AS regionName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      regionName: record.get('regionName')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativesByCity(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Cidade AS cityName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      cityName: record.get('cityName')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function queryInitiativesByState(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Estado AS stateName
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      stateName: record.get('stateName')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/* In which countries the policy was applied? 

Are these initiatives public or private? 

PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?sector where { 
	?initiative a Ellas:Program.
    ?initiative rdfs:label ?initiativeName.
    ?initiative Ellas:initiative_organization_sector ?sector
    
} */

async function queryInitiativesBySector(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Tipo = 'Program'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Setor_Organizacional AS sector
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      sector: record.get('sector')
    }));
    res.json(initiatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/* What initiatives serve black women? 

PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?targetAudienceRace ?targetAudienceGender where { 
	?initiative a Ellas:Initiative.
    ?initiative rdfs:label ?initiativeName.
    
    ?initiative Ellas:focused_on ?targetAudience.
    ?targetAudience a Ellas:Target_Audience_Race.
    ?targetAudience rdfs:label ?targetAudienceRace.
    
    ?initiative Ellas:focused_on ?targetAudienceG.
    ?targetAudienceG a Ellas:Target_Audience_Gender.
    ?targetAudienceG rdfs:label ?targetAudienceGender.
    
    filter( regex(str(?targetAudienceRace), "Black") || regex(str(?targetAudienceRace), "black")   )
    filter( regex(str(?targetAudienceGender), "Feminine"))
} */

async function queryInitiativesForBlackWomen(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Raça_Audiência_Alvo = 'Black' AND initiative.Gênero_Audiência_Al
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Raça_Audiência_Alvo AS targetAudienceRace, initiative.Gênero_Audiência_Alvo AS targetAudienceGender
  `;

  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      targetAudienceRace: record.get('targetAudienceRace'),
      targetAudienceGender: record.get('targetAudienceGender')
    }));
    res.json(initiatives);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/*What initiatives are being developed <at a given school level>? 

PREFIX Ellas: <https://ellas.ufmt.br/Ontology/Ellas#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select ?initiativeName ?targetAudienceEducationalLevel where { 
	?initiative a Ellas:Initiative.
    ?initiative rdfs:label ?initiativeName.
    
    ?initiative Ellas:focused_on ?targetAudience.
    ?targetAudience a Ellas:Target_Audience_EducationalLevel.
    ?targetAudience rdfs:label ?targetAudienceEducationalLevel.   
    
    filter( regex(str(?targetAudienceEducationalLevel), "Undergraduate") || regex(str(?targetAudienceEducationalLevel), "undergraduate"))

} */

async function querySchoolLevelInitiatives(req, res) {
  const session = neo4j.session();
  const query = `
    MATCH (initiative:Person)
    WHERE initiative.Nível_Educacional_Audiência_Alvo = 'Undergraduate'
    RETURN initiative.Título_da_Publicação AS initiativeName, initiative.Nível_Educacional_Audiência_Alvo AS targetAudienceEducationalLevel, initiative.LEVEL AS level
  `;
  
  try {
    const result = await session.run(query);
    const initiatives = result.records.map(record => ({
      initiativeName: record.get('initiativeName'),
      targetAudienceEducationalLevel: record.get('targetAudienceEducationalLevel')
    }));
    res.json(initiatives);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  queryPoliciesCountries,
  queryPolicyTypes,
  queryPolicyPromotions,
  queryPoliciesByCountryAndDate,
  queryInitiativesInBrazil,
  queryInitiativeDataSource,
  queryInitiativeSocialNetwork,
  queryInitiativesOfProgram,
  queryPublicPrivateInitiatives,
  queryIndividualCoordinatedInitiatives,
  queryInitiativeCoordinatorGender,
  queryInitiativeObjective,
  queryInitiativeFormat,
  queryInitiativesForGirls,
  queryInitiativeTargetGender,
  queryInitiativesForBlackWomen,
  querySchoolLevelInitiatives,
  queryInitiativesForVulnerableGroups,
  querySchoolCommunityInvolvement,
  queryCityInitiatives,
  queryStateInitiatives,
  queryAreaInitiatives,
  queryRegionInitiatives,
  queryInitiativesByReach,
  queryFundedInitiatives,
  queryFundingSector,
  queryActiveInitiatives,
  queryInitiativesByType,
  queryInitiativesByCountry,
  queryInitiativesByRegion,
  queryInitiativesByCity,
  queryInitiativesByState,
  queryInitiativesBySector,
  queryInitiativesForBlackWomen,
  querySchoolLevelInitiatives
};