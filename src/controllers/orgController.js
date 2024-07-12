const { db } = require('../../db');

const getOrganisations = async (req, res) => {
  const { userId } = req.user; // Assuming req.user contains userId directly

  try {
    // Query to retrieve organisation IDs from the user's organisations array
    const userOrganisationsQuery = await db.query(
      `SELECT organisations FROM users WHERE "userId" = $1`,
      [userId]
    );

    // Extract organisation IDs from the query result
    const organisationIds = userOrganisationsQuery.rows[0]?.organisations || [];

    // Query to retrieve organisations based on organisationIds
    const orgResult = await db.query(
      `SELECT "orgId", "name", "description" 
         FROM organisations 
         WHERE "orgId" = ANY($1)`,
      [organisationIds]
    );

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations: orgResult.rows,
      },
    });
  } catch (error) {
    console.error('Error retrieving organisations:', error);
    res.status(500).json({
      status: 'Internal server error',
      message: 'Failed to retrieve organisations',
      statusCode: 500,
    });
  }
};

const getOrganisationById = async (req, res) => {
  const { orgId } = req.params; // Ensure orgId is properly extracted from req.params
  console.log(orgId);
  try {
    const orgResult = await db.query(
      'SELECT * FROM organisations WHERE "orgId" = $1',
      [orgId]
    );

    if (orgResult.rows.length === 0) {
      return res.status(404).json({
        status: 'Not found',
        message: 'Organization not found',
      });
    }

    const { orgId: fetchedOrgId, name, description } = orgResult.rows[0]; // Rename to fetchedOrgId to avoid naming conflict

    res.status(200).json({
      status: 'success',
      message: 'Organization retrieved successfully',
      data: {
        orgId: fetchedOrgId, // Use fetchedOrgId here
        name,
        description,
      },
    });
  } catch (error) {
    console.error('Error retrieving organization:', error);
    res.status(500).json({
      status: 'Internal server error',
      message: 'Failed to retrieve organization',
      statusCode: 500,
    });
  }
};

module.exports = { getOrganisations, getOrganisationById };
