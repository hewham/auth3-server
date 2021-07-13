const express = require('express');
const router = express.Router();
const registry = require('../services/registry');
const validateRoles = require('../security/validateRoles');

router

  .get("/:id", async (req, res, next) => res.status(404).json({ message: "Not Found. get /:id disabled for metadata" }))
  .post("/", async (req, res, next) => res.status(404).json({ message: "Not Found. Post disabled for metadata" }))
  .delete("/:id", async (req, res, next) => res.status(404).json({ message: "Not Found. Delete disabled for metadata" }))


  .get("/", validateRoles([
    { name: 'anonacy_admin', required: false },
    { name: 'anonacy_user', required: false }
  ]), async (req, res, next) => {
    try {
      const metadata = await registry.getInstance().dbService.findById("Metadata", 1); // repo.metadata.findById(metadataID);
      return res.status(200).json({ status: 200, data: metadata, message: "Successfully retrieved metadata" });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  })

  .put("/", validateRoles([
    { name: 'anonacy_admin', required: true }
  ]), async (req, res, next) => {
    try {
      const metadataID = 1;
      const {
        webappVersion, mobileVersion, adminVersion, expressVersion
      } = req.body;
      const metadataDetails = {
        webappVersion, mobileVersion, adminVersion, expressVersion
      };

      const [metadata] = await registry.getInstance().dbService.update('Metadata', metadataID, metadataDetails);
      if (metadata) {
        // Post to slack on version update
        if (webappVersion || mobileVersion || adminVersion || expressVersion) {
          let text = "";
          if (webappVersion) text = "[app.anonacy.com] Web App Deployed! Version v" + webappVersion;
          if (mobileVersion) text = "[mobile app] Mobile App Deployed! Version v" + mobileVersion;
          if (adminVersion) text = "[admin.anonacy.com] Admin Dashboard Deployed! Version v" + adminVersion;
          if (expressVersion) text = "[api.anonacy.com] Express Server Deployed! Version anonacy/express:" + expressVersion;
          await registry.getInstance().slackService.sendSlackMessage("version", text);
        }
        return res.status(200).json({ status: 200, data: metadata, message: "Successfully updated metadata" });
      }
      return res.status(404).json({ status: 404, message: 'Tried to update a field that does not exist' });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  });

module.exports = router;
